import { GoogleGenAI, Type } from "@google/genai";
import { ProductProfile, GenerationParams, GeneratedCaption } from "../types";

// Helper to initialize AI lazily
const getAI = (): GoogleGenAI | null => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn('⚠️ Nano Banana API key not configured. Image generation features will be disabled. The UI will still work for design purposes.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Models
const REASONING_MODEL = 'gemini-flash-latest';
const CAPTION_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

interface AdConceptResult {
  headline: string;
  body: string;
  imagePrompt: string;
  angle: string;
  theory: string;
}

export const generateAdConcepts = async (
  product: ProductProfile,
  params: GenerationParams,
  count: number = 3
): Promise<AdConceptResult[]> => {

  if (!product.image) {
    throw new Error("Product image is required");
  }

  // Prepare User's Product Image
  const productBase64 = product.image.split(',')[1];
  const productMime = product.image.split(';')[0].split(':')[1];

  const contentParts: any[] = [
    { inlineData: { mimeType: productMime, data: productBase64 } }
  ];

  // Prepare Reference Ad Image (if exists)
  let referenceInstruction = "";
  if (product.referenceAd) {
    const refBase64 = product.referenceAd.split(',')[1];
    const refMime = product.referenceAd.split(';')[0].split(':')[1];
    contentParts.push({ inlineData: { mimeType: refMime, data: refBase64 } });

    if (params.cloneMode === 'edit') {
      referenceInstruction = `
        IMPORTANT: Two images are attached.
        - Image 1: USER'S PRODUCT.
        - Image 2: REFERENCE AD.

        TASK:
        We will perform a direct image edit to replace the product in Image 2 with the product in Image 1.
        
        Generate concepts for the text copy (Headline/Body) that match the vibe of Image 2.
        For the "Image Prompt", simply write a clear instruction for an AI editor: "Replace the main product in the image with the user's product [describe user product briefly]. Keep lighting and background identical."
        `;
    } else {
      referenceInstruction = `
        IMPORTANT: Two images are attached. 
        - Image 1: USER'S PRODUCT.
        - Image 2: REFERENCE AD to CLONE.
        
        TASK:
        Analyze Image 2 (Reference Ad) in extreme detail: layout, lighting, color palette, camera angle, and composition.
        Generate concepts that strictly RECREATE the scene/style of Image 2, but REPLACE the subject/product in it with Image 1 (User's Product).
        The Image Prompt must describe the Reference Ad's environment but place the User's Product inside it.
        `;
    }
  }

  // Join styles for the prompt
  const styleString = params.style.join(', ');

  const systemInstruction = `
    You are a world-class Creative Director at a top-tier advertising agency (e.g., Ogilvy, Droga5).
    
    Your goal is to generate AVANT-GARDE, HIGH-PERFORMING ad concepts that look like expensive production shoots.
    
    1. Analyze the provided images.
    2. Generate concepts that are visually striking, not generic.
    3. Output must be strictly JSON.
  `;

  const prompt = `
    ${product.description ? `User Context: ${product.description}` : ''}
    
    Campaign Goal: ${params.goal}
    Format: ${params.format}
    Style Direction: ${styleString}
    ${referenceInstruction}

    Generate ${count} distinct ad concepts. 
    
    For each concept, provide:
    1. A catchy Headline (short, punchy, modern).
    2. Short Body copy (persuasive).
    3. A highly descriptive Image Prompt.
       - CRITICAL: Do not just describe the object. Describe the LIGHTING (e.g., cinematic, volumetric, rembrandt, softbox).
       - Describe the COMPOSITION (e.g., rule of thirds, negative space, macro, wide angle).
       - Describe the TEXTURE (e.g., hyper-realistic, matte, glossy).
       - Describe the MOOD (e.g., ethereal, gritty, sterile, cozy).
       - If the style is 'Neon', describe the neon colors and reflections.
       - If the style is 'Nature', describe the specific flora and sunlight.
    4. The Angle used (e.g. Social Proof, Scarcity, Aspiration).
    5. The Theory applied (e.g. AIDA, PAS).
  `;

  // Add text prompt to parts
  contentParts.push({ text: prompt });

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        body: { type: Type.STRING },
        imagePrompt: { type: Type.STRING },
        angle: { type: Type.STRING },
        theory: { type: Type.STRING },
      },
      required: ["headline", "body", "imagePrompt", "angle", "theory"],
    },
  };

  try {
    const ai = getAI();
    if (!ai) {
      console.warn('API not available - returning mock data for design preview');
      return [];
    }
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: {
        parts: contentParts
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AdConceptResult[];
    }
    throw new Error("No text response from Gemini");
  } catch (error) {
    console.error("Error generating concepts:", error);
    return [];
  }
};

export const generateAdImage = async (
  imagePrompt: string,
  style: string[],
  product: ProductProfile,
  cloneMode: 'recreate' | 'edit'
): Promise<string | null> => {
  try {
    const ai = getAI();
    if (!ai) {
      console.warn('API not available - image generation disabled');
      return null;
    }
    const styleStr = style.join(', ');
    const parts: any[] = [];
    let fullPrompt = "";

    // High-end photography keywords
    const enhancers = "award-winning advertising photography, 8k resolution, highly detailed, sharp focus, cinematic lighting, professional color grading, commercial aesthetic, trending on behance, vogue editorial quality";

    if (cloneMode === 'edit' && product.referenceAd && product.image) {
      // Mode 1: Direct Edit (Reference Ad + User Product)
      // Pass Reference Ad First (Base), then User Product
      const refBase64 = product.referenceAd.split(',')[1];
      const refMime = product.referenceAd.split(';')[0].split(':')[1];

      const prodBase64 = product.image.split(',')[1];
      const prodMime = product.image.split(';')[0].split(':')[1];

      parts.push({ inlineData: { mimeType: refMime, data: refBase64 } });
      parts.push({ inlineData: { mimeType: prodMime, data: prodBase64 } });

      fullPrompt = `${imagePrompt}. 
        Instruction: The first image is the Reference Ad. The second image is the Product. 
        Replace the main object/product in the first image with the product from the second image. 
        Maintain the exact background, lighting, and composition of the first image. 
        Seamlessly blend the new product. 
        Style details: ${styleStr}. ${enhancers}.`;

    } else {
      // Mode 2: Recreate / Standard (User Product only)
      if (product.image) {
        const prodBase64 = product.image.split(',')[1];
        const prodMime = product.image.split(';')[0].split(':')[1];
        parts.push({ inlineData: { mimeType: prodMime, data: prodBase64 } });
      }

      fullPrompt = `${imagePrompt}. 
        The output must be a high-end ad creative featuring the product from the attached image. 
        Style details: ${styleStr}. 
        ${enhancers}.`;
    }

    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: { parts },
      config: {
        // Nano Banana configuration
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const generateTailoredCaption = async (
  headline: string,
  adBody: string,
  description: string,
  visualContext: string,
  language: string,
  style: string
): Promise<GeneratedCaption | null> => {

  let specialInstruction = "";

  if (language.toLowerCase().includes("kurdish")) {
    specialInstruction = `
        CRITICAL INSTRUCTIONS FOR KURDISH SORANI:
        - ACT AS A NATIVE KURDISH COPYWRITER from Sulaymaniyah or Erbil.
        - DO NOT TRANSLATE LITERALLY. 
        - DO NOT BE ROBOTIC.
        - Use authentic local idioms, cultural references, and natural flow.
        - The text must be in Arabic Script (Sorani).
        - STYLE REQUIREMENT: ${style}. 
        - IF STYLE IS 'Playful/Joyful': Use slang, warm emojis, be like a friend talking.
        - IF STYLE IS 'Formal/Academic': Use high-level vocabulary, be trustworthy, expert tone.
        - IF STYLE IS 'Marketing/Direct': Use strong AIDA (Attention, Interest, Desire, Action), persuasive hooks, scarcity.
        `;
  } else {
    specialInstruction = `
        Target Language: ${language}
        Target Style: ${style}
        Ensure the tone matches the requested style perfectly.
        `;
  }

  const systemInstruction = `
        You are an expert social media copywriter.
        Write a single, perfect caption for a social media post.
        Follow the style and language instructions strictly.
        Return strictly JSON.
    `;

  const prompt = `
        Product Context: ${description}
        Ad Headline: ${headline}
        Ad Visual Description: ${visualContext}
        
        ${specialInstruction}
        
        Generate a single caption object containing the content and hashtags.
    `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["content", "hashtags"],
  };

  try {
    const ai = getAI();
    if (!ai) {
      console.warn('API not available - caption generation disabled');
      return null;
    }
    const response = await ai.models.generateContent({
      model: CAPTION_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      const res = JSON.parse(response.text);
      return {
        id: crypto.randomUUID(),
        language,
        style,
        content: res.content,
        hashtags: res.hashtags,
        timestamp: Date.now()
      };
    }
    return null;
  } catch (e) {
    console.error("Error generating specific caption", e);
    return null;
  }
};

export const combineNodes = async (
  nodeA: any,
  nodeB: any,
  instruction: string
): Promise<AdConceptResult> => {
  const systemInstruction = `
    You are a creative strategist. Combine two ad concepts into a new one.
  `;

  const prompt = `
    Concept A: ${JSON.stringify(nodeA)}
    Concept B: ${JSON.stringify(nodeB)}
    
    User Instruction: "${instruction}"
    
    Merge these into a single new concept JSON object. 
    CRITICAL MERGING RULES:
    1. If either concept describes a person, model, or human hand, the new image prompt MUST include them.
    2. The product from the "attached image" must remain the focal point.
    3. Merge the visual styles. If one is "3D" and the other is "Nature", create a "3D Nature" scene.
    4. Ensure the Image Prompt starts with "Using the attached product image".
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      headline: { type: Type.STRING },
      body: { type: Type.STRING },
      imagePrompt: { type: Type.STRING },
      angle: { type: Type.STRING },
      theory: { type: Type.STRING },
    },
    required: ["headline", "body", "imagePrompt", "angle", "theory"],
  };

  try {
    const ai = getAI();
    if (!ai) {
      throw new Error('API not available - cannot combine nodes without API key');
    }
    const response = await ai.models.generateContent({
      model: REASONING_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AdConceptResult;
    }
    throw new Error("Failed to combine");
  } catch (e) {
    console.error(e);
    throw e;
  }
}