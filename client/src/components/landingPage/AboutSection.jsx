import React from 'react';
import { motion } from 'framer-motion';
import { PiProjectorScreenChartFill, PiQuotesFill, PiCheckCircleFill } from "react-icons/pi";

const AboutSection = () => {
  return (
    <section className="py-24 bg-base-200/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* About Container (DaisyUI Hero Style) */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Visual Element (Animated Stats/Image Placeholder) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-base-300 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/20 text-primary rounded-xl">
                  <PiProjectorScreenChartFill size={32} />
                </div>
                <h3 className="text-xl font-bold">Project Vision</h3>
              </div>
              
              {/* DaisyUI Stats Integration */}
              <div className="stats stats-vertical w-full bg-transparent gap-4">
                <div className="stat p-0">
                  <div className="stat-title text-base-content/60">Efficiency Gained</div>
                  <div className="stat-value text-primary text-3xl">90%</div>
                  <div className="stat-desc">Reduced manual paperwork</div>
                </div>
                <div className="stat p-0">
                  <div className="stat-title text-base-content/60">Accessibility</div>
                  <div className="stat-value text-secondary text-3xl">24/7</div>
                  <div className="stat-desc">Cloud-synced class data</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-base-100 rounded-2xl border border-white/5 flex gap-3">
                <PiQuotesFill className="text-primary shrink-0" size={20} />
                <p className="text-sm italic opacity-70">
                  "ClassX was built to solve the struggle of managing large batches and complex syllabus tracking."
                </p>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full -z-10" />
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">About ClassX</h2>
              <h3 className="text-4xl font-extrabold text-base-content leading-tight">
                Empowering Educators with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-5xl">Digital Classrooms.</span>
              </h3>
            </div>

            <p className="text-lg text-base-content/70 leading-relaxed">
              **ClassX** is more than just an attendance app; it's a comprehensive ecosystem designed for modern educational institutions. Developed with the **MERN Stack**, it bridges the gap between traditional teaching and digital management.
            </p>

            {/* Checklist using DaisyUI/Tailwind */}
            <ul className="space-y-4">
              {[
                "Smart Attendance with Instant PDF Reports",
                "Hierarchical Class & Subject Management",
                "Advanced Security with JWT & OTP Sync",
                "Student-Centric Resource Dashboard"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-base-content/90">
                  <PiCheckCircleFill className="text-success" size={22} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button className="btn btn-outline btn-primary rounded-full px-8 hover:shadow-lg hover:shadow-primary/20 transition-all">
                Learn our Story
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;