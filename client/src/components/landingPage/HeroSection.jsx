import React from 'react'
import {motion, transform} from 'framer-motion'
import { PiArrowRightBold, PiSparkleBold, PiPlusCircleFill, PiUsersThreeFill, PiLayoutFill } from "react-icons/pi";
import { HiLightningBolt } from "react-icons/hi";
import { Link } from 'react-router-dom';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};
const HeroSection = () => {

  return (
   <div className="relative isolate min-h-screen pt-24 overflow-hidden bg-base-100">
      
      {/* --- BACKGROUND NEON GLOW --- */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10"/>
      <motion.div
        className="max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        
        {/* --- LEFT SIDE: CONTENT --- */}
        <div className="text-center lg:text-left">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm shadow-primary/10">
            <PiSparkleBold size={16} className="text-secondary animate-pulse" />
            <span>The Future of Classroom Management</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="mt-8 text-5xl font-bold tracking-tight text-base-content sm:text-6xl lg:text-7xl leading-tight">
            Take Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Classroom to Cloud.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className='mt-8 text-base leading-8 text-base-content/70 sm:text-lg max-w-2xl mx-auto lg:mx-0'>
            Create virtual rooms, track real-time attendance, and manage student performance with **ClassX**. The all-in-one hub for modern educators and students.
          </motion.p>

          <motion.div variants={itemVariants} className='mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <Link to={'/signup'} className='btn btn-primary rounded-full px-10 gap-2 h-14 text-base shadow-lg shadow-primary/30 group'>
                <PiPlusCircleFill size={22}/>
                Create Account 
                <PiArrowRightBold size={18} className='group-hover:translate-x-1 transition-transform'/>
            </Link>
            <Link to={'/login'} className='btn btn-ghost rounded-full px-8 gap-2 h-14 text-base border border-base-content/10 hover:border-base-content/20'>
                Login
            </Link>
          </motion.div>
            </div>

            <motion.div
          variants={itemVariants}
          className="relative flex justify-center items-center h-100 sm:h-125"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Main Conceptual Card */}
          <div className="absolute w-[320px] sm:w-95 h-100 rounded-[2.5rem] p-7 shadow-2xl backdrop-blur-xl bg-base-200/90 border border-base-content/10 rotate-[-2deg] flex flex-col gap-6 overflow-hidden">
            
            {/* Header: Class Info */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="bg-secondary/20 text-secondary text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">Active Room</span>
                <h3 className="text-xl font-bold text-base-content">CS - 2nd Sem (RGPV)</h3>
                <p className="text-xs text-base-content/50">Instructor: Abhishek Gupta</p>
              </div>
              <div className="p-3 bg-primary text-primary-content rounded-2xl shadow-lg">
                <PiLayoutFill size={24} />
              </div>
            </div>

            {/* Students Mock Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-base-300/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <PiUsersThreeFill size={18}/>
                    <span className="text-xs font-semibold uppercase">Students</span>
                  </div>
                  <p className="text-2xl font-bold">48</p>
               </div>
               <div className="bg-base-300/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-success mb-1">
                    <HiLightningBolt size={18}/>
                    <span className="text-xs font-semibold uppercase">Today</span>
                  </div>
                  <p className="text-2xl font-bold text-success">92%</p>
               </div>
            </div>

            {/* Attendance Visualization (Moving Object) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="opacity-60">Weekly Report Progress</span>
                <span className="text-primary">In Progress</span>
              </div>
              <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-linear-to-r from-primary to-secondary"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
            </div>

            {/* Bottom Sync Info */}
            <div className="mt-auto flex justify-between items-center text-[11px] opacity-50">
               <span>ID: CLASS-X-2026</span>
               <span>Auto-Synced with Cloud</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 -bottom-10 -right-10 w-48 h-48 bg-secondary/20 blur-[80px] rounded-full pointer-events-none" />
        </motion.div>
      </motion.div>
    </div>
  )
}
 
export default HeroSection
