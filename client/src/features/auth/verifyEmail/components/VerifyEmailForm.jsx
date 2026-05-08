import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { PiShieldCheckBold, PiEnvelopeSimpleBold } from "react-icons/pi";
import useAuth from '../../hooks/useAuth';
import {otpSchema} from '../../schemas/otpSchema'


const VerifyEmailForm = () => {
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
const {verifyEmail, loading} = useAuth();
  // React Hook Form Setup
  const { register, setValue, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" }
  });

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Sync Array to RHF
  useEffect(() => {
    setValue("otp", otpArray.join(""));
    if (otpArray.every(val => val !== "")) trigger("otp");
  }, [otpArray, setValue, trigger]);
  
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const {sendVerificationOtp} = useAuth();
  const onSubmit = async (data) => {
    console.log("Verified OTP:", data.otp);
    await verifyEmail(data.otp);
  };
const onResend = async () => {
  await sendVerificationOtp();
  setTimer(59)
}
  if(loading){
    return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
    )
  }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-black text-base-content tracking-tight flex items-center gap-3">
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
                <PiEnvelopeSimpleBold />
            </span>
            Verify Email
        </h1>
        <p className="text-base-content/50 mt-3 font-medium">
          Enter the 6-digit code we sent to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...register("otp")} />

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2">
          {otpArray.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`input input-bordered w-12 h-14 text-center text-2xl font-bold transition-all 
                         ${errors.otp ? 'input-error' : 'focus:input-primary'}`}
            />
          ))}
        </div>

        {/* Error Message */}
        {errors.otp && (
            <p className="text-error text-sm font-bold text-center animate-pulse">{errors.otp.message}</p>
        )}

        <div className="text-center">
          <p className="text-sm font-medium text-base-content/50">
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <span className="text-primary font-bold">Resend in {timer}s</span>
            ) : (
              <button 
                type="button"
                className="text-primary font-black hover:underline underline-offset-4"
                onClick={onResend}
              >
                Resend Now
              </button>
            )}
          </p>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/20 gap-3 border-none"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>Verify Account <PiShieldCheckBold className="text-xl" /></>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default VerifyEmailForm;