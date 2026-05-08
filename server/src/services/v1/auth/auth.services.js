import crypto from "crypto";
import admin from "../../../config/firebase-admin.js";

import ErrorHandler from "../../../utils/ErrorHandler.js";
import Mail from "nodemailer/lib/mailer/index.js";
class AuthServices {
  constructor(
    userRepository,
    tokenServices,
    sessionServices,
    otpServices,
    mailTokenServices,
  ) {
    this.userModel = userRepository;
    this.tokenServices = tokenServices;
    this.sessionServices = sessionServices;
    this.otpServices = otpServices;
    this.mailTokenService = mailTokenServices;
  }

  async ragister({ email, name, password, mobileNumber, userAgent, ip }) {
    if (!email || !name || !password || !mobileNumber || !userAgent || !ip) {
      throw new ErrorHandler("All fields are required", 400);
    }

    const isExistingUser = await this.userModel.findByEmailAndMobile(
      email,
      mobileNumber,
    );

    if (isExistingUser) {
      throw new ErrorHandler("user already exists", 400);
    }

    const user = await this.userModel.create({
      email,
      name,
      password,
      mobileNumber,
    });

    const userId = user._id;

    await this.otpServices.generateAndSendVerificationOtp(
      "email-verification",
      email,
      userId,
    );

    const tempToken = await this.tokenServices.generateTempToken(email);

    return { tempToken };
  }

  async login({ email, password, userAgent, ip }) {
    if (!email || !password || !userAgent || !ip) {
      throw new ErrorHandler("All fields are required", 400);
    }

    const user = await this.userModel.findByEmail(email);

    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }
    if (!user.password && user.googleId) {
      throw new ErrorHandler(
        "This account was created using Google. Please click 'Continue with Google' to log in, or use 'Forgot Password' to create a password.",
        400,
      );
    }

    const isValidPassword = await this.userModel.comparePassword(
      email,
      password,
    );

    if (!isValidPassword) {
      throw new ErrorHandler("Invalid password", 400);
    }

    if (!user.verified) {
      const userId = user._id;
      await this.otpServices.generateAndSendVerificationOtp(
        "email-verification",
        email,
        userId,
      );

      const tempToken = await this.tokenServices.generateTempToken(email);
      return { isVerified: false, tempToken };
    }

    const tokenService = this.tokenServices;
    const sessionService = this.sessionServices;

    const userId = user._id;

    const refreshToken = tokenService.generateRefreshToken(userId);
    const accessToken = tokenService.generateAccessToken(userId);

    if (!refreshToken || !accessToken) {
      throw new ErrorHandler("Token creation failed", 400);
    }

    const session = await sessionService.createOrUpdateSession(
      userId,
      refreshToken,
      userAgent,
      ip,
    );

    if (!session) {
      throw new ErrorHandler("Session creation failed", 400);
    }

    return { accessToken, refreshToken, user, isVerified: true };
  }

  async getUserForAccessMiddleware(accessToken) {
    if (!accessToken) {
      throw new ErrorHandler("Access token is required", 400);
    }
    const decoded = await this.tokenServices.verifyAccessToken(accessToken);

    if (!decoded) {
      throw new ErrorHandler("You are not logged in", 400);
    }

    const userId = decoded.id;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }
    return user;
  }

  async newAccessToken(refreshToken, ip, userAgent) {
    if (!refreshToken) {
      throw new ErrorHandler("Refresh token is required", 400);
    }
    const decoded = await this.tokenServices.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new ErrorHandler("Refresh token is invalid", 400);
    }
    const userId = decoded.id;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ErrorHandler("User not found", 401);
    }

    const newAccessToken = this.tokenServices.generateAccessToken(userId);
    const newRefreshToken = this.tokenServices.generateRefreshToken(userId);

    const newSession = await this.sessionServices.updateSession(
      refreshToken,
      newRefreshToken,
      ip,
      userId,
      userAgent,
    );
    return { newAccessToken, newRefreshToken };
  }

  async logout(user, userAgent) {
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }
    const userId = user._id;
    await this.sessionServices.terminateSession(userId, userAgent);

    return;
  }

  async logoutFromAllDevices(user) {
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }
    const userId = user._id;
    await this.sessionServices.terminateAllUserSessions(userId);

    return;
  }

  async sendEmailVarificationOtp(tempToken) {
    if (!tempToken) {
      throw new ErrorHandler("Email token is required", 400);
    }

    const decoded = await this.tokenServices.verifyTempToken(tempToken);
    const email = decoded.email;
    const user = await this.userModel.findByEmail(email);
    const userId = user._id;

    await this.otpServices.generateAndSendVerificationOtp(
      "email-verification",
      email,
      userId,
    );

    return;
  }

  async verifyEmailOtp(tempToken, otp, userAgent, ip) {
    if (!tempToken || !otp || !userAgent || !ip) {
      throw new ErrorHandler("All fields are required", 400);
    }
    console.log(tempToken)
    const decoded = await this.tokenServices.verifyTempToken(tempToken);
    console.log(decoded)
    const email = decoded.email;
    console.log(email)
    const user = await this.userModel.findByEmail(email);

    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }

    if (user.verified) {
      throw new ErrorHandler("User is already verified", 400);
    }

    await this.otpServices.verifyEmailOtp(email, otp);

    const tokenService = this.tokenServices;
    const sessionService = this.sessionServices;

    const userId = user._id;

    const refreshToken = tokenService.generateRefreshToken(userId);
    const accessToken = tokenService.generateAccessToken(userId);

    if (!refreshToken || !accessToken) {
      throw new ErrorHandler("Token creation failed", 400);
    }

    const session = await sessionService.createOrUpdateSession(
      userId,
      refreshToken,
      userAgent,
      ip,
    );

    if (!session) {
      throw new ErrorHandler("Session creation failed", 400);
    }

    const verifiedUser = await this.userModel.setUserVerified(user);

    return { accessToken, refreshToken, user: verifiedUser };
  }

  async forgetPassword(email) {
    if (!email) {
      throw new ErrorHandler("Email is required", 400);
    }

    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new ErrorHandler("User not found", 400);
    }

    const resetPasswordToken = await this.userModel.generateResetToken(email);
    console.log(resetPasswordToken);

    await this.mailTokenService.sendToken(resetPasswordToken, user);

    return;
  }

  async resetPassword(resetPasswordToken, newPassword) {
    if (!resetPasswordToken || !newPassword) {
      throw new ErrorHandler("All fields are required", 400);
    }
    const resetPasswordTokenHash = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    const user = await this.userModel.findAndChangePassword(
      resetPasswordTokenHash,
      newPassword,
    );

    await this.sessionServices.terminateAllUserSessions(user._id);

    return;
  }

  async googleAuthSyncService(idToken, userAgent, ip) {
    if (!idToken) {
      throw new ErrorHandler("Firebase ID token is required", 400);
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new ErrorHandler("Invalid Firebase token", 401);
    }

    const { email, name, picture, uid } = decodedToken;

    // Upsert user (Find by email or googleId, update or create)
    const user = await this.userModel.model.findOneAndUpdate(
      { $or: [{ googleId: uid }, { email: email }] },
      {
        name,
        email,
        googleId: uid,
        avatarUrl: picture,
        verified: true,
        status: 'verified'
      },
      { new: true, upsert: true }
    );

    const tokenService = this.tokenServices;
    const sessionService = this.sessionServices;
    const userId = user._id;

    const refreshToken = tokenService.generateRefreshToken(userId);
    const accessToken = tokenService.generateAccessToken(userId);

    if (!refreshToken || !accessToken) {
      throw new ErrorHandler("Token creation failed", 400);
    }

    const session = await sessionService.createOrUpdateSession(
      userId,
      refreshToken,
      userAgent,
      ip,
    );

    if (!session) {
      throw new ErrorHandler("Session creation failed", 400);
    }

    return { accessToken, refreshToken, user, isVerified: true };
  }
}

export default AuthServices;
