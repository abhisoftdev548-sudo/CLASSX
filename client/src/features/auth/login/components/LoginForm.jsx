import React from 'react';
import { motion } from 'framer-motion';
import { PiEnvelopeSimpleBold, PiLockBold, PiArrowRightBold } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../../config/firebase.config';
import useAuth from '../../hooks/useAuth';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema} from '../../schemas/loginSchema'

const LoginForm = () => {
  const {login, loading, firebaseLoginSync} = useAuth();
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(loginSchema)
  })

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await firebaseLoginSync(idToken);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log("form data submited", data);
    await login(data)
  }
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-base-content tracking-tight">Welcome Back</h1>
        <p className="text-base-content/50 mt-2 font-medium">Enter your details to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-[11px] font-bold uppercase tracking-widest text-base-content/40">Email Address</span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base-content/30 group-focus-within:text-primary transition-colors">
              <PiEnvelopeSimpleBold size={20} />
            </span>
            <input 
              type="email"
              
              placeholder="abhishek@rgpv.ac.in"
              className="input w-full pl-11 bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl font-medium transition-all"
              {...register('email')}
            />
          </div>
        </div>

        <div className="form-control w-full">
          <div className="flex justify-between items-center px-1">
            <label className="label py-1">
              <span className="label-text text-[11px] font-bold uppercase tracking-widest text-base-content/40">Password</span>
            </label>
            <Link to="/forget-password" size="xs" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Forgot?</Link>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-base-content/30 group-focus-within:text-primary transition-colors">
              <PiLockBold size={20} />
            </span>
            <input 
              type="password"
              placeholder="••••••••"
              className="input w-full pl-11 bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl font-medium transition-all"
              {...register('password')}
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type='submit'
          className="btn btn-primary w-full rounded-2xl h-14 mt-6 text-lg font-bold shadow-xl shadow-primary/20 gap-3 border-none"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Sign In"} <PiArrowRightBold />
        </motion.button>
      </form>

      <div className="divider text-base-content/30 text-sm font-bold my-8">OR</div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        type="button"
        disabled={loading}
        className="btn bg-base-100 hover:bg-base-200 text-base-content border-2 border-base-content/10 w-full rounded-2xl h-14 text-lg font-bold gap-3"
      >
        <svg className="w-6 h-6" viewBox="0 0 48 48">
          <title>Google Logo</title>
          <clipPath id="g">
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
          </clipPath>
          <g className="colors" clipPath="url(#g)">
            <path fill="#FBBC05" d="M0 37V11l17 13z"/>
            <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
            <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
            <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
          </g>
        </svg>
        Continue with Google
      </motion.button>

      <p className="text-center mt-8 text-sm font-medium text-base-content/50">
        New to ClassX? <Link to="/signup" className="text-primary font-bold hover:underline">Create account</Link>
      </p>
    </div>
  );
};

export default LoginForm;