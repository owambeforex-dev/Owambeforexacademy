
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy-gemini-key" });

export async function generate3DAvatar(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: `${prompt}. High-quality 3D realistic render, soft lighting, smooth skin, fintech style, neutral background.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
