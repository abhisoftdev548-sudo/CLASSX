import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiBookOpenBold, PiSignInBold, PiLayoutBold } from "react-icons/pi";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for glassy effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-base-100/80 backdrop-blur-lg border-b border-white/5 py-2' : 'bg-transparent py-4'
    }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          
          {/* --- LOGO --- */}
          <motion.div 
            className='shrink-0 flex items-center gap-2 group cursor-pointer'
            whileHover={{ scale: 1.05 }}
          >
            <div className='p-2.5 bg-primary text-primary-content rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12 text-2xl'>
              <PiBookOpenBold />
            </div>
            <span className='text-2xl font-black tracking-tighter text-base-content uppercase'>
              Class<span className='text-primary'>X</span>
            </span>
          </motion.div>

          {/* --- DESKTOP NAV LINKS --- */}
          <div className='hidden md:flex items-center space-x-8'>
            <ul className='flex gap-8 font-semibold text-sm uppercase tracking-wider'>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className='relative text-base-content/70 hover:text-primary transition-colors group'>
                    {link.name}
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full' />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* --- RIGHT ACTIONS --- */}
          <div className='hidden md:flex items-center gap-4'>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className='btn btn-ghost btn-circle text-xl bg-base-200/50'
            >
              {isDarkMode ? <IoSunnyOutline className="text-amber-400" /> : <IoMoonOutline />}
            </motion.button>
            
            <Link to={'/login'} className='btn btn-ghost gap-2 font-bold'>
              <PiSignInBold size={18} /> Login 
            </Link>
            
            <Link to={'/signup'}
              className='btn btn-primary px-8 rounded-full shadow-lg shadow-primary/25 border-none'
            >
              Get Started
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className='md:hidden flex items-center gap-3'>
            <button onClick={toggleTheme} className='btn btn-ghost btn-circle btn-sm bg-base-200/50'>
              {isDarkMode ? <IoSunnyOutline className="text-amber-400" /> : <IoMoonOutline />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className='btn btn-ghost btn-circle bg-base-200/50'>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <IoClose size={24} /> : <HiMenuAlt3 size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden absolute w-full bg-base-100 border-b border-base-200 overflow-hidden shadow-2xl'
          >
            <div className='px-6 pt-4 pb-8 space-y-4'>
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className='block text-lg font-bold text-base-content/80 hover:text-primary transition-all'
                >
                  {link.name}
                </a>
              ))}
              <div className='pt-6 flex flex-col gap-4'>
                <Link to={'/login'} className='btn btn-outline btn-primary w-full gap-2 rounded-xl'>
                  <PiSignInBold /> Login
                </Link>
                <Link to={'/signup'} className='btn btn-primary w-full rounded-xl'>
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;