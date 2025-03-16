
import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const scrollToNext = () => {
    const nextSection = document.getElementById('assistant');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Parallax effect for the hero image
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1580553561519-d640f64e7711?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container mx-auto px-6 md:px-8 text-center">
        <div className="glass max-w-3xl mx-auto p-8 rounded-2xl">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-white/70 text-ocean-800 mb-6 animate-fade-in">
            Your AI-Powered Travel Companion
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Discover the Magic of <span className="text-ocean-300">Dominican Republic</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Explore pristine beaches, vibrant culture, and hidden gems with our intelligent travel assistant
          </p>
          <button 
            onClick={scrollToNext}
            className="px-8 py-3 rounded-full bg-ocean-500 text-white font-medium hover:bg-ocean-600 transition-colors shadow-lg animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Start Planning
          </button>
        </div>
      </div>
      
      <button 
        onClick={scrollToNext}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Hero;
