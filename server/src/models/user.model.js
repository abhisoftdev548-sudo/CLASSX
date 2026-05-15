import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: function() { return !this.googleId; },
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    mobileNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending_verification', 'verified', 'logout'],
      default: 'pending_verification',
      index: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hashing password
// 1. Parameter se 'next' hata diya (Mongoose async handle kar lega)
userSchema.pre("save", async function () {
  
  // 2. Agar password modify nahi hua, toh yahin se return kar jao
  // Async function mein 'return' hi 'next()' ka kaam karta hai
  if (!this.isModified("password") || !this.password) {
    return; 
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Yahan koi next() call karne ki zaroorat nahi hai
  } catch (err) {
    // Agar error handle karna hai toh throw kar do
    throw new Error(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.createResetToken = async function(email){
  if(!email){
    throw new Error("Email is required");
  }

  const user = await this.findOne({email});
  if(!user){
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetTokenExpire = new Date(Date.now() + 30 * 60 * 1000);
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = resetTokenExpire;
  await user.save();

  return resetToken;
}


const userModel = mongoose.model("users", userSchema);
export default userModel;


