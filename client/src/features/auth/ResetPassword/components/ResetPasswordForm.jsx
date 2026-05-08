import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PiLockKeyBold, PiEyeBold, PiEyeSlashBold, PiCheckCircleFill } from "react-icons/pi";
import toast from 'react-hot-toast';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Yahan apna API call lagao (e.g., authService.resetPassword({password}))
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md bg-base-200/40 backdrop-blur-2xl border border-white/5 shadow-2xl p-8 rounded-[2.5rem]"
      >
        {!success ? (
          <>
            <h2 className="text-3xl font-black text-center mb-2">Set New Password</h2>
            <p className="text-base-content/50 text-center mb-8 font-medium">
              Enter your new secure password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold opacity-50 uppercase text-[10px] tracking-widest">New Password</span>
                </label>
                <div className="relative">
                  <PiLockKeyBold className="absolute left-4 top-4 text-base-content/30" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="input w-full pl-12 bg-base-300 rounded-2xl border-none focus:ring-2 focus:ring-primary/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-base-content/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? <PiEyeSlashBold size={20} /> : <PiEyeBold size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold opacity-50 uppercase text-[10px] tracking-widest">Confirm Password</span>
                </label>
                <div className="relative">
                  <PiLockKeyBold className="absolute left-4 top-4 text-base-content/30" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="input w-full pl-12 bg-base-300 rounded-2xl border-none focus:ring-2 focus:ring-primary/50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-2xl font-bold mt-4"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <PiCheckCircleFill size={40} />
            </div>
            <h2 className="text-2xl font-black mb-2">Password Reset!</h2>
            <p className="text-base-content/50 font-medium">
              Your password has been successfully updated. You can now login with your new credentials.
            </p>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="btn btn-primary mt-6 w-full rounded-2xl font-bold"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;