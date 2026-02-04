
import { GoogleGenAI } from "@google/genai";

// Fixed: getAIResponse now follows Google GenAI SDK guidelines for initialization and text extraction.
export const getAIResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  // Always initialize GoogleGenAI with a named parameter and process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { 
          role: 'user', 
          parts: [{ text: `You are an AI Class Assistant in a school group chat. Keep your responses helpful, concise, and academic. The student says: ${userMessage}` }] 
        }
      ],
      config: {
        temperature: 0.7,
        // Removed maxOutputTokens to avoid issues with thinking models as per guidelines.
      }
    });

    // Use .text property directly.
    return response.text || "I'm not sure how to respond to that, but I'm here to help!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm experiencing a bit of a brain fog right now. Try again later!";
  }
};
