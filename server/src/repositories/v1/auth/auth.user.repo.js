class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async findByEmailAndMobile(email, mobileNumber) {
    return await this.model.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async findById(userId) {
    return await this.model.findById(userId);
  }

  async comparePassword(email, enteredPassword) {
    const userData = await this.model.findOne({ email }).select("+password");
    return userData.comparePassword(enteredPassword);
  }

  async create(userData) {
    return await this.model.create(userData);
  }

  async setUserVerified(user) {
    // return await this.model.findOneAndUpdate(
    //   { email: user.email },
    //   { verified: true },
    //   { new: true },
    // );
    user.verified = true;
    return await user.save();
  }

  async setUserUnVerified(user) {
    return await this.model.findOneAndUpdate(
      { email: user.email },
      { verified: false },
      { new: true },
    );
    // user.Verified = false;
    // return await user.save();
  }

  async generateResetToken(email) {
    return await this.model.createResetToken(email);
  }

  async findAndChangePassword(resetPasswordTokenHash, newPassword) {
    const user = await this.model.findOne({
      resetPasswordToken: resetPasswordTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      throw new ErrorHandler("Invalid or expired reset password token", 400);
    }
    if(newPassword === user.password){
        throw new ErrorHandler("New password can't be same as old password", 400);
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.verified = true;
    await user.save();
    

    return user;
  }
}

export default UserRepository;
