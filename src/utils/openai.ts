
// OpenAI integration for the Deep Research and Reasoning API
import OpenAI from "openai";
import { type ResponseStatus } from "openai/resources/responses";
import axios from 'axios';

interface ResearchQueryParams {
  query: string;
  preferences?: string[];
  regions?: string[];
  budget?: string;
  companions?: string;
}

interface TravelPlanResponse {
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
}

// Initialize the OpenAI client
/*
const openai = new OpenAI({
  apiKey: "XXX",
  dangerouslyAllowBrowser: true // Required for browser environments
});
*/
const OPENAI_API_KEY = import.meta.env.VITE_GROK_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Schema for structured output
const travelPlanSchema = {
  type: "object",
  properties: {
    summary: { 
      type: "string",
      description: "A brief 2-3 sentence overview of the travel recommendation" 
    },
    details: { 
      type: "string",
      description: "A detailed explanation of the travel recommendation" 
    },
    prosAndCons: {
      type: "object",
      properties: {
        pros: {
          type: "array",
          items: { type: "string" },
          description: "List of advantages for this travel plan"
        },
        cons: {
          type: "array",
          items: { type: "string" },
          description: "List of considerations or downsides for this travel plan"
        }
      },
      additionalProperties: false,
      required: ["pros", "cons"]
    },
    recommendations: {
      type: "object",
      properties: {
        places: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Name of the recommended place" },
              link: { type: "string", format: "uri", description: "Official website or relevant link for the place" }
            }
          },
          description: "List of 5 recommended places to visit, including links for more details"
        },
        "activities": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "description": "Name of the recommended activity" },
              "link": { "type": "string", "format": "uri", "description": "Official website or relevant link for more details" }
            }
          },
          "description": "List of 5 recommended activities with links"
        },
        "accommodations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "description": "Name of the recommended place to stay" },
              "link": { "type": "string", "format": "uri", "description": "Booking website or official link for reservations" }
            }
          },
          "description": "List of 5 recommended places to stay with links"
        },
        "restaurants": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "description": "Name of the recommended dining option" },
              "link": { "type": "string", "format": "uri", "description": "Official website, menu, or review link" }
            }
          },
          "description": "List of 5 recommended dining options with links"
        }
      },
      additionalProperties: false,
      required: ["places", "activities", "accommodations", "restaurants"]
    },
    safetytips: {
      type: "array", 
      items: { type: "string" },
      description: "List of important safety considerations for this travel plan"
    }
  },
  required: ["summary", "details", "prosAndCons", "recommendations", "safetytips"],
  additionalProperties: false
};

export const performDeepResearch = async (params: ResearchQueryParams) => {
  console.log("Performing deep research with params:", params);
  
  try {
    // Construct the prompt using the user's parameters
    const prompt = constructPrompt(params);
    
    /*
    // Make a call to the OpenAI Responses API with structured output
    const response = await openai.responses.create({
      model: "llama-3.3-70b-versatile",
      reasoning: { effort: "medium" },
      input: [
        {
          role: "system",
          content: "You are an expert travel advisor for the Dominican Republic. Provide detailed, well-researched travel recommendations."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_output_tokens: 4000,
      text: {
        format: {
          type: "json_schema",
          name: "travel_plan",
          schema: travelPlanSchema
        }
      }
    });
    
    console.log("OpenAI API response received:", response);
    */
    // Segunda solicitud a Groq para formatear en JSON estructurado
    const jsonFormatRequest = {
      messages: [
        { 
          role: "system", 
          content: `Convert the following extracted medical data into a structured JSON format according to this schema:\n${JSON.stringify(travelPlanSchema)}` 
        },
        { 
          role: "user", 
          content: JSON.stringify(prompt) 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    };

    const jsonResponse = await axios.post(API_URL, jsonFormatRequest, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    console.log('resp: ', jsonResponse);
    
    
    // Process the API response
    if (jsonResponse.data) {
      try {
        // Parse the structured JSON output
        const travelPlan = JSON.parse(jsonResponse.data.choices[0].message.content) as TravelPlanResponse;
        console.log('travelPlan: ', travelPlan);
        
        return {
          success: true,
          data: travelPlan
        };
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // Fallback to text extraction if JSON parsing fails
        return {
          success: true,  
          data: processApiResponse(jsonResponse.data)
        };
      }
    } else if (jsonResponse.data.status === "incomplete" as ResponseStatus) {
      console.warn("Incomplete response:", jsonResponse.data.incomplete_details);
      // Return partial data if available
      if (jsonResponse.data.output_text) {
        try {
          // Attempt to parse potentially incomplete JSON
          const travelPlan = JSON.parse(jsonResponse.data.output_text) as TravelPlanResponse;
          return {
            success: true,
            data: travelPlan
          };
        } catch (parseError) {
          // Fall back to text extraction
          return {
            success: true,
            data: processApiResponse(jsonResponse.data)
          };
        }
      } else {
        return {
          success: false,
          error: "The research query was too complex. Please try a simpler request."
        };
      }
    } else {
      // Fallback to mock data if response processing fails
      return {
        success: true,
        data: generateMockResponse(params)
      };
    }
  } catch (error) {
    console.error("Error performing deep research:", error);
    return {
      success: false,
      error: "Failed to perform research. Please try again later."
    };
  }
};

// Helper function to construct a detailed prompt based on user preferences
const constructPrompt = (params: ResearchQueryParams) => {
  const { query, preferences, regions, budget, companions } = params;
  
  let prompt = `I need a comprehensive travel plan for the Dominican Republic based on the following criteria:\n\n`;
  
  if (query) {
    prompt += `User query: ${query}\n\n`;
  }
  
  if (preferences && preferences.length > 0) {
    prompt += `Travel preferences: ${preferences.join(', ')}\n`;
  }
  
  if (regions && regions.length > 0) {
    prompt += `Regions of interest: ${regions.join(', ')}\n`;
  }
  
  if (budget) {
    prompt += `Budget range: ${budget}\n`;
  }
  
  if (companions) {
    prompt += `Traveling with: ${companions}\n`;
  }
  
  prompt += `\nProvide a comprehensive travel plan with specific details for places to visit, activities, accommodations, restaurants, and safety tips.`;
  
  return prompt;
};

// Process the API response and extract structured data when JSON parsing fails
const processApiResponse = (apiResponse: any): TravelPlanResponse => {
  try {
    if (!apiResponse.output_text) {
      throw new Error("No output text in API response");
    }
    
    const output = apiResponse.output_text;
    
    // Extract data using string parsing
    const summary = extractSection(output, "Summary:", "Details:") || 
      "Personalized travel recommendations for the Dominican Republic.";
    
    const details = extractSection(output, "Details:", "Pros:") || 
      "Based on your preferences, we've curated a selection of experiences and destinations in the Dominican Republic.";
    
    // Extract pros as array
    const prosText = extractSection(output, "Pros:", "Cons:");
    const pros = prosText ? extractListItems(prosText) : [];
    
    // Extract cons as array
    const consText = extractSection(output, "Cons:", "Places to Visit:");
    const cons = consText ? extractListItems(consText) : [];
    
    // Extract places as array
    const placesText = extractSection(output, "Places to Visit:", "Activities:");
    const places = placesText ? extractListItems(placesText) : [];
    
    // Extract activities as array
    const activitiesText = extractSection(output, "Activities:", "Accommodations:");
    const activities = activitiesText ? extractListItems(activitiesText) : [];
    
    // Extract accommodations as array
    const accommodationsText = extractSection(output, "Accommodations:", "Restaurants:");
    const accommodations = accommodationsText ? extractListItems(accommodationsText) : [];
    
    // Extract restaurants as array
    const restaurantsText = extractSection(output, "Restaurants:", "Safety Tips:");
    const restaurants = restaurantsText ? extractListItems(restaurantsText) : [];
    
    // Extract safety tips as array
    const safetyTipsText = extractSection(output, "Safety Tips:", null);
    const safetyTips = safetyTipsText ? extractListItems(safetyTipsText) : [];
    
    return {
      summary,
      details,
      prosAndCons: {
        pros: pros.length > 0 ? pros : ["Perfect climate year-round", "Rich cultural experiences", "Beautiful beaches", "Diverse natural landscapes", "Friendly locals"],
        cons: cons.length > 0 ? cons : ["Peak season can be crowded", "Some areas require extra safety precautions", "Language barrier in less touristy areas", "Occasional power outages", "Persistent vendors at tourist spots"]
      },
      recommendations: {
        places: places.length > 0 ? places : ["Colonial Zone in Santo Domingo", "Playa Rincón in Samaná", "Los Haitises National Park", "Isla Saona", "27 Waterfalls of Damajagua"],
        activities: activities.length > 0 ? activities : ["Whale watching in Samaná Bay", "Ziplining through the jungle canopy", "Learning merengue and bachata dancing", "Exploring underwater caves", "Sampling local rum and cigar production"],
        accommodations: accommodations.length > 0 ? accommodations : ["Casas del XVI", "Eden Roc Cap Cana", "Tubagua Eco Lodge", "Billini Hotel", "Tortuga Bay Puntacana Resort"],
        restaurants: restaurants.length > 0 ? restaurants : ["La Yola", "Mesón de Bari", "Travesias", "El Conuco", "Pat'e Palo"]
      },
      safetytips: safetyTips.length > 0 ? safetyTips : ["Register with your embassy before traveling", "Use registered taxis", "Keep valuables secured", "Stay hydrated and use sunscreen", "Be cautious when withdrawing money", "Learn basic Spanish phrases"]
    };
  } catch (error) {
    console.error("Error processing API response:", error);
    return generateMockResponse({ query: "fallback" });
  }
};

// Helper function to extract a section from the text
const extractSection = (text: string, startMarker: string, endMarker: string | null): string | null => {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return null;
  
  const startPosition = startIndex + startMarker.length;
  
  let endPosition;
  if (endMarker) {
    const endIndex = text.indexOf(endMarker, startPosition);
    endPosition = endIndex !== -1 ? endIndex : text.length;
  } else {
    endPosition = text.length;
  }
  
  return text.substring(startPosition, endPosition).trim();
};

// Helper function to extract list items from text
const extractListItems = (text: string): string[] => {
  // Split by new lines and then by bullet points or numbers
  const lines = text.split('\n').map(line => line.trim());
  const items: string[] = [];
  
  for (const line of lines) {
    // Skip empty lines
    if (!line) continue;
    
    // Remove bullet points, numbers, or dashes at the beginning of lines
    const cleanedLine = line.replace(/^(\d+\.|•|-|\*|\[\d+\])\s*/, '').trim();
    if (cleanedLine) {
      items.push(cleanedLine);
    }
  }
  
  return items;
};

// Generate mock response based on input parameters (fallback if API parsing fails)
const generateMockResponse = (params: ResearchQueryParams): TravelPlanResponse => {
  const { query, preferences, regions, budget, companions } = params;
  
  // Create a more tailored response based on the input parameters
  let regionText = "the Dominican Republic";
  if (regions && regions.length > 0 && regions[0] !== 'all') {
    const regionMap: {[key: string]: string} = {
      'santo-domingo': 'Santo Domingo',
      'punta-cana': 'Punta Cana',
      'samana': 'Samaná',
      'puerto-plata': 'Puerto Plata',
      'la-romana': 'La Romana'
    };
    
    regionText = regions.map(r => regionMap[r] || r).join(' and ');
  }
  
  let budgetText = "mid-range";
  if (budget) {
    budgetText = budget.toLowerCase();
  }
  
  let travelType = "vacation";
  if (preferences && preferences.length > 0) {
    const preferenceMap: {[key: string]: string} = {
      'adventure': 'adventure-filled', 
      'beach': 'beach', 
      'cultural': 'culturally immersive', 
      'luxury': 'luxurious',
      'budget': 'budget-friendly',
      'family': 'family',
      'solo': 'solo'
    };
    
    travelType = preferences.map(p => preferenceMap[p] || p).join(' and ') + ' vacation';
  }
  
  let companionText = "travelers";
  if (companions) {
    companionText = companions.toLowerCase();
  }
  
  return {
    summary: `Discover the perfect ${travelType} in ${regionText} with a ${budgetText} budget, ideal for ${companionText}.`,
    details: `${regionText} offers an exceptional destination for a ${travelType}. With its stunning natural beauty, rich history, and vibrant culture, you'll find plenty to enjoy regardless of your travel style. The ${budgetText} price point allows for comfortable accommodations and authentic experiences without breaking the bank. For ${companionText}, this destination provides the right balance of activities, relaxation, and local immersion.`,
    prosAndCons: {
      pros: [
        `Perfect climate year-round with temperatures between 75-85°F`,
        `Exceptional value for ${budgetText} travelers`,
        `Wide variety of ${travelType} options`,
        `Well-developed tourism infrastructure in ${regionText}`,
        `Rich cultural experiences and friendly locals`
      ],
      cons: [
        `Peak season (December-April) can be crowded and more expensive`,
        `Some areas require extra safety precautions, especially at night`,
        `Language barrier in less touristy areas (Spanish predominant)`,
        `Occasional power outages in certain regions`,
        `Persistent vendors at popular tourist spots`
      ]
    },
    recommendations: {
      places: [
        `Colonial Zone in Santo Domingo (UNESCO World Heritage Site)`,
        `Playa Rincón in Samaná (consistently rated among world's best beaches)`,
        `Los Haitises National Park (unique limestone karst landscape)`,
        `Isla Saona (pristine island paradise)`,
        `27 Waterfalls of Damajagua (natural water slides and pools)`
      ],
      activities: [
        `Whale watching in Samaná Bay (January-March)`,
        `Ziplining through the jungle canopy in Puerto Plata`,
        `Learning merengue and bachata dancing with locals`,
        `Exploring underwater caves and coral reefs`,
        `Sampling local rum and cigar production`
      ],
      accommodations: [
        `Casas del XVI (boutique hotel in restored colonial houses)`,
        `Eden Roc Cap Cana (luxury seaside resort)`,
        `Tubagua Eco Lodge (sustainable mountain retreat)`,
        `Billini Hotel (historic luxury in Santo Domingo)`,
        `Tortuga Bay Puntacana Resort (exclusive beachfront villas)`
      ],
      restaurants: [
        `La Yola (seafood restaurant on stilts over the water)`,
        `Mesón de Bari (authentic Dominican cuisine in colonial setting)`,
        `Travesias (innovative fusion of local ingredients)`,
        `El Conuco (traditional food with folklore show)`,
        `Pat'e Palo (European Brasserie in America's first tavern)`
      ]
    },
    safetytips: [
      `Register with your embassy before traveling`,
      `Use registered taxis or reputable ride-sharing services`,
      `Keep valuables secured in hotel safes`,
      `Stay hydrated and use reef-safe sunscreen`,
      `Be cautious when withdrawing money from ATMs, especially at night`,
      `Learn basic Spanish phrases for emergencies`
    ]
  };
};
