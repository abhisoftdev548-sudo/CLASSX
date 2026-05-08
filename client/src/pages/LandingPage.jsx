import React from 'react'
import { PiBookOpen } from "react-icons/pi";
import Navbar from '../components/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import FeaturesSection from '../components/landingPage/FeaturesSection';
import AboutSection from '../components/landingPage/AboutSection';
import FooterSection from '../components/landingPage/FooterSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar Container */}
      <Navbar/>

      {/* Hero Section (Just for preview) */}
     <HeroSection/>

     <FeaturesSection/>

     <AboutSection/>

     <FooterSection/>
    </div>
  )
}

export default LandingPage