// ============================================================================
// UNIVERSAL RULE ENGINE - OPTION FILTERING
// ============================================================================
//
// Determines option availability based on dependencies defined in ModelDefinition.
//
// Supports:
// - Single-step dependencies (COLOUR → ACTIVATION)
// - Bidirectional dependencies (COLOUR ↔ BUTTON COLOUR)
// - Non-colour dependencies (SWITCH TYPE → ELECTRICAL)
//
// Rules:
// 1. Options WITHOUT `availableFor` are always available
// 2. Options WITH `availableFor` require the dependency step to have a selection
//    that is included in the availableFor array
// 3. If dependency step has no selection, dependent options are BLOCKED
//
// ============================================================================

import type {
  Option,
  Step,
  Configuration,
  ModelDefinition,
  AvailabilityResult,
  StepId,
} from "./types";

// ============================================================================
// CORE AVAILABILITY CHECK
// ============================================================================

/**
 * Checks if a single option is available based on current configuration.
 *
 * @param option - The option to check
 * @param config - Current configuration state
 * @returns AvailabilityResult with available flag and reason if blocked
 *
 * @example
 * // Option without dependency - always available
 * checkOptionAvailability(
 *   { id: "EN", label: "English", code: "EN" },
 *   config
 * );
 * // → { available: true }
 *
 * @example
 * // Option with dependency - blocked by unmet condition
 * checkOptionAvailability(
 *   { id: "R", code: "R", availableFor: ["1", "5", "7"], dependsOn: "colour" },
 *   { colour: "3", ... } // Green selected
 * );
 * // → { available: false, reason: "Not compatible with selected colour", blockedBy: "colour" }
 */
export function checkOptionAvailability(
  option: Option,
  config: Configuration
): AvailabilityResult {
  // No dependency defined = always available
  if (!option.availableFor || !option.dependsOn) {
    return { available: true };
  }

  const dependencyStepId = option.dependsOn;
  const selectedValue = config[dependencyStepId];

  // Dependency step has no selection = blocked (can't determine compatibility)
  if (!selectedValue) {
    return {
      available: false,
      reason: `Requires ${dependencyStepId} selection first`,
      blockedBy: dependencyStepId,
    };
  }

  // Check if selected value is in the allowed list
  if (option.availableFor.includes(selectedValue)) {
    return { available: true };
  }

  // Not compatible with current selection
  return {
    available: false,
    reason: `Not compatible with selected ${dependencyStepId}`,
    blockedBy: dependencyStepId,
  };
}

/**
 * Simple boolean check for option availability.
 * Use checkOptionAvailability() if you need the reason.
 */
export function isOptionAvailable(
  option: Option,
  config: Configuration
): boolean {
  return checkOptionAvailability(option, config).available;
}

// ============================================================================
// STEP-LEVEL FILTERING
// ============================================================================

/**
 * Gets all options for a step with their availability status.
 *
 * @param step - The step definition
 * @param config - Current configuration state
 * @returns Array of options with availability info
 */
export function getOptionsWithAvailability(
  step: Step,
  config: Configuration
): Array<{ option: Option; availability: AvailabilityResult }> {
  return step.options.map((option) => ({
    option,
    availability: checkOptionAvailability(option, config),
  }));
}

/**
 * Filters options to return only those currently available.
 *
 * @param options - Array of options to filter
 * @param config - Current configuration state
 * @returns Array of available options only
 */
export function filterAvailableOptions(
  options: Option[],
  config: Configuration
): Option[] {
  return options.filter((option) => isOptionAvailable(option, config));
}

/**
 * Counts available options in a step.
 */
export function countAvailableOptions(
  step: Step,
  config: Configuration
): number {
  return step.options.filter((opt) => isOptionAvailable(opt, config)).length;
}

// ============================================================================
// SELECTION VALIDATION
// ============================================================================

/**
 * Checks if a current selection is still valid after configuration change.
 *
 * @param optionId - The ID of the selected option
 * @param step - The step definition containing the option
 * @param config - Current configuration state
 * @returns true if the selection is still valid
 */
export function isSelectionStillValid(
  optionId: string | null,
  step: Step,
  config: Configuration
): boolean {
  if (!optionId) {
    return true; // No selection = nothing to validate
  }

  const option = step.options.find((o) => o.id === optionId);
  if (!option) {
    return false; // Option not found = invalid
  }

  return isOptionAvailable(option, config);
}

/**
 * Finds all invalid selections in a configuration after a change.
 *
 * @param model - Model definition
 * @param config - Current configuration state
 * @returns Array of stepIds with invalid selections
 */
export function findInvalidSelections(
  model: ModelDefinition,
  config: Configuration
): StepId[] {
  const invalid: StepId[] = [];

  for (const step of model.steps) {
    const selectedId = config[step.id];
    if (selectedId && !isSelectionStillValid(selectedId, step, config)) {
      invalid.push(step.id);
    }
  }

  return invalid;
}

// ============================================================================
// CASCADE RESET LOGIC
// ============================================================================

/**
 * Determines which selections should be reset when a step changes.
 * Handles cascading dependencies.
 *
 * @param model - Model definition
 * @param changedStepId - The step that was just changed
 * @param config - Current configuration state (after the change)
 * @returns Array of stepIds that should be reset to null
 *
 * @example
 * // User changes colour from Red to Green
 * // Button colour "R" (Red) is no longer valid for Green housing
 * getSelectionsToReset(model, "colour", { colour: "3", buttonColour: "R", ... });
 * // → ["buttonColour"]
 */
export function getSelectionsToReset(
  model: ModelDefinition,
  changedStepId: StepId,
  config: Configuration
): StepId[] {
  const toReset: StepId[] = [];

  for (const step of model.steps) {
    // Skip the step that was just changed
    if (step.id === changedStepId) {
      continue;
    }

    // Check if any option in this step depends on the changed step
    const hasDependency = step.options.some(
      (opt) => opt.dependsOn === changedStepId
    );

    if (hasDependency) {
      const selectedId = config[step.id];
      if (selectedId && !isSelectionStillValid(selectedId, step, config)) {
        toReset.push(step.id);
      }
    }
  }

  return toReset;
}

// ============================================================================
// MODEL-LEVEL UTILITIES
// ============================================================================

/**
 * Checks if a configuration is complete (all required steps selected).
 */
export function isConfigurationComplete(
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

/**
 * Gets list of missing required steps.
 */
export function getMissingRequiredSteps(
  model: ModelDefinition,
  config: Configuration
): StepId[] {
  return model.steps
    .filter((step) => step.required && !config[step.id])
    .map((step) => step.id);
}

/**
 * Gets completion percentage (0-100).
 */
export function getCompletionPercentage(
  model: ModelDefinition,
  config: Configuration
): number {
  const requiredSteps = model.steps.filter((s) => s.required);
  if (requiredSteps.length === 0) return 100;

  const completedCount = requiredSteps.filter((s) => config[s.id]).length;
  return Math.round((completedCount / requiredSteps.length) * 100);
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================
// These functions maintain compatibility with existing Stopper Stations code.
// They assume colour-based dependencies only.
// TODO: Remove after migrating all components.
// ============================================================================

/**
 * @deprecated Use isOptionAvailable with full config instead.
 * Legacy function that only checks colour dependency.
 */
export function isOptionAvailableLegacy(
  option: Option,
  colourId: string | null
): boolean {
  if (!option.availableFor) {
    return true;
  }
  if (!colourId) {
    return false;
  }
  return option.availableFor.includes(colourId);
}