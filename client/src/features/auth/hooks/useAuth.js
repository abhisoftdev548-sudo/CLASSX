import { useCallback, useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../api/authServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebase.config";
import { signOut } from "firebase/auth";


const useAuth = () => {

  const navigate = useNavigate();
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isInitialized,
    setIsInitialized,
    loading,
    setLoading,
  } = context;

  // Throttle for Google auth to prevent rapid requests
  const googleAuthThrottleRef = useRef(false);

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { response, error } = await authService.getUser();
      console.log(response, error);
      if (error) {
        // Just set unauthenticated state, no need to throw
        setUser(null);
        setIsAuthenticated(false);
      } else if (response?.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [setUser, setIsAuthenticated, setIsInitialized, setLoading]);

  const firebaseLoginSync = async (idToken) => {
    // Prevent multiple simultaneous Google auth requests
    if (googleAuthThrottleRef.current) {
      console.log("Google auth request already in progress, skipping...");
      return;
    }

    googleAuthThrottleRef.current = true;

    try {
      setLoading(true);
      const { response, error } = await authService.googleSync(idToken);
      console.log(response, error);
      if (error) {
        throw new Error(error || "Google sync failed.");
      }
      if(response?.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        toast.success("Welcome back with Google!");
        navigate('/profile');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
      // Reset throttle after a short delay
      setTimeout(() => {
        googleAuthThrottleRef.current = false;
      }, 2000);
    }
  };

  const login = async (data) => {
    try {
      setLoading(true);
      const { response, error } = await authService.login(data);
      console.log(response, error);
            if (error) {
        throw new Error(error || "Login failed, please try again.");
      }
      if(response?.data?.status === "verified"){
        setUser(response.data);
        setIsAuthenticated(true);

        toast.success("Welcome back!");
        navigate('/profile');

      }else if(response?.data?.status === "pending_verification"){
         toast.success(response?.message || "Registration successful");

      navigate("/verify-email");
      }

    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);

      const { response, error } = await authService.register(data);
      console.log(response, error);
      if (error) {
        throw new Error(error || "registration failed, please try again.");
      }

      toast.success(response?.message || "Registration successful");

      navigate("/verify-email");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (otp) => {
    try {
      setLoading(true);
      const requestData = {otp};
      const { response, error } = await authService.verifyEmail(requestData);
      console.log(response, error);
      if (error) {
        throw new Error(error.message);
      }

      const userData = {
        name: response.data.name,
        email: response.data.email,
        mobileNumber: response.data.mobileNumber,
        verified: response.data.verified
      }
      setUser(userData);
      setIsAuthenticated(true);
      toast.success("User Verified successfully");
      navigate("/profile");
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { response, error } = await authService.logout();
      console.log(response, error);
      if (error) {
        throw new Error(error.message);
      }

      // Firebase se bhi sign out karna zaroori hai
      await signOut(auth);

      setUser(null);
      setIsAuthenticated(false);
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { response, error } = await authService.sendEmailVarificationOtp();
      console.log(response, error);
            if (error) {
        throw new Error(error.message);
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const forgetPassword = async (data) => {
    try {
      setLoading(true);
      const { response, error } = await authService.forgetPassword(data);
      if (error) {
        throw new Error(error.message);
      }
      toast.success(response.message);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }
  return {
    user,
    isAuthenticated,
    isInitialized,
    loading,
    initAuth,
    login,
    logout,
    register,
    verifyEmail,
    sendVerificationOtp,
    forgetPassword,
    firebaseLoginSync
  };
};

export default useAuth;
