import type { ModelDefinition, Configuration, CustomTextData } from "../types";

const CUSTOM_TEXT_OPTION_ID = "ZA";
const CUSTOM_TEXT_MODEL_ID = "stopper-stations";

export function isCustomTextOption(textOptionId: string | null): boolean {
  return textOptionId === CUSTOM_TEXT_OPTION_ID;
}

export function supportsCustomText(modelId: string): boolean {
  return modelId === CUSTOM_TEXT_MODEL_ID;
}

export function isAllStepsCompleted(
  model: ModelDefinition,
  config: Configuration
): boolean {
  for (const step of model.steps) {
    if (step.required && !config[step.id]) {
      return false;
    }
  }
  return true;
}

export function shouldShowCustomTextForm(
  model: ModelDefinition,
  config: Configuration,
  customText: CustomTextData | null
): boolean {
  if (!supportsCustomText(model.id)) {
    return false;
  }

  if (!isCustomTextOption(config.text ?? null)) {
    return false;
  }

  if (!isAllStepsCompleted(model, config)) {
    return false;
  }

  if (customText?.submitted) {
    return false;
  }

  return true;
}

export function hasSubmittedCustomText(
  config: Configuration,
  customText: CustomTextData | null
): boolean {
  if (!isCustomTextOption(config.text ?? null)) {
    return false;
  }

  return customText?.submitted === true;
}

export function shouldClearCustomText(
  prevTextOption: string | null,
  newTextOption: string | null
): boolean {
  if (prevTextOption === CUSTOM_TEXT_OPTION_ID && newTextOption !== CUSTOM_TEXT_OPTION_ID) {
    return true;
  }
  return false;
}

export function getMaxLength(lineCount: 1 | 2): number {
  return lineCount === 1 ? 13 : 20;
}

export function validateCustomText(data: Omit<CustomTextData, "submitted">): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const maxLength = getMaxLength(data.lineCount);

  if (!data.line1.trim()) {
    errors.push("Line 1 is required");
  }

  if (data.line1.length > maxLength) {
    errors.push(`Line 1 exceeds ${maxLength} characters`);
  }

  if (data.lineCount === 2 && data.line2.length > maxLength) {
    errors.push(`Line 2 exceeds ${maxLength} characters`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}