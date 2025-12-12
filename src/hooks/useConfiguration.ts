// ============================================================================
// STOPPER STATION CALCULATOR - CONFIGURATION STATE HOOK
// ============================================================================
//
// Custom hook that manages the entire calculator state:
// - Current configuration (selected options for each step)
// - Current open step (accordion navigation)
// - Auto-reset of dependent options when colour changes
// - Navigation to next step after selection
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import type { Configuration, StepId, OptionId } from "../types";
import { STEP_ORDER } from "../types";
import { STEPS } from "../data/steps";
import { isSelectionStillValid } from "../utils/filterOptions";

/**
 * Initial empty configuration state
 */
const INITIAL_CONFIG: Configuration = {
  colour: null,
  cover: null,
  activation: null,
  text: null,
  language: null,
  installationOptions: null,
};

/**
 * Hook return type
 */
interface UseConfigurationReturn {
  /** Current configuration state */
  config: Configuration;
  
  /** Currently open accordion step */
  currentStep: StepId;
  
  /** Select an option for a step */
  selectOption: (stepId: StepId, optionId: OptionId) => void;
  
  /** Reset entire configuration to initial state */
  resetConfiguration: () => void;
  
  /** Manually set which step is open */
  setCurrentStep: (stepId: StepId) => void;
}

/**
 * Custom hook for managing calculator configuration state.
 *
 * Features:
 * - Tracks selections for all 6 steps
 * - Auto-advances to next step after selection
 * - CRITICAL: Auto-resets ACTIVATION and INSTALLATION OPTIONS
 *   if they become invalid after colour change
 *
 * @returns Configuration state and control functions
 *
 * @example
 * const { config, currentStep, selectOption, resetConfiguration } = useConfiguration();
 *
 * // Select Red colour
 * selectOption("colour", "0");
 *
 * // config.colour is now "0"
 * // currentStep auto-advanced to "cover"
 */
export function useConfiguration(): UseConfigurationReturn {
  const [config, setConfig] = useState<Configuration>(INITIAL_CONFIG);
  const [currentStep, setCurrentStep] = useState<StepId>("colour");

  // ==========================================================================
  // CRITICAL: Reset dependent steps when colour changes
  // ==========================================================================
  // When user changes colour, previously selected ACTIVATION or INSTALLATION
  // OPTIONS may become unavailable. This effect detects and resets them.
  // ==========================================================================
  useEffect(() => {
    // Skip if no colour selected
    if (!config.colour) {
      return;
    }

    const activationStep = STEPS.find((s) => s.id === "activation");
    const installationStep = STEPS.find((s) => s.id === "installationOptions");

    let needsUpdate = false;
    const newConfig = { ...config };

    // Check if current ACTIVATION selection is still valid
    if (config.activation && activationStep) {
      const isValid = isSelectionStillValid(
        config.activation,
        activationStep.options,
        config
      );
      if (!isValid) {
        newConfig.activation = null;
        needsUpdate = true;
      }
    }

    // Check if current INSTALLATION OPTIONS selection is still valid
    if (config.installationOptions && installationStep) {
      const isValid = isSelectionStillValid(
        config.installationOptions,
        installationStep.options,
        config
      );
      if (!isValid) {
        newConfig.installationOptions = null;
        needsUpdate = true;
      }
    }

    // Only update state if something changed (avoid infinite loop)
    if (needsUpdate) {
      setConfig(newConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.colour]); // Only trigger on colour change

  // ==========================================================================
  // Select an option and advance to next step
  // ==========================================================================
  const selectOption = useCallback((stepId: StepId, optionId: OptionId) => {
    // Update configuration
    setConfig((prev) => ({
      ...prev,
      [stepId]: optionId,
    }));

    // Auto-advance to next step
    const currentIndex = STEP_ORDER.indexOf(stepId);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, []);

  // ==========================================================================
  // Reset configuration to initial state
  // ==========================================================================
  const resetConfiguration = useCallback(() => {
    setConfig(INITIAL_CONFIG);
    setCurrentStep("colour");
  }, []);

  // ==========================================================================
  // Manual step navigation (for accordion toggle)
  // ==========================================================================
  const handleSetCurrentStep = useCallback((stepId: StepId) => {
    setCurrentStep(stepId);
  }, []);

  return {
    config,
    currentStep,
    selectOption,
    resetConfiguration,
    setCurrentStep: handleSetCurrentStep,
  };
}