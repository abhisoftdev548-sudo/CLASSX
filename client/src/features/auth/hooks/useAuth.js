import { useCallback, useContext, useState } from "react";
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

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { response, error } = await authService.getUser();
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
    try {
      setLoading(true);
      const { response, error } = await authService.googleSync(idToken);
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
      console.error("Google Sync Failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      setLoading(true);
      const { response, error } = await authService.login(data);
      console.log(response)
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
      console.error("Login Failed:", error);
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
      console.log(response);
      if (error) {
        throw new Error(error || "registration failed, please try again.");
      }

      toast.success(response?.message || "Registration successful");

      navigate("/verify-email");
    } catch (error) {
      console.error("Ragistration Failed:", error);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (otp) => {
    try {
      setLoading(true);
      const requestData = {otp};
      console.log(requestData)
      const { response, error } = await authService.verifyEmail(requestData);
      if (error) {
        throw new Error(error.message);
      }
      console.log(response)
      console.log(response.data)

      const userData = {
        name: response.data.name,
        email: response.data.email,
        mobileNumber: response.data.mobileNumber,
        verified: response.data.verified
      }
      setUser(userData);
      setIsAuthenticated(true);
      toast.success("User Verified successfully");
      console.log(user)
      navigate("/profile");
    } catch (error) {
      console.error("Login Failed:", error);
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
      console.error("Logout Failed:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const sendVerificationOtp = async () => {
    try {
      setLoading(true);
      const { response, error } = await authService.sendEmailVarificationOtp();
      console.log(response)
      if (error) {
        throw new Error(error.message);
      }
      toast.success(response.message);
    } catch (error) {
      console.error("Logout Failed:", error);
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
      console.error("Forget Password Failed:", error);
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
