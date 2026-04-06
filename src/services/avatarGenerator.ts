
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: `${prompt}. Premium 3D realistic render, head and shoulders, centered, facing forward, clean soft lighting, smooth skin, neutral expression with a slight confident smile, modern professional outfit, soft neutral gradient background. High resolution, 1K.`,
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

export async function generateAllAvatars() {
  const prompts = [
    { id: 'm1', prompt: 'Male, Caucasian, short brown hair, blue polo shirt' },
    { id: 'm2', prompt: 'Male, Black, buzz cut, grey hoodie' },
    { id: 'm3', prompt: 'Male, Hispanic, medium wavy hair, navy sweater' },
    { id: 'm4', prompt: 'Male, Middle Eastern, short dark hair, charcoal shirt' },
    { id: 'm5', prompt: 'Male, Southeast Asian, undercut, black t-shirt' },
    { id: 'f1', prompt: 'Female, East Asian, long black hair, white blouse' },
    { id: 'f2', prompt: 'Female, South Asian, wavy dark hair, teal blazer' },
    { id: 'f3', prompt: 'Female, Caucasian, blonde bob, pink top' },
    { id: 'f4', prompt: 'Female, Black, braided hair, yellow dress' },
    { id: 'f5', prompt: 'Female, Hispanic, long curly hair, green cardigan' },
  ];

  const results = await Promise.all(prompts.map(async (p) => {
    const url = await generate(p.prompt);
    return { id: p.id, url };
  }));

  return results;
}
