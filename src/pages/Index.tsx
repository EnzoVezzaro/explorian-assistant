
import React, { useEffect } from 'react';
import { TravelProvider } from '../context/TravelContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ImageGallery from '../components/ImageGallery';
import ChatInterface from '../components/ChatInterface';
import TravelResponse from '../components/TravelResponse';
import Footer from '../components/Footer';

// Sample destinations images
const destinationImages = [
  {
    src: 'https://images.unsplash.com/photo-1584283367830-7e017119da45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Punta Cana Beaches',
    location: 'Punta Cana, East Coast'
  },
  {
    src: 'https://images.unsplash.com/photo-1623718649591-311775a30c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Colonial Zone',
    location: 'Santo Domingo, Capital'
  },
  {
    src: 'https://images.unsplash.com/photo-1599641499370-9e2b3c90c8f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Samaná Peninsula',
    location: 'Samaná, Northeast Coast'
  },
  {
    src: 'https://images.unsplash.com/photo-1590690702580-a3d0fcdc3ae2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Puerto Plata',
    location: 'Puerto Plata, North Coast'
  },
  {
    src: 'https://images.unsplash.com/photo-1589543775019-15fe470a7826?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Jarabacoa Waterfalls',
    location: 'Jarabacoa, Central Mountains'
  },
  {
    src: 'https://images.unsplash.com/photo-1619813401919-211b9991bf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Bahía de Las Águilas',
    location: 'Pedernales, Southwest Coast'
  }
];

const Index = () => {
  // Initialize scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <TravelProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ImageGallery images={destinationImages} />
          <ChatInterface />
          <TravelResponse />
        </main>
        <Footer />
      </div>
    </TravelProvider>
  );
};

export default Index;
