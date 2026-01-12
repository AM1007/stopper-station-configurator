export type ColourId = 
  | "yellow" 
  | "red" 
  | "white" 
  | "green" 
  | "blue" 
  | "orange" 
  | "clear";

export type FeatureId = "weather" | "sound";

export interface ConfiguratorMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  imagePath: string;
  features?: FeatureId[];
  colours?: ColourId[];
  isImplemented: boolean;
}