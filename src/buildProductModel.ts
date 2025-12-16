// ============================================================================
// UNIVERSAL PRODUCT MODEL BUILDER
// ============================================================================
//
// Generates the product model/article code from user configuration.
// Supports all 6 configurator models with different formats:
//
// | Model                  | BaseCode | Format Example          |
// |------------------------|----------|-------------------------|
// | Stopper Stations       | SS2      | SS2024NT-EN             |
// | Indoor Push Buttons    | SS3-     | SS3-1R04 / SS3-1R04-CL  |
// | Key Switches           | SS3-     | SS3-1020 / SS3-1020-CL  |
// | Waterproof Push Buttons| WSS3     | WSS3-1R04 / WSS3-1R04-CL|
// | ReSet Call Points      | RP       | RP-R-SM-02 / RP-R-SM-02-CL |
// | Waterproof ReSet       | WRP2     | WRP2-R-02 / WRP2-R-02-CL|
//
// ============================================================================

import type { ModelDefinition, ProductModelSchema } from "./types";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration state - map of stepId to selected optionId
 */
export type ConfigurationState = Record<string, string | null>;

/**
 * Result of building a product model
 */
export interface ProductModelResult {
  /** Base code prefix (e.g., "SS2", "SS3-", "WSS3") */
  baseCode: string;
  /** Map of stepId to code value */
  parts: Record<string, string>;
  /** Full assembled product code */
  fullCode: string;
  /** Whether all required steps are selected */
  isComplete: boolean;
  /** List of missing required steps */
  missingSteps: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Finds the code for a selected option within a model's step.
 */
function findCode(
  model: ModelDefinition,
  stepId: string,
  optionId: string | null
): string {
  if (!optionId) {
    return "";
  }

  const step = model.steps.find((s) => s.id === stepId);
  if (!step) {
    return "";
  }

  const option = step.options.find((o) => o.id === optionId);
  return option?.code ?? "";
}

/**
 * Checks if a step is required in the model definition.
 */
function isStepRequired(model: ModelDefinition, stepId: string): boolean {
  const step = model.steps.find((s) => s.id === stepId);
  return step?.required ?? false;
}

/**
 * Gets the separator to use BEFORE a step's code.
 */
function getSeparator(
  schema: ProductModelSchema,
  stepId: string,
  code: string
): string {
  // If code is empty, no separator needed
  if (!code) {
    return "";
  }

  // Check separatorMap first (step-specific separators)
  if (schema.separatorMap && stepId in schema.separatorMap) {
    return schema.separatorMap[stepId];
  }

  // Fall back to global separator
  if (schema.separator === "none") {
    return "";
  }
  if (schema.separator === "dash") {
    return "-";
  }

  return schema.separator;
}

// ============================================================================
// MAIN BUILDER FUNCTION
// ============================================================================

/**
 * Builds a ProductModelResult from configuration and model definition.
 *
 * @param config - Current user configuration (stepId → optionId map)
 * @param model - Model definition with steps and schema
 * @returns ProductModelResult with full code and completion status
 *
 * @example
 * // Stopper Stations
 * buildProductModel(
 *   { colour: "0", cover: "2", activation: "4", text: "NT", language: "EN" },
 *   stopperStationsModel
 * );
 * // → { fullCode: "SS2024NT-EN", isComplete: true, ... }
 *
 * @example
 * // Indoor Push Buttons with Custom Label
 * buildProductModel(
 *   { colour: "1", buttonColour: "R", pushButtonType: "0", electrical: "4", label: "CL" },
 *   indoorPushButtonsModel
 * );
 * // → { fullCode: "SS3-1R04-CL", isComplete: true, ... }
 */
export function buildProductModel(
  config: ConfigurationState,
  model: ModelDefinition
): ProductModelResult {
  const { productModelSchema: schema, stepOrder } = model;

  // Extract codes for each step
  const parts: Record<string, string> = {};
  const missingSteps: string[] = [];

  for (const stepId of stepOrder) {
    const optionId = config[stepId] ?? null;
    const code = findCode(model, stepId, optionId);
    parts[stepId] = code;

    // Track missing required steps
    if (isStepRequired(model, stepId) && !optionId) {
      missingSteps.push(stepId);
    }
  }

  // Build full code using schema
  let fullCode = schema.baseCode;

  for (const stepId of schema.partsOrder) {
    const code = parts[stepId] ?? "";
    const separator = getSeparator(schema, stepId, code);
    fullCode += separator + code;
  }

  const isComplete = missingSteps.length === 0;

  return {
    baseCode: schema.baseCode,
    parts,
    fullCode,
    isComplete,
    missingSteps,
  };
}

// ============================================================================
// PARSER FUNCTION (for URL sharing)
// ============================================================================

/**
 * Parses a product model code back into a partial configuration.
 * Useful for restoring state from URL parameter.
 *
 * @param modelCode - Full product code
 * @param model - Model definition to parse against
 * @returns Partial configuration object, or null if parsing fails
 *
 * TODO: Implement full parsing for all models
 * ASSUMPTION: Each model has a unique baseCode prefix for identification
 */
export function parseProductModel(
  modelCode: string,
  model: ModelDefinition
): ConfigurationState | null {
  const { productModelSchema: schema } = model;

  // Validate baseCode prefix
  if (!modelCode.startsWith(schema.baseCode)) {
    return null;
  }

  // TODO: Implement model-specific parsing logic
  // This requires knowing the exact format of each model's codes
  // and reverse-mapping codes back to option IDs

  // For now, return null - will implement when needed for Share feature
  // ASSUMPTION: Share feature will need this for URL restoration
  return null;
}

// ============================================================================
// MODEL IDENTIFICATION
// ============================================================================

/**
 * Identifies which model a product code belongs to based on prefix.
 *
 * @param modelCode - Full product code
 * @returns Model ID or null if not recognized
 *
 * Prefix patterns:
 * - WSS3- → waterproof-push-buttons
 * - WRP2- → waterproof-reset-call-point
 * - SS3-  → indoor-push-buttons OR key-switches (ambiguous, needs context)
 * - SS2   → stopper-stations
 * - RP-   → reset-call-points
 */
export function identifyModel(modelCode: string): string | null {
  // Order matters: check longer prefixes first
  if (modelCode.startsWith("WSS3-")) {
    return "waterproof-push-buttons";
  }
  if (modelCode.startsWith("WRP2-")) {
    return "waterproof-reset-call-point";
  }
  if (modelCode.startsWith("SS3-")) {
    // ASSUMPTION: Cannot distinguish Indoor Push Buttons from Key Switches
    // by prefix alone. Need additional context or code structure analysis.
    // Key Switches has 2-char colour codes (10, 30, etc.)
    // Indoor Push Buttons has 1-char colour codes (1, 3, etc.)
    const afterPrefix = modelCode.slice(4);
    if (afterPrefix.length > 0 && afterPrefix[1] >= "0" && afterPrefix[1] <= "9") {
      // Second char is digit → Key Switches (2-char colour code like "10")
      return "key-switches";
    }
    // Otherwise → Indoor Push Buttons
    return "indoor-push-buttons";
  }
  if (modelCode.startsWith("SS2")) {
    return "stopper-stations";
  }
  if (modelCode.startsWith("RP-")) {
    return "reset-call-points";
  }

  return null;
}