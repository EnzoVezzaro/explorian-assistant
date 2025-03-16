
import React, { useEffect, useRef } from 'react';
import { useTravelContext } from '../context/TravelContext';
import { Check, X, Map, Hotel, Utensils, Calendar, Info, Bookmark } from 'lucide-react';

const TravelResponse = () => {
  const { travelResponse, saveCurrentResponse, clearResponse } = useTravelContext();
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (travelResponse && responseRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const elements = entry.target.querySelectorAll('.animate-on-scroll');
              elements.forEach((element, index) => {
                setTimeout(() => {
                  element.classList.add('is-visible');
                }, index * 100);
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(responseRef.current);
      return () => {
        if (responseRef.current) {
          observer.unobserve(responseRef.current);
        }
      };
    }
  }, [travelResponse]);

  if (!travelResponse) return null;

  return (
    <div
      ref={responseRef}
      className="container mx-auto px-6 md:px-8 py-16 md:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-glass overflow-hidden border border-gray-100 animate-on-scroll">
          {/* Header */}
          <div className="bg-gradient-to-r from-ocean-600 to-ocean-500 px-6 py-8 text-white">
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Your Personalized Travel Plan</h3>
            <p className="text-white/80">{travelResponse.summary}</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Detailed Section */}
            <div className="mb-8 animate-on-scroll">
              <h4 className="text-lg font-medium mb-3 text-gray-800">Overview</h4>
              <p className="text-gray-600 leading-relaxed">{travelResponse.details}</p>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-5 rounded-xl border border-green-100 animate-on-scroll">
                <h4 className="text-lg font-medium mb-3 text-green-800 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Advantages
                </h4>
                <ul className="space-y-2">
                  {travelResponse.prosAndCons.pros.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-5 rounded-xl border border-red-100 animate-on-scroll">
                <h4 className="text-lg font-medium mb-3 text-red-800 flex items-center">
                  <X className="w-5 h-5 mr-2" />
                  Considerations
                </h4>
                <ul className="space-y-2">
                  {travelResponse.prosAndCons.cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-4 h-4 text-red-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-on-scroll">
                <h4 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                  <Map className="w-5 h-5 mr-2 text-ocean-600" />
                  Places to Visit
                </h4>
                <ul className="space-y-2">
                  {travelResponse.recommendations.places.map((place, index) => (
                    <li key={index} className="text-gray-700">{place}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-on-scroll">
                <h4 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-ocean-600" />
                  Activities
                </h4>
                <ul className="space-y-2">
                  {travelResponse.recommendations.activities.map((activity, index) => (
                    <li key={index} className="text-gray-700">{activity}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-on-scroll">
                <h4 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                  <Hotel className="w-5 h-5 mr-2 text-ocean-600" />
                  Where to Stay
                </h4>
                <ul className="space-y-2">
                  {travelResponse.recommendations.accommodations.map((accommodation, index) => (
                    <li key={index} className="text-gray-700">{accommodation}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-on-scroll">
                <h4 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-ocean-600" />
                  Where to Eat
                </h4>
                <ul className="space-y-2">
                  {travelResponse.recommendations.restaurants.map((restaurant, index) => (
                    <li key={index} className="text-gray-700">{restaurant}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="mb-8 bg-blue-50 p-5 rounded-xl border border-blue-100 animate-on-scroll">
              <h4 className="text-lg font-medium mb-3 text-blue-800 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Safety Tips
              </h4>
              <ul className="space-y-2">
                {travelResponse.safetytips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 font-medium mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 animate-on-scroll">
              <button
                onClick={saveCurrentResponse}
                className="flex items-center px-4 py-2 rounded-lg bg-ocean-500 text-white hover:bg-ocean-600 transition-colors"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save Itinerary
              </button>
              <button
                onClick={clearResponse}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelResponse;
