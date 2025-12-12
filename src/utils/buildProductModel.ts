// ============================================================================
// STOPPER STATION CALCULATOR - PRODUCT MODEL BUILDER
// ============================================================================
//
// Generates the product model/article code from user configuration.
//
// Format: SS2 + [colour][cover][activation][text] - [language] + [installationOptions]
//
// Examples:
//   SS2024NT-EN           (Red, No Cover, Momentary, NO TEXT, English)
//   SS2021EM-EN&KIT-71101B-R  (Red, Shield, Turn-to-Reset, EMERGENCY, English, Red Deep Kit)
//   SS3006AB-FR           (White, No Cover, Red Illuminated, ABORT, French)
// ============================================================================

import type { Configuration, ProductModel } from "../types";
import { STEPS } from "../data/steps";

/**
 * Finds the code for a selected option within a step.
 *
 * @param stepId - The step identifier
 * @param optionId - The selected option ID (or null if not selected)
 * @returns The option's code, or empty string if not found/selected
 */
function findCode(stepId: string, optionId: string | null): string {
  if (!optionId) {
    return "";
  }

  const step = STEPS.find((s) => s.id === stepId);
  if (!step) {
    return "";
  }

  const option = step.options.find((o) => o.id === optionId);
  return option?.code ?? "";
}

/**
 * Builds a ProductModel object from the current configuration.
 *
 * @param config - Current user configuration
 * @returns ProductModel with parts, full code, and completion status
 *
 * @example
 * const model = buildProductModel({
 *   colour: "0",
 *   cover: "2",
 *   activation: "4",
 *   text: "NT",
 *   language: "EN",
 *   installationOptions: null
 * });
 * // model.fullCode === "SS2024NT-EN"
 * // model.isComplete === true
 */
export function buildProductModel(config: Configuration): ProductModel {
  // Extract codes for each step
  const parts = {
    colour: findCode("colour", config.colour),
    cover: findCode("cover", config.cover),
    activation: findCode("activation", config.activation),
    text: findCode("text", config.text),
    language: findCode("language", config.language),
    installationOptions: findCode("installationOptions", config.installationOptions),
  };

  // Build full code: SS2 + colour + cover + activation + text + "-" + language + installationOptions
  const fullCode = `SS2${parts.colour}${parts.cover}${parts.activation}${parts.text}-${parts.language}${parts.installationOptions}`;

  // Check if all REQUIRED steps are selected
  // Note: installationOptions is optional (required: false in steps.ts)
  const isComplete = Boolean(
    config.colour &&
    config.cover &&
    config.activation &&
    config.text &&
    config.language
  );

  return {
    baseCode: "SS2",
    parts,
    fullCode,
    isComplete,
  };
}

/**
 * Parses a product model code back into a partial configuration.
 * Useful for restoring state from URL parameter.
 *
 * @param modelCode - Full product code (e.g., "SS2024NT-EN&KIT-71101B-R")
 * @returns Partial configuration object, or null if parsing fails
 *
 * TODO: Implement this for URL sharing feature
 * ASSUMPTION: Model code format is consistent and parseable
 */
export function parseProductModel(modelCode: string): Partial<Configuration> | null {
  // Basic validation
  if (!modelCode.startsWith("SS2") || modelCode.length < 10) {
    return null;
  }

  try {
    // Remove "SS2" prefix
    const withoutPrefix = modelCode.slice(3);

    // Split by "-" to separate main part from language/installation
    const [mainPart, rest] = withoutPrefix.split("-");

    if (!mainPart || mainPart.length < 4 || !rest) {
      return null;
    }

    // Parse main part: [colour][cover][activation][text]
    // colour: 1 char (0-5)
    // cover: 1 char (0 or 2)
    // activation: 1 char (0-9)
    // text: 2 chars (AB, EM, EX, etc.)
    const colour = mainPart[0];
    const cover = mainPart[1];
    const activation = mainPart[2];
    const text = mainPart.slice(3); // Remaining is text code (2 chars)

    // Parse rest: [language][installationOptions]
    // language: 2 chars (EN, ES, FR, ZL)
    // installationOptions: optional, starts with "&"
    const language = rest.slice(0, 2);
    const installationOptions = rest.length > 2 ? rest.slice(2) : null;

    // Find matching option IDs
    // Note: For activation, we need to find the correct variant (e.g., "6-red" vs "6-green")
    // This is ambiguous from code alone, so we return the base ID
    // ASSUMPTION: UI will need to handle ambiguous cases

    return {
      colour,
      cover,
      activation, // Base activation code - may need resolution for #6/#7 variants
      text,
      language,
      installationOptions: installationOptions || "none",
    };
  } catch {
    return null;
  }
}