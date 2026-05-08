import configEnv from "../../config/config.env.js";
import config from "../../config/config.js";
import { authServices } from "../../services/v1/auth/index.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import ErrorHandler from "../../utils/ErrorHandler.js";


const ragister = catchAsyncError(async (req, res, next) =>{

    const userAgent = req.headers["user-agent"];
    const ip = req.ip;


    const {email, name, password, mobileNumber } = req.body;
    if(!email || !name || !password || !mobileNumber || !userAgent || !ip){
        throw new ErrorHandler("All fields are required", 400);
    }
    
     const {tempToken} = await authServices.ragister({email, name, password, mobileNumber, userAgent, ip})
        const cookieOption = config.cookieOption;
res.cookie("TempToken", tempToken, {
        ...cookieOption,
        maxAge: 30 * 60 * 1000
    });
    return res.status(201).json(new ApiResponse(201, null, "User Created Successfully And Enter the otp to verify"))


})

const login = catchAsyncError(async (req, res, next) => {
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const {email, password} = req.body;
    if(!email || !password || !userAgent || !ip){
        throw new ErrorHandler("All fields are required", 400);
    }
    
    const result =  await authServices.login({email, password, userAgent, ip});
    const cookieOption = config.cookieOption;
    if(!result.isVerified){
        res.cookie("TempToken", result.tempToken, {
        ...cookieOption,
        maxAge: 30 * 60 * 1000
    });
        return res.status(200).json(new ApiResponse(200, null, "varification otp send"));
    }

    const {user, accessToken, refreshToken} = result;

    // Update user status to verified when successfully logged in
    if(user.status !== 'verified') {
        user.status = 'verified';
        await user.save();
    }

res.cookie("RefreshToken", refreshToken, {
        ...cookieOption,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

res.cookie("AccessToken", accessToken, {
        ...cookieOption,
        maxAge: 15 * 60 * 1000
    });

    const responseUserData = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        verified: user.verified,
        status: user.status,
        accessToken: accessToken
    }
    return res.status(200).json(new ApiResponse(200, responseUserData, "User Logged In successfully"))

})

const getMe = catchAsyncError(async (req, res, next) => {
    const user = req.user;

    if(!user){
        throw new ErrorHandler("User not found", 400);
    }

    const responseUserData = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        verified: user.verified,
        status: user.status
    }

    return res.status(200).json(new ApiResponse(200, responseUserData, "User get Successfully"))

})

const tokenRotation = catchAsyncError(async (req, res, next) => {
    const refreshToken = req.cookies.RefreshToken;
    const ip = req.ip
    const userAgent = req.headers["user-agent"];

    if(!userAgent || !ip){
        throw new ErrorHandler("All fields are required", 400);
    }

    if(!refreshToken){
        throw new ErrorHandler("Refresh token not found", 400);
    }

    const {newAccessToken, newRefreshToken} = await authServices.newAccessToken(refreshToken, ip, userAgent);


    const cookieOption = config.cookieOption;
    res.cookie("RefreshToken", newRefreshToken, {
        ...cookieOption,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie("AccessToken", newAccessToken, {
        ...cookieOption,
        maxAge: 15 * 60 * 1000
    });

    const responseUserData = {
        accessToken: newAccessToken
    }
    return res.status(200).json(new ApiResponse(200, responseUserData, "Token Rotated Successfully"))
})

const logout = catchAsyncError(async (req, res, next)=>{
    const user = req.user;
    const userAgent = req.headers["user-agent"];
    if(!user){
        throw new ErrorHandler("User not found", 400);
    }
    await authServices.logout(user, userAgent)

    // Update user status to logout
    user.status = 'logout';
    await user.save();

    res.clearCookie("RefreshToken");
    res.clearCookie("AccessToken");

    return res.status(200).json(new ApiResponse(200, null, "User Logged Out Successfully"))
})

const logoutFromAllDevices = catchAsyncError(async (req, res, next) => {
    const user = req.user;

    await authServices.logoutFromAllDevices(user);

    // Update user status to logout
    user.status = 'logout';
    await user.save();

    res.clearCookie("RefreshToken");
    res.clearCookie("AccessToken");

    return res.status(200).json(new ApiResponse(200, null, "User Logged Out From All Devices Successfully"))
})

const sendEmailVarificationOtp = catchAsyncError(async (req, res, next) => {
    const tempToken = req.cookies.TempToken;
    if(!tempToken){
        throw new ErrorHandler("email token is required", 400);
    }

    await authServices.sendEmailVarificationOtp(tempToken);

    return res.status(200).json(new ApiResponse(200, null, "Otp Sent Successfully"))
})

const verifyEmailOtp = catchAsyncError(async (req, res, next) => {
    const {otp} = req.body;
    console.log(req.body)
    const tempToken = req.cookies.TempToken
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    if( !otp || !userAgent || !ip){
        throw new ErrorHandler("All fields are required", 400);
    }
    if(!tempToken){
        throw new ErrorHandler("Temp token not found", 400);
    }

    const {user, accessToken, refreshToken} = await authServices.verifyEmailOtp(tempToken, otp , userAgent, ip);
    
    // Update user status to verified
    user.status = 'verified';
    await user.save();

   const cookieOption = config.cookieOption;
res.cookie("RefreshToken", refreshToken, {
        ...cookieOption,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
res.cookie("AccessToken", accessToken, {
        ...cookieOption,
        maxAge: 15 * 60 * 1000
    });

console.log("users", user)
    const responseData = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        verified: user.verified,
        status: user.status,
        accessToken: accessToken
    }

    return res.status(200).json(new ApiResponse(200, responseData, "Otp Verified Successfully"))
})

const forgetPassword = catchAsyncError(async (req, res, next) => {
    const {email} = req.body;
    if(!email){
        throw new ErrorHandler("Email is required", 400);
    }

    await authServices.forgetPassword(email);

    return res.status(200).json(new ApiResponse(200, null, "Password Reset Link Sent Successfully"))

})

const resetPassword = catchAsyncError(async (req, res, next) => {
    const {newPassword} = req.body;
    const {resetPasswordToken} = req.params;
    if(!newPassword || !resetPasswordToken){
        throw new ErrorHandler("All fields are required", 400);
    }

    await authServices.resetPassword(resetPasswordToken, newPassword);

    return res.status(200).json(new ApiResponse(200, null, "Password Reset Successfully"))
})
const googleAuthSync = catchAsyncError(async (req, res, next) => {
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const { idToken } = req.body;

    if(!idToken || !userAgent || !ip){
        throw new ErrorHandler("Missing required fields or token", 400);
    }
    
    const result = await authServices.googleAuthSyncService(idToken, userAgent, ip);
    const cookieOption = config.cookieOption;

    const {user, accessToken, refreshToken} = result;

    res.cookie("RefreshToken", refreshToken, {
        ...cookieOption,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie("AccessToken", accessToken, {
        ...cookieOption,
        maxAge: 15 * 60 * 1000
    });

    const responseUserData = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        verified: user.verified,
        status: user.status,
        accessToken: accessToken
    }
    return res.status(200).json(new ApiResponse(200, responseUserData, "Google Auth Synced Successfully"))
});

const authController = {ragister, login, getMe, tokenRotation, logout, logoutFromAllDevices, sendEmailVarificationOtp, verifyEmailOtp, forgetPassword, resetPassword, googleAuthSync};

export default authController;