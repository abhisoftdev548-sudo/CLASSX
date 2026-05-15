import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PiUserFill, 
  PiEnvelopeSimpleBold, 
  PiPhoneBold, 
  PiPenFill, 
  PiBookOpenBold, 
  PiChartBarBold, 
  PiNotebookBold,
  PiSparkleFill // Added missing import
} from "react-icons/pi";
import { AuthContext } from '../../auth/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';
import Avatar from '../../../components/Avatar';

const ProfilePage = () => {
const navigate = useNavigate()
  const {user, isInitialized, loading, logout} = useAuth();
  console.log('Profile - User:', user, 'isInitialized:', isInitialized, 'loading:', loading);
  

  // --- USER DATA STATE ---
  // const [user] = useState({
  //   name: "Abhishek Gupta",
  //   email: "abhishek@rgpv.ac.in",
  //   mobile: "91XXXXXXXX",
  //   role: "Librarian / Developer",
  //   joinDate: "Aug 2025",
  //   totalClasses: 48,
  //   attendanceRate: "92%",
  //   notesAdded: 112
  // });

  // Show loading while auth is initializing
  if(loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Redirect if no user after initialization
  if(!user) return <Navigate to='/'/>
  const { name, email, mobileNumber:mobile, verified} = user;

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16 relative overflow-hidden font-sans">
      
      {/* --- NEON AMBIENCE --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-base-content tracking-tight">Account Profile</h1>
            <p className="text-base-content/50 mt-2 font-medium">Librarian Project Management Interface</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-outline gap-2 px-6 rounded-2xl font-bold border-2"
          >
            <PiPenFill size={18} /> Edit Profile
          </motion.button>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: IDENTITY CARD */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-200/40 backdrop-blur-2xl border border-white/5 shadow-2xl p-8 rounded-[2.5rem] text-center"
            >
              <div className="avatar placeholder mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary p-[2px]">
                  <Avatar avatarUrl={user?.avatarUrl} name={name} size="xl" />
                </div>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{name}</h2>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full border border-primary/20">
                <PiSparkleFill className="text-primary animate-pulse" size={12} />
                <span className="text-[10px] uppercase font-black tracking-widest text-primary"></span>
              </div>
              <p className="text-sm text-base-content/40 mt-6 font-medium tracking-wide">Member Since </p>
            </motion.div>

            {/* INFO CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-base-200/40 backdrop-blur-2xl border border-white/5 shadow-2xl p-8 rounded-[2.5rem]"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-base-content/30 mb-6">Verified Details</h3>
              <div className="space-y-6">
                {[
                  { icon: <PiEnvelopeSimpleBold />, label: "Email Address", val: email },
                  { icon: <PiPhoneBold />, label: "Phone Number", val: mobile },
                  { icon: <PiBookOpenBold />, label: "University", val: "RGPV University" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="p-3 bg-base-300 rounded-2xl text-primary">{item.icon}</div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold uppercase text-base-content/30 tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold truncate mt-0.5">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: ANALYTICS & ACTIVITY */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Classes", val: 'totalClasses', icon: <PiChartBarBold />, color: "text-primary" },
                { label: "Attendance", val: 'a', icon: <PiSparkleFill />, color: "text-success" },
                { label: "Notes", val: 'no', icon: <PiNotebookBold />, color: "text-secondary" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-base-200/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-xl"
                >
                  <div className={`${stat.color} mb-4 text-2xl`}>{stat.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30">{stat.label}</p>
                  <p className="text-3xl font-black mt-1">{stat.val}</p>
                </motion.div>
              ))}
            </div>

            {/* BIG PLACEHOLDER CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card h-[400px] bg-base-200/40 backdrop-blur-2xl border border-white/5 shadow-2xl p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <PiBookOpenBold size={40} className="text-base-content/20" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Recent Activity Timeline</h3>
              <p className="max-w-xs text-base-content/40 mt-3 font-medium">
                Soon you'll be able to track your lecture notes and class schedules in this interactive timeline.
              </p>
              <div className="mt-8 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>

            {/* DANGER AREA */}
            <div className="p-8 bg-error/5 border border-error/10 rounded-4xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h4 className="font-black text-error uppercase tracking-widest text-sm">Security Zone</h4>
                <p className="text-xs font-medium text-error/60 mt-1">Permanently remove your account and all associated data from Librarian.</p>
              </div>
              <button onClick={logout} className="btn btn-error btn-sm rounded-xl px-8 font-black uppercase text-[10px] tracking-widest hover:scale-105">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;