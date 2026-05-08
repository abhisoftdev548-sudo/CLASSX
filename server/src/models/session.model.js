import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    ip: {
      type: String,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);




sessionSchema.methods.compareRefreshToken = async function (enteredRefreshToken) {
  return await bcrypt.compare(enteredRefreshToken, this.refreshToken);
};



const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;
