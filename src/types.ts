export type OptionId = string;

export type StepId =
  | "colour"
  | "cover"
  | "activation"
  | "text"
  | "language"
  | "installationOptions";

export interface Option {
  id: OptionId;
  label: string;
  code: string;
  image?: string;
  notes?: string;
  availableFor?: string[];
}

export interface Step {
  id: StepId;
  title: string;
  required: boolean;
  options: Option[];
}

export interface Configuration {
  colour: OptionId | null;
  cover: OptionId | null;
  activation: OptionId | null;
  text: OptionId | null;
  language: OptionId | null;
  installationOptions: OptionId | null;
}

export interface ProductModel {
  baseCode: string;
  
  parts: {
    colour: string;
    cover: string;
    activation: string;
    text: string;
    language: string;
    installationOptions: string;
  };
  
  fullCode: string;
  isComplete: boolean;
}

export const STEP_ORDER: StepId[] = [
  "colour",
  "cover",
  "activation",
  "text",
  "language",
  "installationOptions",
];