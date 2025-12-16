// ============================================================================
// KEY SWITCHES MODEL DEFINITION
// ============================================================================
//
// Source: 03_Конфигуратор_StopperSwitches_Key_Switches.pdf (VERIFIED)
// BaseCode: SS3-
// Format: SS3-[colourMounting][switchType][electrical][-CL]
//
// Example: SS3-1020 (Red Dual Mount, Switch Type #2, Single Pole)
// Example: SS3-1020-CL (with Custom Label)
//
// Steps:
// 1. COLOUR & MOUNTING
// 2. SWITCH TYPE
// 3. ELECTRICAL ARRANGEMENT
// 4. LABEL
//
// CRITICAL: This model has BI-DIRECTIONAL dependencies between
// SWITCH TYPE and ELECTRICAL ARRANGEMENT.
// ============================================================================

import type { ModelDefinition, Step } from "../../types";

// ============================================================================
// COMPATIBILITY MATRICES (from PDF pages with dependencies)
// ============================================================================

// SWITCH TYPE → ELECTRICAL ARRANGEMENT availability
const SWITCH_TO_ELECTRICAL: Record<string, string[]> = {
  "2": ["0"],           // Switch Type #2 → Single Pole only
  "3": ["0", "1", "2"], // Switch Type #3 → Single Pole, Double Pole NO, Double Pole NC
  "4": ["1", "2"],      // Switch Type #4 → Double Pole NO, Double Pole NC
  "5": ["3"],           // Switch Type #5 → Position Key Switch only
};

// ELECTRICAL ARRANGEMENT → SWITCH TYPE availability (reverse mapping)
const ELECTRICAL_TO_SWITCH: Record<string, string[]> = {
  "0": ["2", "3"],      // Single Pole → Switch Type #2, #3
  "1": ["3", "4"],      // Double Pole NO → Switch Type #3, #4
  "2": ["3", "4"],      // Double Pole NC → Switch Type #3, #4
  "3": ["5"],           // Position Key Switch → Switch Type #5 only
};

// ============================================================================
// STEPS DEFINITION (VERIFIED FROM PDF 03)
// ============================================================================

const steps: Step[] = [
  // ==========================================================================
  // STEP 1: COLOUR & MOUNTING
  // ==========================================================================
  // No dependencies - all options always available
  // Note: Codes are 2 characters (e.g., "10", "30", "E0")
  // ==========================================================================
  {
    id: "colourMounting",
    title: "COLOUR & MOUNTING",
    required: true,
    options: [
      { id: "10", label: "#10 Red (Dual Mount)", code: "10" },
      { id: "30", label: "#30 Green (Dual Mount)", code: "30" },
      { id: "50", label: "#50 Yellow (Dual Mount)", code: "50" },
      { id: "70", label: "#70 White (Dual Mount)", code: "70" },
      { id: "90", label: "#90 Blue (Dual Mount)", code: "90" },
      { id: "E0", label: "#E0 Orange (Dual Mount)", code: "E0" },
    ],
  },

  // ==========================================================================
  // STEP 2: SWITCH TYPE
  // ==========================================================================
  // No dependencies on COLOUR & MOUNTING
  // But has dependencies TO ELECTRICAL ARRANGEMENT
  // ==========================================================================
  {
    id: "switchType",
    title: "SWITCH TYPE",
    required: true,
    options: [
      { id: "2", label: "#2 Switch Type", code: "2" },
      { id: "3", label: "#3 Switch Type", code: "3" },
      { id: "4", label: "#4 Switch Type", code: "4" },
      { id: "5", label: "#5 Switch Type", code: "5" },
    ],
  },

  // ==========================================================================
  // STEP 3: ELECTRICAL ARRANGEMENT
  // ==========================================================================
  // Bidirectional dependencies with SWITCH TYPE step.
  // Forward: SWITCH TYPE → ELECTRICAL (defined in availableFor)
  // Reverse: ELECTRICAL → SWITCH TYPE (needs rule engine support)
  // ==========================================================================
  {
    id: "electricalArrangement",
    title: "ELECTRICAL ARRANGEMENT",
    required: true,
    options: [
      {
        id: "0",
        label: "#0 Single Pole Changeover",
        code: "0",
        availableFor: ["2", "3"], // From ELECTRICAL_TO_SWITCH
        dependsOn: "switchType",
      },
      {
        id: "1",
        label: "#1 Double Pole Normally Open",
        code: "1",
        availableFor: ["3", "4"],
        dependsOn: "switchType",
      },
      {
        id: "2",
        label: "#2 Double Pole Normally Closed",
        code: "2",
        availableFor: ["3", "4"],
        dependsOn: "switchType",
      },
      {
        id: "3",
        label: "#3 Position Key Switch Arrangement",
        code: "3",
        availableFor: ["5"], // Only Switch Type #5
        dependsOn: "switchType",
      },
    ],
  },

  // ==========================================================================
  // STEP 4: LABEL
  // ==========================================================================
  // Only #CL adds code to Product Model
  // ==========================================================================
  {
    id: "label",
    title: "LABEL",
    required: true,
    options: [
      {
        id: "SAK",
        label: "# Self-Assemble Label Kit",
        code: "", // No code in Product Model
      },
      {
        id: "CL",
        label: "#CL Custom Label",
        code: "CL", // Adds "-CL" section to Product Model
      },
    ],
  },
];

// ============================================================================
// MODEL DEFINITION
// ============================================================================

export const keySwitchesModel: ModelDefinition = {
  id: "key-switches",
  name: "StopperSwitches Key Switches",
  slug: "key-switches",
  
  steps,
  
  stepOrder: [
    "colourMounting",
    "switchType",
    "electricalArrangement",
    "label",
  ],
  
  productModelSchema: {
    baseCode: "SS3-",
    partsOrder: [
      "colourMounting",
      "switchType",
      "electricalArrangement",
      "label",
    ],
    separator: "none", // Parts are concatenated without separator
    // Format: SS3-[colourMounting][switchType][electrical][-CL]
    // Note: label code is only added if CL is selected, with dash prefix
    separatorMap: {
      colourMounting: "",
      switchType: "",
      electricalArrangement: "",
      label: "-", // Dash before CL if present
    },
  },
  
  // IMPORTANT: This model's primary dependency is switchType → electricalArrangement
  // Not colour-based like other models
  primaryDependencyStep: "switchType",
};

// ============================================================================
// BIDIRECTIONAL DEPENDENCY IMPLEMENTATION NOTES
// ============================================================================
//
// This model differs from others:
// - COLOUR & MOUNTING has NO dependencies (all always available)
// - Dependencies exist between SWITCH TYPE ↔ ELECTRICAL ARRANGEMENT
//
// Current implementation: SWITCH TYPE → ELECTRICAL (forward only)
// TODO: Implement reverse filtering (ELECTRICAL → SWITCH TYPE)
//
// The rule engine needs special handling for this model because
// primaryDependencyStep is "switchType" not "colour"
// ============================================================================

// Export compatibility matrices for rule engine
export const keySwitchesCompatibility = {
  switchToElectrical: SWITCH_TO_ELECTRICAL,
  electricalToSwitch: ELECTRICAL_TO_SWITCH,
};