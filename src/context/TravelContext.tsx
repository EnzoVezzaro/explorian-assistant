
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the types for our context
type TravelPreference = 'adventure' | 'beach' | 'cultural' | 'luxury' | 'budget' | 'family' | 'solo' | null;
type Region = 'santo-domingo' | 'punta-cana' | 'samana' | 'puerto-plata' | 'la-romana' | 'all' | null;

interface TravelResponse {
  summary: string;
  details: string;
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  recommendations: {
    places: string[];
    activities: string[];
    accommodations: string[];
    restaurants: string[];
  };
  safetytips: string[];
  loading: boolean;
  error: string | null;
}

interface TravelContextType {
  preferences: TravelPreference[];
  regions: Region[];
  budget: string | null;
  travelCompanions: string | null;
  customQuery: string | null;
  travelResponse: TravelResponse | null;
  isQuerying: boolean;
  setPreferences: (prefs: TravelPreference[]) => void;
  setRegions: (regs: Region[]) => void;
  setBudget: (budget: string | null) => void;
  setTravelCompanions: (companions: string | null) => void;
  setCustomQuery: (query: string | null) => void;
  submitTravelQuery: (query?: string) => Promise<void>;
  clearResponse: () => void;
  savedItineraries: TravelResponse[];
  saveCurrentResponse: () => void;
}

// Create the context with default values
const TravelContext = createContext<TravelContextType>({
  preferences: [],
  regions: [],
  budget: null,
  travelCompanions: null,
  customQuery: null,
  travelResponse: null,
  isQuerying: false,
  setPreferences: () => {},
  setRegions: () => {},
  setBudget: () => {},
  setTravelCompanions: () => {},
  setCustomQuery: () => {},
  submitTravelQuery: async () => {},
  clearResponse: () => {},
  savedItineraries: [],
  saveCurrentResponse: () => {},
});

export const TravelProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<TravelPreference[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [travelCompanions, setTravelCompanions] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [savedItineraries, setSavedItineraries] = useState<TravelResponse[]>([]);
  
  const [travelResponse, setTravelResponse] = useState<TravelResponse | null>(null);

  const submitTravelQuery = useCallback(async (query?: string) => {
    setIsQuerying(true);
    // Mock response for now - in a real implementation, we would call our OpenAI API here
    setTravelResponse({
      summary: "Discover pristine beaches, vibrant culture, and adventurous activities in Punta Cana, perfect for your family vacation on a mid-range budget.",
      details: "Punta Cana offers the perfect blend of family-friendly amenities and natural beauty. With over 20 miles of white-sand beaches and crystal-clear waters, it's ideal for swimming, snorkeling, and beach relaxation. Most resorts offer all-inclusive packages with kids' clubs and family activities, making it easy to balance adult relaxation with children's entertainment.",
      prosAndCons: {
        pros: [
          "Exceptional beach quality and safety",
          "Wide range of all-inclusive family resorts",
          "Direct flights from many international destinations",
          "Generally safe environment for tourists"
        ],
        cons: [
          "Limited authentic Dominican culture in resort areas",
          "Extra activities can add up beyond all-inclusive packages",
          "Beach vendors can be persistent in some areas",
          "Summer months can be very hot and humid"
        ]
      },
      recommendations: {
        places: ["Bávaro Beach", "Indigenous Eyes Ecological Park", "Isla Saona", "Hoyo Azul Cenote"],
        activities: ["Catamaran sailing trip", "Dolphin Island excursion", "Chocolate making workshop", "Horseback riding on the beach"],
        accommodations: ["Barceló Bávaro Palace", "Dreams Punta Cana", "Grand Sirenis Punta Cana", "Nickelodeon Hotels & Resorts"],
        restaurants: ["Jellyfish Restaurant", "Citrus Restaurant", "La Yola", "Chic Cabaret & Restaurant"]
      },
      safetytips: [
        "Stay within resort areas at night",
        "Use resort transportation for excursions",
        "Keep valuables in room safes",
        "Apply reef-safe sunscreen generously"
      ],
      loading: false,
      error: null
    });
    
    // Simulate API delay
    setTimeout(() => {
      setIsQuerying(false);
    }, 2000);
  }, []);

  const clearResponse = useCallback(() => {
    setTravelResponse(null);
  }, []);

  const saveCurrentResponse = useCallback(() => {
    if (travelResponse) {
      setSavedItineraries(prev => [...prev, travelResponse]);
    }
  }, [travelResponse]);

  return (
    <TravelContext.Provider
      value={{
        preferences,
        regions,
        budget,
        travelCompanions,
        customQuery,
        travelResponse,
        isQuerying,
        setPreferences,
        setRegions,
        setBudget,
        setTravelCompanions,
        setCustomQuery,
        submitTravelQuery,
        clearResponse,
        savedItineraries,
        saveCurrentResponse,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

// Custom hook to use the context
export const useTravelContext = () => useContext(TravelContext);
