
import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-ocean-300">Discover DR</h3>
            <p className="text-gray-400 mb-6">
              Your AI-powered travel companion for exploring the Dominican Republic. Get personalized recommendations, safety tips, and detailed itineraries.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ocean-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ocean-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ocean-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-ocean-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Punta Cana</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Santo Domingo</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Puerto Plata</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Samaná</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">La Romana</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">AI Travel Assistant</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-ocean-300 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Calle El Conde 123, Zona Colonial, Santo Domingo, Dominican Republic
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-ocean-300 mr-2 flex-shrink-0" />
                <a href="mailto:info@discoverdr.com" className="text-gray-400 hover:text-white transition-colors">
                  info@discoverdr.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-ocean-300 mr-2 flex-shrink-0" />
                <a href="tel:+18095551234" className="text-gray-400 hover:text-white transition-colors">
                  +1 (809) 555-1234
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Discover DR. All rights reserved.</p>
          <p className="mt-2">
            Powered by AI Research and developed with ❤️ for travelers exploring the Dominican Republic.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
