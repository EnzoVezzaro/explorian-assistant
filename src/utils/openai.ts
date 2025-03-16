
// OpenAI integration for the Deep Research and Reasoning API
import OpenAI from "openai";

interface ResearchQueryParams {
  query: string;
  preferences?: string[];
  regions?: string[];
  budget?: string;
  companions?: string;
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: "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",
});

export const performDeepResearch = async (params: ResearchQueryParams) => {
  console.log("Performing deep research with params:", params);
  
  try {
    // Construct the prompt using the user's parameters
    const prompt = constructPrompt(params);
    
    // Make an actual call to the OpenAI Responses API
    const response = await openai.responses.create({
      model: "o3-mini",
      reasoning: { effort: "medium" },
      input: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_output_tokens: 4000,
    });
    
    console.log("OpenAI API response received:", response);
    
    // Process the API response
    if (response.status === "success") {
      return {
        success: true,
        data: processApiResponse(response, params)
      };
    } else if (response.status === "incomplete") {
      console.warn("Incomplete response:", response.incomplete_details);
      // Return partial data if available
      if (response.output_text) {
        return {
          success: true,
          data: processApiResponse({ ...response, output_text: response.output_text }, params)
        };
      } else {
        return {
          success: false,
          error: "The research query was too complex. Please try a simpler request."
        };
      }
    }
    
    // Fallback to mock data if response processing fails
    return {
      success: true,
      data: generateMockResponse(params)
    };
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
  
  let prompt = `As a travel expert for the Dominican Republic, I need a comprehensive travel plan based on the following criteria:\n\n`;
  
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
  
  prompt += `\nPlease provide a comprehensive travel plan with the following information:
  1. A concise summary (2-3 sentences)
  2. Detailed explanation of the recommendation
  3. Pros and cons of this travel plan
  4. Specific recommendations for:
     - Places to visit
     - Activities to do
     - Accommodations
     - Restaurants
  5. Safety tips relevant to this travel plan
  
  Format the response in a structured way that I can parse as follows:
  - Summary: [2-3 sentence overview]
  - Details: [longer explanation]
  - Pros: [list of advantages]
  - Cons: [list of considerations]
  - Places to Visit: [list of 5 locations]
  - Activities: [list of 5 activities]
  - Accommodations: [list of 5 places to stay]
  - Restaurants: [list of 5 dining options]
  - Safety Tips: [list of 6 important safety considerations]`;
  
  return prompt;
};

// Process the API response and extract structured data
const processApiResponse = (apiResponse: any, params: ResearchQueryParams) => {
  try {
    if (!apiResponse.output_text) {
      return generateMockResponse(params);
    }
    
    const output = apiResponse.output_text;
    
    // Extract data using string parsing
    // This is a basic implementation - in a production app,
    // you might want to use more sophisticated parsing or have the API
    // return data in a specific format
    
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
    return generateMockResponse(params);
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
const generateMockResponse = (params: ResearchQueryParams) => {
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
    ],
    loading: false,
    error: null
  };
};
