// ============================================================================
// CONFIGURATION STORE (ZUSTAND)
// ============================================================================
//
// Global state management for configurator.
// Handles:
// - Current model selection
// - Configuration state per model
// - My List (saved configurations)
// - Cascade reset of dependent options
//
// Why Zustand over Redux:
// - Simpler API, less boilerplate
// - Built-in TypeScript support
// - Easy persist middleware for localStorage
// - Sufficient for this app's complexity
//
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ModelId,
  Configuration,
  StepId,
  OptionId,
  ModelDefinition,
  SavedConfiguration,
} from "../types";
import { createEmptyConfiguration, generateSavedConfigurationId } from "../types";
import { getModelById } from "../data/models";
import {
  getSelectionsToReset,
  isConfigurationComplete,
  getMissingRequiredSteps,
} from "../filterOptions";
import { buildProductModel } from "../buildProductModel";

// ============================================================================
// TYPES
// ============================================================================

interface ConfigurationState {
  // ---------------------------------------------------------------------------
  // Current Model & Configuration
  // ---------------------------------------------------------------------------
  
  /** Currently active model ID */
  currentModelId: ModelId | null;
  
  /** Configuration state for the current model */
  config: Configuration;
  
  /** Currently open accordion step */
  currentStep: StepId | null;

  // ---------------------------------------------------------------------------
  // My List (Saved Configurations)
  // ---------------------------------------------------------------------------
  
  /** List of saved configurations */
  myList: SavedConfiguration[];

  // ---------------------------------------------------------------------------
  // Actions: Model Selection
  // ---------------------------------------------------------------------------
  
  /** Set the active model (resets configuration) */
  setModel: (modelId: ModelId) => void;
  
  /** Clear current model (return to home) */
  clearModel: () => void;

  // ---------------------------------------------------------------------------
  // Actions: Configuration
  // ---------------------------------------------------------------------------
  
  /** Select an option for a step */
  selectOption: (stepId: StepId, optionId: OptionId) => void;
  
  /** Clear selection for a step */
  clearSelection: (stepId: StepId) => void;
  
  /** Reset configuration to initial state */
  resetConfiguration: () => void;
  
  /** Set current accordion step */
  setCurrentStep: (stepId: StepId) => void;

  // ---------------------------------------------------------------------------
  // Actions: My List
  // ---------------------------------------------------------------------------
  
  /** Add current configuration to My List */
  addToMyList: (name?: string) => void;
  
  /** Remove item from My List */
  removeFromMyList: (id: string) => void;
  
  /** Clear entire My List */
  clearMyList: () => void;
  
  /** Load a saved configuration */
  loadFromMyList: (id: string) => void;

  // ---------------------------------------------------------------------------
  // Computed Getters
  // ---------------------------------------------------------------------------
  
  /** Get current model definition */
  getModel: () => ModelDefinition | null;
  
  /** Check if configuration is complete */
  isComplete: () => boolean;
  
  /** Get missing required steps */
  getMissingSteps: () => StepId[];
  
  /** Get full product code */
  getProductCode: () => string | null;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useConfigurationStore = create<ConfigurationState>()(
  persist(
    (set, get) => ({
      // -----------------------------------------------------------------------
      // Initial State
      // -----------------------------------------------------------------------
      currentModelId: null,
      config: {},
      currentStep: null,
      myList: [],

      // -----------------------------------------------------------------------
      // Model Selection
      // -----------------------------------------------------------------------
      setModel: (modelId) => {
        const model = getModelById(modelId);
        if (!model) {
          console.error(`Model not found: ${modelId}`);
          return;
        }

        set({
          currentModelId: modelId,
          config: createEmptyConfiguration(model),
          currentStep: model.stepOrder[0],
        });
      },

      clearModel: () => {
        set({
          currentModelId: null,
          config: {},
          currentStep: null,
        });
      },

      // -----------------------------------------------------------------------
      // Configuration Actions
      // -----------------------------------------------------------------------
      selectOption: (stepId, optionId) => {
        const { currentModelId, config } = get();
        const model = currentModelId ? getModelById(currentModelId) : null;
        
        if (!model) return;

        // Update config with new selection
        const newConfig = { ...config, [stepId]: optionId };

        // Find and reset any dependent selections that are now invalid
        const toReset = getSelectionsToReset(model, stepId, newConfig);
        for (const resetStepId of toReset) {
          newConfig[resetStepId] = null;
        }

        // Auto-advance to next step
        const currentIndex = model.stepOrder.indexOf(stepId);
        const nextStep =
          currentIndex < model.stepOrder.length - 1
            ? model.stepOrder[currentIndex + 1]
            : stepId;

        set({
          config: newConfig,
          currentStep: nextStep,
        });
      },

      clearSelection: (stepId) => {
        const { currentModelId, config } = get();
        const model = currentModelId ? getModelById(currentModelId) : null;
        
        if (!model) return;

        const newConfig = { ...config, [stepId]: null };

        // Reset dependent selections
        const toReset = getSelectionsToReset(model, stepId, newConfig);
        for (const resetStepId of toReset) {
          newConfig[resetStepId] = null;
        }

        set({ config: newConfig });
      },

      resetConfiguration: () => {
        const { currentModelId } = get();
        const model = currentModelId ? getModelById(currentModelId) : null;
        
        if (!model) return;

        set({
          config: createEmptyConfiguration(model),
          currentStep: model.stepOrder[0],
        });
      },

      setCurrentStep: (stepId) => {
        set({ currentStep: stepId });
      },

      // -----------------------------------------------------------------------
      // My List Actions
      // -----------------------------------------------------------------------
      addToMyList: (name) => {
        const { currentModelId, config, myList } = get();
        
        if (!currentModelId) {
          console.warn("Cannot add to My List: no model selected");
          return;
        }

        const model = getModelById(currentModelId);
        
        if (!model || !isConfigurationComplete(model, config)) {
          console.warn("Cannot add incomplete configuration to My List");
          return;
        }

        const productModel = buildProductModel(config, model);

        const savedConfig: SavedConfiguration = {
          id: generateSavedConfigurationId(),
          modelId: currentModelId,
          productCode: productModel.fullCode,
          configuration: { ...config },
          savedAt: Date.now(),
          name,
        };

        set({ myList: [...myList, savedConfig] });
      },

      removeFromMyList: (id) => {
        const { myList } = get();
        set({ myList: myList.filter((item) => item.id !== id) });
      },

      clearMyList: () => {
        set({ myList: [] });
      },

      loadFromMyList: (id) => {
        const { myList } = get();
        const saved = myList.find((item) => item.id === id);
        
        if (!saved) {
          console.warn(`Saved configuration not found: ${id}`);
          return;
        }

        const model = getModelById(saved.modelId);
        if (!model) {
          console.warn(`Model not found: ${saved.modelId}`);
          return;
        }

        set({
          currentModelId: saved.modelId,
          config: { ...saved.configuration },
          currentStep: model.stepOrder[model.stepOrder.length - 1], // Go to last step
        });
      },

      // -----------------------------------------------------------------------
      // Computed Getters
      // -----------------------------------------------------------------------
      getModel: () => {
        const { currentModelId } = get();
        return currentModelId ? getModelById(currentModelId) ?? null : null;
      },

      isComplete: () => {
        const { currentModelId, config } = get();
        const model = currentModelId ? getModelById(currentModelId) : null;
        return model ? isConfigurationComplete(model, config) : false;
      },

      getMissingSteps: () => {
        const { currentModelId, config } = get();
        const model = currentModelId ? getModelById(currentModelId) : null;
        return model ? getMissingRequiredSteps(model, config) : [];
      },

      getProductCode: () => {
        const { currentModelId, config } = get();
        const model = currentModelId ? getModelById(currentModelId) : null;
        
        if (!model || !isConfigurationComplete(model, config)) {
          return null;
        }

        return buildProductModel(config, model).fullCode;
      },
    }),
    {
      name: "configurator-storage",
      // Only persist myList to localStorage, not current session state
      partialize: (state) => ({ myList: state.myList }),
    }
  )
);

// ============================================================================
// SELECTOR HOOKS (for performance optimization)
// ============================================================================

/**
 * Select only the current model ID.
 */
export const useCurrentModelId = () =>
  useConfigurationStore((state) => state.currentModelId);

/**
 * Select current configuration.
 */
export const useConfig = () =>
  useConfigurationStore((state) => state.config);

/**
 * Select current step.
 */
export const useCurrentStep = () =>
  useConfigurationStore((state) => state.currentStep);

/**
 * Select My List.
 */
export const useMyList = () =>
  useConfigurationStore((state) => state.myList);

/**
 * Select My List count.
 */
export const useMyListCount = () =>
  useConfigurationStore((state) => state.myList.length);