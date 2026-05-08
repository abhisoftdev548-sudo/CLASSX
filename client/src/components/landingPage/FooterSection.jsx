import React from 'react';
import { motion } from 'framer-motion';
import { 
  PiGithubLogoFill, 
  PiLinkedinLogoFill, 
  PiTwitterLogoFill, 
  PiInstagramLogoFill,
  PiBookOpenFill,
  PiEnvelopeSimpleFill
} from "react-icons/pi";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PiBookOpenFill size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-base-content">
                Class<span className="text-primary">X</span>
              </span>
            </div>
            <p className="text-base-content/60 text-sm leading-relaxed max-w-xs">
              A comprehensive MERN-stack platform designed to simplify classroom management and attendance tracking for students and educators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base-content font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-base-content/60">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Librarian Tool</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base-content font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-base-content/60">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">RGPV Syllabus</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-base-content font-bold mb-6">Stay Connected</h4>
            <p className="text-sm text-base-content/60 mb-4 flex items-center gap-2">
              <PiEnvelopeSimpleFill size={18} className="text-secondary" />
              support@classx.com
            </p>
            <div className="flex gap-4">
              {[
                { icon: <PiGithubLogoFill size={20} />, link: "https://github.com/your-username" },
                { icon: <PiLinkedinLogoFill size={20} />, link: "#" },
                { icon: <PiTwitterLogoFill size={20} />, link: "#" },
                { icon: <PiInstagramLogoFill size={20} />, link: "#" }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.link}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-base-300 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-all border border-white/5"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar (DaisyUI Footer logic) */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-base-content/40">
          <p>© {currentYear} ClassX - Managed by Abhishek Gupta. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-base-content transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-base-content transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Decorative Blur for Footer End */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
};

export default FooterSection;