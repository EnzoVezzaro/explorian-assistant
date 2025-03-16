
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { performDeepResearch } from '../utils/openai';

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
    places: { name: string; link: string }[];
    activities: { name: string; link: string }[];
    accommodations: { name: string; link: string }[];
    restaurants: { name: string; link: string }[];
  };
  safetytips: string[];
  loading?: boolean;
  error?: string | null;
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
    
    try {
      // Prepare parameters for the API call
      const queryParams = {
        query: query || customQuery || '',
        preferences: preferences.length > 0 ? preferences as string[] : undefined,
        regions: regions.length > 0 ? regions as string[] : undefined,
        budget: budget,
        companions: travelCompanions
      };
      
      // Call the OpenAI integration
      const response = await performDeepResearch(queryParams);
      
      if (response.success) {
        // Add loading and error properties to match the TravelResponse interface
        setTravelResponse({
          ...response.data,
          loading: false,
          error: null
        });
      } else {
        setTravelResponse({
          summary: "Sorry, I couldn't complete your travel research.",
          details: "There was an error processing your request. Please try again with different parameters.",
          prosAndCons: {
            pros: [],
            cons: []
          },
          recommendations: {
            places: [],
            activities: [],
            accommodations: [],
            restaurants: []
          },
          safetytips: [],
          loading: false,
          error: response.error || "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error in submitTravelQuery:", error);
      
      setTravelResponse({
        summary: "An unexpected error occurred.",
        details: "We encountered a technical issue while processing your request. Please try again later.",
        prosAndCons: {
          pros: [],
          cons: []
        },
        recommendations: {
          places: [],
          activities: [],
          accommodations: [],
          restaurants: []
        },
        safetytips: [],
        loading: false,
        error: "Technical error"
      });
    } finally {
      setIsQuerying(false);
    }
  }, [preferences, regions, budget, travelCompanions, customQuery]);

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
