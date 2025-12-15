import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import type { ImageFile } from '../types';

const MODEL_NAME = 'gemini-2.5-flash-image';

export const editImage = async (
  image: ImageFile,
  prompt: string,
  inspirationImage: ImageFile | null
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const imagePart = {
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const parts: Part[] = [imagePart];

    if (inspirationImage) {
      parts.push({
        inlineData: {
          data: inspirationImage.base64,
          mimeType: inspirationImage.mimeType,
        },
      });
    }

    parts.push(textPart);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    const safetyFeedback = response.candidates?.[0]?.safetyRatings;
    if(safetyFeedback && safetyFeedback.some(rating => rating.blocked)) {
      throw new Error("The request was blocked due to safety reasons. Please adjust your prompt or image.");
    }
    
    const textResponse = response.text;
    if (textResponse) {
      throw new Error(`The model could not generate an image. Response: "${textResponse.trim()}"`);
    }

    throw new Error("No image was generated in the response. The model may have replied with text instead.");

  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('400')) {
             throw new Error("The request was invalid. Please check your image format and prompt.");
        }
        if (error.message.includes('500') || error.message.includes('503')) {
            throw new Error("The AI service is currently unavailable. Please try again later.");
        }
        throw error;
    }
    throw new Error("An unknown error occurred while editing the image.");
  }
};
