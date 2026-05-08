import mongoose from "mongoose";
import crypto from "crypto";
const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpType: {
    type: String,
    enum: ["email-verification", "password-reset", "login"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

otpSchema.statics.generateAndSaveOtp = async function (otpType, email, userId) {
  const otp = crypto.randomInt(100000, 999999).toString();
  if (!otp) {
    throw new Error("Failed to generate OTP");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(otp + salt)
    .digest("hex");

  await this.deleteMany({ email });
  const newOtp = await this.create({
    email: email,
    otp: `${salt}.${hash}`,
    user: userId,
    otpType: otpType,
  });
  return otp;
};

otpSchema.statics.verifyOtp = async function (email, otp) {
  const record = await this.findOne({ email });
  if (!record) {
    return false;
  }
  const [salt, hashedOtp] = record.otp.split(".");
  const newHashedOtp = crypto
    .createHash("sha256")
    .update(otp + salt)
    .digest("hex");

   await this.deleteMany({email})
  
  return newHashedOtp === hashedOtp;
};

const otpModel = mongoose.model("otp", otpSchema);
export default otpModel;
