
export interface ProductProfile {
  image: string | null; // Base64 string of the Product
  referenceAd?: string | null; // Base64 string of the Ad to clone
  description?: string; // Optional user context
}

export interface GeneratedCaption {
  id: string;
  language: string;
  style: string;
  content: string;
  hashtags: string[];
  timestamp: number;
}

export interface AdNodeData {
  id: string;
  type: 'concept' | 'image' | 'component' | 'caption';
  x: number;
  y: number;
  title: string;
  content: string; // Text content or Image URL
  meta?: {
    angle?: string;
    theory?: string;
    loading?: boolean;
    format?: string;
    imagePrompt?: string;
  };
  captions?: GeneratedCaption[]; 
  isGeneratingCaptions?: boolean;
  width?: number;
  height?: number;
}

export interface Wire {
  id: string;
  from: string; // Node ID
  to: string; // Node ID
}

export interface CanvasState {
  nodes: AdNodeData[];
  wires: Wire[];
  scale: number;
  offsetX: number;
  offsetY: number;
  selectedNodeIds: string[];
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  CANVAS = 'CANVAS',
  GALLERY = 'GALLERY', // New View
}

export interface GenerationParams {
  goal: string;
  format: string;
  style: string[]; // Changed to array
  cloneMode: 'recreate' | 'edit';
}

export interface AdTemplate {
  id: string;
  title: string;
  style: string;
  thumbnail: string; // Placeholder color or URL
  prompt: string; // The base prompt for this template
  isUserGenerated?: boolean; // New flag for community templates
}
