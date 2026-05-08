import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PiEnvelopeSimpleBold, PiArrowLeftBold, PiCheckCircleFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { z } from 'zod'; // Zod import karo
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth';
import { forgetPasswordSchema } from '../../schemas/forgetPasswordSchema';

const ForgotPasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { forgetPassword, loading } = useAuth();

  // 2. React Hook Form Setup
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(forgetPasswordSchema)
  });

  // 3. Form Submission Handler
  const onSubmit = async (data) => {
    // data.email yahan automatic aa jayega agar validation pass hogi
    const success = await forgetPassword(data); 
    if (success) {
      setSubmitted(true);
      setSubmittedEmail(data.email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md bg-base-200/40 backdrop-blur-2xl border border-white/5 shadow-2xl p-8 rounded-[2.5rem]"
      >
        {!submitted ? (
          <>
            <h2 className="text-3xl font-black text-center mb-2">Forgot Password</h2>
            <p className="text-base-content/50 text-center mb-8 font-medium">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Form submission here */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold opacity-50 uppercase text-[10px] tracking-widest">Email Address</span>
                </label>
                <div className="relative">
                  <PiEnvelopeSimpleBold className="absolute left-4 top-4 text-base-content/30" size={20} />
                  <input 
                    {...register("email")} // Connection here
                    type="email" 
                    placeholder="abhishek@rgpv.ac.in"
                    className={`input w-full pl-12 bg-base-300 rounded-2xl border-none focus:ring-2 ${errors.email ? 'ring-2 ring-error' : 'focus:ring-primary/50'}`}
                  />
                </div>
                {/* Error message display */}
                {errors.email && (
                  <p className="text-error text-[10px] font-bold mt-2 ml-1">{errors.email.message}</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-2xl font-bold mt-4"
              >
                {loading ? "Sending..." : "Send Reset Link"}
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
            <h2 className="text-2xl font-black mb-2">Check your Email</h2>
            <p className="text-base-content/50 font-medium">
              We've sent a password reset link to <br/> <span className="text-primary font-bold">{submittedEmail}</span>
            </p>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-base-content/50 hover:text-primary transition-colors">
            <PiArrowLeftBold /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;