import React from 'react';
import { motion } from 'framer-motion';
import { PiUserBold, PiEnvelopeSimpleBold, PiLockBold, PiPhoneBold, PiArrowRightBold } from "react-icons/pi";
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../schemas/registerSchema'
const SignupForm = () => {

  const {register: authRegister, loading} = useAuth();

  
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    console.log("form data submited", data);
    await authRegister(data)
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
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-base-content tracking-tight">Create Account</h1>
        <p className="text-base-content/50 mt-2 font-medium">Join ClassX to manage your classroom.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-[11px] font-bold uppercase tracking-widest text-base-content/40">Full Name</span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base-content/30">
              <PiUserBold />
            </span>
            <input 
              type="text" 
              {...register('name')}
              placeholder='Enter Your Name'
              className="input w-full pl-11 bg-base-200/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-[11px] font-bold uppercase tracking-widest text-base-content/40">Email</span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base-content/30">
              <PiEnvelopeSimpleBold />
            </span>
            <input 
              type="email" 
              {...register('email')}
              placeholder='Enter your email'
              className="input w-full pl-11 bg-base-200/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>

        {/* Mobile Field */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-[11px] font-bold uppercase tracking-widest text-base-content/40">Mobile</span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base-content/30">
              <PiPhoneBold />
            </span>
            <input 
              type="tel" 
              placeholder='Mobile Number'
              {...register('mobileNumber')}
              className="input w-full pl-11 bg-base-200/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-[11px] font-bold uppercase tracking-widest text-base-content/40">Password</span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base-content/30">
              <PiLockBold />
            </span>
            <input 
              type="password" 
              placeholder='Password'
              {...register('password')}
              className="input w-full pl-11 bg-base-200/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn btn-primary w-full rounded-2xl h-14 mt-6 text-lg font-bold shadow-xl shadow-primary/20 gap-3 border-none"
        >
          Sign Up <PiArrowRightBold />
        </motion.button>
      </form>

      <p className="text-center mt-8 text-sm font-medium text-base-content/50">
        Already a member? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default SignupForm;