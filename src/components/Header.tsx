
import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Calendar, HelpCircle } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-8 py-4 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-ocean-600 to-ocean-500">
            Discover DR
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#destinations" className="flex items-center text-sm font-medium text-gray-700 hover:text-ocean-600 transition-colors">
            <MapPin className="w-4 h-4 mr-1" />
            Destinations
          </a>
          <a href="#experiences" className="flex items-center text-sm font-medium text-gray-700 hover:text-ocean-600 transition-colors">
            <Calendar className="w-4 h-4 mr-1" />
            Experiences
          </a>
          <a href="#assistant" className="flex items-center text-sm font-medium text-gray-700 hover:text-ocean-600 transition-colors">
            <HelpCircle className="w-4 h-4 mr-1" />
            AI Assistant
          </a>
          <button className="px-4 py-2 rounded-full bg-ocean-500 text-white text-sm font-medium hover:bg-ocean-600 transition-colors">
            Plan My Trip
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
            <a
              href="#destinations"
              className="flex items-center py-2 text-gray-700 hover:text-ocean-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Destinations
            </a>
            <a
              href="#experiences"
              className="flex items-center py-2 text-gray-700 hover:text-ocean-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Experiences
            </a>
            <a
              href="#assistant"
              className="flex items-center py-2 text-gray-700 hover:text-ocean-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              AI Assistant
            </a>
            <button className="w-full px-4 py-2 rounded-full bg-ocean-500 text-white font-medium hover:bg-ocean-600 transition-colors">
              Plan My Trip
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
