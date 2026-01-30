import type { Option, Configuration, Step, ModelId, ModelDefinition } from "./types";
import type { ModelConstraints } from "./rules/types";
import { createConstraintEngine, getStepAvailability } from "./rules/constraintEngine";
import { G3_MULTIPURPOSE_PUSH_BUTTON_CONSTRAINTS } from "./rules/G3multipurposepushbuttonrules";
import {
  getValidOptionsForStep as getValidG3Options,
  type G3SelectionState,
} from "./rules/G3multipurposepushbuttonrules";

// ============================================================================
// Constraints registry
// ============================================================================

const CONSTRAINTS_MAP: Record<string, ModelConstraints> = {
  "g3-multipurpose-push-button": G3_MULTIPURPOSE_PUSH_BUTTON_CONSTRAINTS,
  // TODO: Add other models as they are migrated to allowlist validation
};

function getModelConstraints(modelId: ModelId): ModelConstraints | null {
  return CONSTRAINTS_MAP[modelId] ?? null;
}

// ============================================================================
// Basic option availability (legacy)
// ============================================================================

export function isOptionAvailable(
  option: Option,
  config: Configuration
): boolean {
  if (!option.availableFor) {
    return true;
  }

  if (!config.colour) {
    return false;
  }

  return option.availableFor.includes(config.colour);
}

export function filterAvailableOptions(
  options: Option[],
  config: Configuration
): Option[] {
  return options.filter((option) => isOptionAvailable(option, config));
}

export function isSelectionStillValid(
  optionId: string | null,
  options: Option[],
  config: Configuration
): boolean {
  if (!optionId) {
    return true;
  }

  const option = options.find((o) => o.id === optionId);

  if (!option) {
    return false;
  }

  return isOptionAvailable(option, config);
}

// ============================================================================
// Allowlist validation for G3 model
// ============================================================================

function configToG3Selection(config: Configuration): G3SelectionState {
  return {
    model: config.model ?? undefined,
    colour: config.colour ?? undefined,
    cover: config.cover ?? undefined,
    buttonType: config.buttonType ?? undefined,
    text: config.text ?? undefined,
    language: config.language ?? undefined,
  };
}

function isG3Model(modelId: ModelId): boolean {
  return modelId === "g3-multipurpose-push-button";
}

/**
 * Gets valid options for a step, applying allowlist validation for G3 model.
 * Returns Set of valid option IDs.
 */
function getG3AllowlistValidOptions(
  stepId: string,
  config: Configuration
): Set<string> | null {
  const g3Selection = configToG3Selection(config);
  
  // Remove the current step from selections to get "other" selections
  const { [stepId as keyof G3SelectionState]: _, ...otherSelections } = g3Selection;
  
  const validOptions = getValidG3Options(
    stepId as keyof G3SelectionState,
    otherSelections
  );
  
  return new Set(validOptions);
}

// ============================================================================
// Enhanced option availability with constraint engine + allowlist
// ============================================================================

export interface OptionAvailabilityResult {
  available: boolean;
  reason?: string;
}

export interface OptionWithAvailability {
  option: Option;
  availability: OptionAvailabilityResult;
}

/**
 * Gets all options for a step with their availability status.
 * Combines constraint matrix checks with allowlist validation for G3 model.
 */
export function getOptionsWithAvailability(
  step: Step,
  config: Configuration,
  modelId: ModelId
): OptionWithAvailability[] {
  const constraints = getModelConstraints(modelId);
  
  // If no constraints defined, all options are available
  if (!constraints) {
    return step.options.map((option) => ({
      option,
      availability: { available: true },
    }));
  }
  
  const engine = createConstraintEngine(constraints);
  const allOptionIds = step.options.map((o) => o.id);
  const stepAvailability = getStepAvailability(engine, step.id, allOptionIds, config);
  
  // For G3 model, also apply allowlist validation
  const g3AllowlistValid = isG3Model(modelId)
    ? getG3AllowlistValidOptions(step.id, config)
    : null;
  
  return step.options.map((option) => {
    const constraintResult = stepAvailability.options.find(
      (o) => o.optionId === option.id
    );
    
    // Check constraint matrix
    if (constraintResult && !constraintResult.available) {
      const reason = constraintResult.reasons.length > 0
        ? constraintResult.reasons[0].message
        : "Not available with current configuration";
      return {
        option,
        availability: { available: false, reason },
      };
    }
    
    // Check G3 allowlist (only if constraint passed)
    if (g3AllowlistValid && !g3AllowlistValid.has(option.id)) {
      return {
        option,
        availability: {
          available: false,
          reason: "This option does not lead to a valid product model",
        },
      };
    }
    
    return {
      option,
      availability: { available: true },
    };
  });
}

// ============================================================================
// Configuration completeness
// ============================================================================

export function isConfigurationComplete(
  model: ModelDefinition,
  config: Configuration
): boolean {
  for (const stepId of model.stepOrder) {
    const step = model.steps.find((s) => s.id === stepId);
    if (!step) continue;
    
    // Skip non-required steps
    if (!step.required) continue;
    
    const selection = config[stepId];
    if (!selection) {
      return false;
    }
  }
  return true;
}

export function getMissingRequiredSteps(
  model: ModelDefinition,
  config: Configuration
): string[] {
  const missing: string[] = [];
  
  for (const stepId of model.stepOrder) {
    const step = model.steps.find((s) => s.id === stepId);
    if (!step) continue;
    
    // Skip non-required steps
    if (!step.required) continue;
    
    const selection = config[stepId];
    if (!selection) {
      missing.push(stepId);
    }
  }
  
  return missing;
}

export function getCompletionPercentage(
  model: ModelDefinition,
  config: Configuration
): number {
  const requiredSteps = model.stepOrder.filter((stepId) => {
    const step = model.steps.find((s) => s.id === stepId);
    return step && step.required;
  });
  
  if (requiredSteps.length === 0) return 100;
  
  const completedCount = requiredSteps.filter(
    (stepId) => config[stepId] !== null && config[stepId] !== undefined
  ).length;
  
  return Math.round((completedCount / requiredSteps.length) * 100);
}

// ============================================================================
// Selection reset logic
// ============================================================================

/**
 * Returns list of step IDs that should be reset when a step selection changes.
 * This is needed when changing an earlier step invalidates later selections.
 */
export function getSelectionsToReset(
  model: ModelDefinition,
  changedStepId: string,
  newConfig: Configuration
): string[] {
  const toReset: string[] = [];
  const constraints = getModelConstraints(model.id);
  
  if (!constraints) {
    return toReset;
  }
  
  const engine = createConstraintEngine(constraints);
  const changedStepIndex = model.stepOrder.indexOf(changedStepId);
  
  // Check all steps after the changed step
  for (let i = changedStepIndex + 1; i < model.stepOrder.length; i++) {
    const stepId = model.stepOrder[i];
    const currentSelection = newConfig[stepId];
    
    if (!currentSelection) continue;
    
    const result = engine.checkOptionAvailability(stepId, currentSelection, newConfig);
    
    if (!result.available) {
      toReset.push(stepId);
    }
  }
  
  // For G3 model, also check if selection leads to invalid model
  if (isG3Model(model.id)) {
    for (let i = changedStepIndex + 1; i < model.stepOrder.length; i++) {
      const stepId = model.stepOrder[i];
      if (toReset.includes(stepId)) continue;
      
      const currentSelection = newConfig[stepId];
      if (!currentSelection) continue;
      
      const validOptions = getG3AllowlistValidOptions(stepId, newConfig);
      if (validOptions && !validOptions.has(currentSelection)) {
        toReset.push(stepId);
      }
    }
  }
  
  return toReset;
}