import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiBookOpenBold, PiSparkleFill } from "react-icons/pi";
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, activeForm = "auth" }) => {
  return (
    <div className="h-screen w-full bg-base-100 flex overflow-hidden font-sans">
      
      {/* --- LEFT SIDE: ENHANCED VISUAL EXPERIENCE --- */}
      <div className="hidden lg:flex w-[55%] bg-slate-950 relative items-center justify-center overflow-hidden">
        {/* Dynamic Background Mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-secondary blur-[120px] rounded-full" />
        </div>

        {/* --- INTERACTIVE ANIMATION OBJECT --- */}
        <div className="relative z-10 w-full max-w-lg px-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* The "Brain/Core" Orb */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-64 mx-auto bg-linear-to-tr from-primary to-secondary rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[2px] shadow-[0_0_80px_rgba(79,70,229,0.4)] flex items-center justify-center"
            >
               <PiBookOpenBold className="text-white text-7xl drop-shadow-2xl" />
            </motion.div>

            {/* Orbiting Elements - Reacting to Form Presence */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeForm}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-150"
              />
            </AnimatePresence>

            {/* Text Content */}
            <div className="text-center mt-20 space-y-4">
              <motion.h2 
                key={activeForm + "-h2"}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-black text-white tracking-tight"
              >
                {activeForm === 'signup' ? 'Start Your Journey' : 'Welcome Back'}
              </motion.h2>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">
                Securely managing classrooms and notes with ClassX 2.0 AI-Driven architecture.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM CONTAINER (Dynamic) --- */}
      <div className="w-full lg:w-[45%] flex flex-col p-8 md:p-12 z-20 bg-base-100 border-l border-base-200">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10">
           <Link to="/" className="inline-flex items-center gap-2">
            <div className="p-2 bg-primary text-primary-content rounded-xl">
              <PiBookOpenBold size={24} />
            </div>
            <span className="text-2xl font-black">Class<span className="text-primary">X</span></span>
          </Link>
        </div>

        {/* Form Content Injected Here */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeForm}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle Footer */}
        <p className="text-center text-[10px] text-base-content/30 uppercase tracking-[0.2em] mt-8">
          ClassX Integrated Security Protocol v2.0
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;