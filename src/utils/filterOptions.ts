// ============================================================================
// STOPPER STATION CALCULATOR - OPTION FILTERING UTILITIES
// ============================================================================
//
// CRITICAL: This module handles the core filtering logic that determines
// which options are available based on the selected colour.
//
// Rules:
// 1. Options WITHOUT `availableFor` are always available (no colour dependency)
// 2. Options WITH `availableFor` require the selected colour ID to be in the array
// 3. If no colour is selected yet, all dependent options are BLOCKED
// ============================================================================

import type { Option, Configuration } from "../types";

/**
 * Checks if a single option is available based on current configuration.
 *
 * @param option - The option to check
 * @param config - Current configuration state
 * @returns true if the option can be selected
 *
 * @example
 * // Option without dependency - always available
 * isOptionAvailable({ id: "EN", label: "English", code: "EN" }, config) // true
 *
 * @example
 * // Option with dependency - requires matching colour
 * isOptionAvailable(
 *   { id: "6-red", code: "6", availableFor: ["0", "2", "3", "5"] },
 *   { colour: "1", ... } // Green selected
 * ) // false - Green (1) not in availableFor
 */
export function isOptionAvailable(
  option: Option,
  config: Configuration
): boolean {
  // No dependency defined = always available
  if (!option.availableFor) {
    return true;
  }

  // Dependency exists but no colour selected = blocked
  if (!config.colour) {
    return false;
  }

  // Check if selected colour is in the allowed list
  return option.availableFor.includes(config.colour);
}

/**
 * Filters an array of options to return only those currently available.
 *
 * @param options - Array of options to filter
 * @param config - Current configuration state
 * @returns Array of available options only
 *
 * @example
 * const available = filterAvailableOptions(activationOptions, { colour: "0" });
 * // Returns only activation options available for Red
 */
export function filterAvailableOptions(
  options: Option[],
  config: Configuration
): Option[] {
  return options.filter((option) => isOptionAvailable(option, config));
}

/**
 * Checks if a previously selected option is still valid after colour change.
 * Used to determine if dependent selections need to be reset.
 *
 * @param optionId - The ID of the selected option
 * @param options - All options in the step
 * @param config - Current configuration (with new colour)
 * @returns true if the selection is still valid
 *
 * @example
 * // User selected 6-red, then changed colour from Red to Green
 * isSelectionStillValid("6-red", activationOptions, { colour: "1" })
 * // false - 6-red is not available for Green
 */
export function isSelectionStillValid(
  optionId: string | null,
  options: Option[],
  config: Configuration
): boolean {
  // No selection = nothing to validate
  if (!optionId) {
    return true;
  }

  // Find the option
  const option = options.find((o) => o.id === optionId);

  // Option not found = invalid (shouldn't happen, but safe fallback)
  if (!option) {
    return false;
  }

  // Check availability with current config
  return isOptionAvailable(option, config);
}