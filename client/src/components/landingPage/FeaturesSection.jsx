import React from 'react';
import { motion } from 'framer-motion';
import { 
  PiChalkboardTeacherFill, 
  PiFilePdfFill, 
  PiUsersFourFill, 
  PiShieldCheckFill, 
  PiChartLineUpFill, 
  PiDevicesFill 
} from "react-icons/pi";

const features = [
  {
    title: "Classroom Management",
    desc: "Create and organize multiple virtual rooms for different subjects and semesters with ease.",
    icon: <PiChalkboardTeacherFill size={32} />,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "One-Click Attendance",
    desc: "Mark attendance in seconds with a mobile-friendly interface designed for speed.",
    icon: <PiUsersFourFill size={32} />,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Smart PDF Reports",
    desc: "Generate professional attendance and performance reports in Excel or PDF format instantly.",
    icon: <PiFilePdfFill size={32} />,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Real-time Analytics",
    desc: "Visualize student performance and attendance trends with interactive charts and graphs.",
    icon: <PiChartLineUpFill size={32} />,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Secure Authentication",
    desc: "Advanced JWT-based security with OTP verification to keep your classroom data safe.",
    icon: <PiShieldCheckFill size={32} />,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Multi-Device Sync",
    desc: "Access your dashboard from your phone, tablet, or laptop. Your data is always in sync.",
    icon: <PiDevicesFill size={32} />,
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-base-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wide uppercase text-sm"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-bold tracking-tight text-base-content sm:text-5xl"
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Manage Classes.</span>
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-8 rounded-3xl bg-base-200/50 border border-base-content/5 hover:border-primary/20 hover:bg-base-200 transition-all duration-300 shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-base-content mb-3">
                {feature.title}
              </h3>
              <p className="text-base-content/60 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
    </section>
  );
};

export default FeaturesSection;