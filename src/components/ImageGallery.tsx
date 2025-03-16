
import React, { useEffect, useRef } from 'react';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    location: string;
  }[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const images = entry.target.querySelectorAll('.gallery-image');
            images.forEach((image, index) => {
              setTimeout(() => {
                image.classList.add('is-visible');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={galleryRef}
      id="destinations"
      className="container mx-auto px-6 md:px-8 py-20"
    >
      <div className="text-center mb-16">
        <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-ocean-100 text-ocean-800 mb-4">
          Breathtaking Destinations
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Experience Paradise in Every Corner
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From pristine beaches to lush mountains, discover the diverse landscapes that make the Dominican Republic a traveler's dream destination.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-image animate-on-scroll overflow-hidden rounded-xl shadow-soft relative group"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">{image.alt}</h3>
              <p className="text-sm text-white/80">{image.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
