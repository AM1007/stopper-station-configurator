// ============================================================================
// UNIVERSAL TYPE DEFINITIONS
// ============================================================================
//
// Type system for multi-model configurator supporting 6 product lines:
// - Stopper Stations (SS2)
// - Indoor Push Buttons (SS3-)
// - Key Switches (SS3-)
// - Waterproof Push Buttons (WSS3)
// - ReSet Call Points (RP)
// - Waterproof ReSet Call Point (WRP2)
//
// ============================================================================

// ============================================================================
// MODEL IDENTIFIERS
// ============================================================================

/**
 * Unique identifier for each configurator model.
 */
export type ModelId =
  | "stopper-stations"
  | "indoor-push-buttons"
  | "key-switches"
  | "waterproof-push-buttons"
  | "reset-call-points"
  | "waterproof-reset-call-point";

/**
 * Human-readable names for each model.
 */
export const MODEL_NAMES: Record<ModelId, string> = {
  "stopper-stations": "Stopper® Stations",
  "indoor-push-buttons": "StopperSwitches Indoor Push Buttons",
  "key-switches": "StopperSwitches Key Switches",
  "waterproof-push-buttons": "StopperSwitches Waterproof Push Buttons",
  "reset-call-points": "ReSet Call Points",
  "waterproof-reset-call-point": "Waterproof ReSet Call Point",
};

/**
 * URL slugs for each model (used in routing).
 */
export const MODEL_SLUGS: Record<ModelId, string> = {
  "stopper-stations": "stopper-stations",
  "indoor-push-buttons": "indoor-push-buttons",
  "key-switches": "key-switches",
  "waterproof-push-buttons": "waterproof-push-buttons",
  "reset-call-points": "reset-call-points",
  "waterproof-reset-call-point": "waterproof-reset-call-point",
};

// ============================================================================
// OPTION & STEP DEFINITIONS
// ============================================================================

/**
 * Option identifier (unique within a step).
 */
export type OptionId = string;

/**
 * Step identifier (unique within a model).
 */
export type StepId = string;

/**
 * Single selectable option within a step.
 */
export interface Option {
  /** Unique identifier within the step */
  id: OptionId;
  
  /** Display label (e.g., "#0 Red") */
  label: string;
  
  /** Code used in Product Model (e.g., "0", "R", "CL") */
  code: string;
  
  /** Optional image path for visual display */
  image?: string;
  
  /** Optional notes (e.g., "EXTENDED LEAD TIMES") */
  notes?: string;
  
  /**
   * List of option IDs from the dependency step that enable this option.
   * If undefined, option is always available.
   * If empty array, option is never available (hidden).
   */
  availableFor?: string[];
  
  /**
   * Step ID that this option depends on.
   * Used together with availableFor.
   */
  dependsOn?: StepId;
}

/**
 * A configuration step containing multiple options.
 */
export interface Step {
  /** Unique identifier within the model */
  id: StepId;
  
  /** Display title (e.g., "COLOUR & MOUNTING") */
  title: string;
  
  /** Whether selection is required for completion */
  required: boolean;
  
  /** Available options for this step */
  options: Option[];
}

// ============================================================================
// PRODUCT MODEL SCHEMA
// ============================================================================

/**
 * Schema defining how to build the Product Model code.
 */
export interface ProductModelSchema {
  /**
   * Base code prefix (e.g., "SS2", "SS3-", "WSS3", "RP", "WRP2")
   */
  baseCode: string;
  
  /**
   * Order of step codes in the final Product Model.
   * May differ from step display order.
   */
  partsOrder: StepId[];
  
  /**
   * Default separator between code parts.
   * - "none": no separator (concatenate directly)
   * - "dash": use "-" between parts
   */
  separator: "none" | "dash" | string;
  
  /**
   * Per-step separator overrides.
   * Key is stepId, value is separator to use BEFORE that step's code.
   * Empty string means no separator.
   */
  separatorMap?: Record<StepId, string>;
}

// ============================================================================
// MODEL DEFINITION
// ============================================================================

/**
 * Complete definition of a configurator model.
 */
export interface ModelDefinition {
  /** Unique model identifier */
  id: ModelId;
  
  /** Human-readable name */
  name: string;
  
  /** URL slug for routing */
  slug: string;
  
  /** All steps in this model */
  steps: Step[];
  
  /** Display order of steps in sidebar */
  stepOrder: StepId[];
  
  /** Schema for building Product Model code */
  productModelSchema: ProductModelSchema;
  
  /**
   * Step that drives dependencies for other steps.
   * Usually "colour" or "housingColour", but can be "switchType" for Key Switches.
   */
  primaryDependencyStep?: StepId;
}

// ============================================================================
// CONFIGURATION STATE
// ============================================================================

/**
 * Current user selections for a model.
 * Maps stepId to selected optionId (or null if not selected).
 */
export type Configuration = Record<StepId, OptionId | null>;

/**
 * Creates an empty configuration for a model.
 */
export function createEmptyConfiguration(model: ModelDefinition): Configuration {
  const config: Configuration = {};
  for (const stepId of model.stepOrder) {
    config[stepId] = null;
  }
  return config;
}

// ============================================================================
// PRODUCT MODEL RESULT
// ============================================================================

/**
 * Result of building a Product Model from configuration.
 */
export interface ProductModel {
  /** Base code prefix */
  baseCode: string;
  
  /** Map of stepId to code value */
  parts: Record<StepId, string>;
  
  /** Full assembled product code */
  fullCode: string;
  
  /** Whether all required steps are selected */
  isComplete: boolean;
  
  /** List of missing required step IDs */
  missingSteps?: StepId[];
}

// ============================================================================
// MY LIST (SAVED CONFIGURATIONS)
// ============================================================================

/**
 * A saved configuration in My List.
 */
export interface SavedConfiguration {
  /** Unique identifier for this saved item */
  id: string;
  
  /** Model this configuration belongs to */
  modelId: ModelId;
  
  /** Full Product Model code */
  productCode: string;
  
  /** Snapshot of configuration state */
  configuration: Configuration;
  
  /** Timestamp when saved */
  savedAt: number;
  
  /** Optional user-provided name */
  name?: string;
}

/**
 * Generates a unique ID for a saved configuration.
 */
export function generateSavedConfigurationId(): string {
  return `config-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================================
// AVAILABILITY RESULT (for Rule Engine)
// ============================================================================

/**
 * Result of checking option availability.
 */
export interface AvailabilityResult {
  /** Whether the option can be selected */
  available: boolean;
  
  /** Reason if not available */
  reason?: string;
  
  /** Step that caused the restriction */
  blockedBy?: StepId;
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================
// These exports maintain compatibility with existing Stopper Stations code.
// TODO: Remove after migrating all components to use ModelDefinition.
// ============================================================================

/**
 * @deprecated Use Configuration type with ModelDefinition instead.
 */
export type LegacyStepId =
  | "colour"
  | "cover"
  | "activation"
  | "text"
  | "language"
  | "installationOptions";

/**
 * @deprecated Use Configuration type instead.
 */
export interface LegacyConfiguration {
  colour: OptionId | null;
  cover: OptionId | null;
  activation: OptionId | null;
  text: OptionId | null;
  language: OptionId | null;
  installationOptions: OptionId | null;
}

/**
 * @deprecated Use stepOrder from ModelDefinition instead.
 */
export const STEP_ORDER: LegacyStepId[] = [
  "colour",
  "cover",
  "activation",
  "text",
  "language",
  "installationOptions",
];