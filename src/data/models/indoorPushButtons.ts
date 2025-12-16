// ============================================================================
// INDOOR PUSH BUTTONS MODEL DEFINITION
// ============================================================================
//
// Source: 02_Конфигуратор_StopperSwitches_Indoor_Push_Buttons.pdf (VERIFIED)
// BaseCode: SS3-
// Format: SS3-[colour][buttonColour][pushButtonType][electrical][-CL]
//
// Example: SS3-1R04 (Red housing, Red button, Key-to-Reset, Multi-Functional)
// Example: SS3-1R04-CL (with Custom Label)
//
// Steps:
// 1. COLOUR (housing colour)
// 2. BUTTON COLOUR
// 3. PUSH BUTTON TYPE
// 4. ELECTRICAL ARRANGEMENTS
// 5. LABEL
//
// CRITICAL: This model has BI-DIRECTIONAL dependencies between COLOUR and BUTTON COLOUR.
// ============================================================================

import type { ModelDefinition, Step } from "../../types";

// ============================================================================
// COMPATIBILITY MATRICES (from PDF pages 23-31)
// ============================================================================

// COLOUR → BUTTON COLOUR availability
const COLOUR_TO_BUTTON: Record<string, string[]> = {
  "1": ["R", "W"],           // Red housing → Red, White buttons
  "3": ["R", "G", "Y", "W", "B", "E"], // Green housing → all buttons
  "5": ["R", "G", "Y"],      // Yellow housing → Red, Green, Yellow buttons
  "7": ["R", "G", "W", "B"], // White housing → Red, Green, White, Blue buttons
  "9": ["W", "B"],           // Blue housing → White, Blue buttons
  "E": ["W", "E"],           // Orange housing → White, Orange buttons
};

// BUTTON COLOUR → COLOUR availability (reverse mapping)
const BUTTON_TO_COLOUR: Record<string, string[]> = {
  "R": ["1", "5", "7"],      // Red button → Red, Yellow, White housing
  "G": ["3", "5", "7"],      // Green button → Green, Yellow, White housing
  "Y": ["5"],                // Yellow button → Yellow housing only
  "W": ["1", "3", "7", "9", "E"], // White button → Red, Green, White, Blue, Orange housing
  "B": ["7", "9"],           // Blue button → White, Blue housing
  "E": ["E"],                // Orange button → Orange housing only
};

// ============================================================================
// STEPS DEFINITION (VERIFIED FROM PDF 02)
// ============================================================================

const steps: Step[] = [
  // ==========================================================================
  // STEP 1: COLOUR (Housing Colour)
  // ==========================================================================
  {
    id: "colour",
    title: "COLOUR",
    required: true,
    options: [
      { id: "1", label: "#1 Red (Dual Mount)", code: "1" },
      { id: "3", label: "#3 Green (Dual Mount)", code: "3" },
      { id: "5", label: "#5 Yellow (Dual Mount)", code: "5" },
      { id: "7", label: "#7 White (Dual Mount)", code: "7" },
      { id: "9", label: "#9 Blue (Dual Mount)", code: "9" },
      { id: "E", label: "#E Orange (Dual Mount)", code: "E" },
    ],
  },

  // ==========================================================================
  // STEP 2: BUTTON COLOUR
  // ==========================================================================
  // Bidirectional dependencies with COLOUR step.
  // availableFor uses COLOUR_TO_BUTTON mapping.
  // ==========================================================================
  {
    id: "buttonColour",
    title: "BUTTON COLOUR",
    required: true,
    options: [
      {
        id: "R",
        label: "#R Red Button",
        code: "R",
        availableFor: ["1", "5", "7"], // From BUTTON_TO_COLOUR
        dependsOn: "colour",
      },
      {
        id: "G",
        label: "#G Green Button",
        code: "G",
        availableFor: ["3", "5", "7"],
        dependsOn: "colour",
      },
      {
        id: "Y",
        label: "#Y Yellow Button",
        code: "Y",
        availableFor: ["5"], // Only Yellow housing
        dependsOn: "colour",
      },
      {
        id: "W",
        label: "#W White Button",
        code: "W",
        availableFor: ["1", "3", "7", "9", "E"],
        dependsOn: "colour",
      },
      {
        id: "B",
        label: "#B Blue Button",
        code: "B",
        availableFor: ["7", "9"],
        dependsOn: "colour",
      },
      {
        id: "E",
        label: "#E Orange Button",
        code: "E",
        availableFor: ["E"], // Only Orange housing
        dependsOn: "colour",
      },
    ],
  },

  // ==========================================================================
  // STEP 3: PUSH BUTTON TYPE
  // ==========================================================================
  // No dependencies - all options always available
  // ==========================================================================
  {
    id: "pushButtonType",
    title: "PUSH BUTTON TYPE",
    required: true,
    options: [
      { id: "0", label: "#0 Key-to-Reset", code: "0" },
      { id: "1", label: "#1 Momentary", code: "1" },
      { 
        id: "6", 
        label: "#6 Pneumatic EXTENDED LEAD TIMES", 
        code: "6",
        notes: "EXTENDED LEAD TIMES",
      },
    ],
  },

  // ==========================================================================
  // STEP 4: ELECTRICAL ARRANGEMENTS
  // ==========================================================================
  // No dependencies - all options always available
  // ==========================================================================
  {
    id: "electricalArrangements",
    title: "ELECTRICAL ARRANGEMENTS",
    required: true,
    options: [
      { id: "0", label: "#0 Single Pole Changeover", code: "0" },
      { id: "4", label: "#4 Multi-Functional Signal (SPC & DPC)", code: "4" },
    ],
  },

  // ==========================================================================
  // STEP 5: LABEL
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

export const indoorPushButtonsModel: ModelDefinition = {
  id: "indoor-push-buttons",
  name: "StopperSwitches Indoor Push Buttons",
  slug: "indoor-push-buttons",
  
  steps,
  
  stepOrder: [
    "colour",
    "buttonColour",
    "pushButtonType",
    "electricalArrangements",
    "label",
  ],
  
  productModelSchema: {
    baseCode: "SS3-",
    partsOrder: [
      "colour",
      "buttonColour",
      "pushButtonType",
      "electricalArrangements",
      "label",
    ],
    separator: "none", // Parts are concatenated without separator
    // Format: SS3-[colour][buttonColour][pushButtonType][electrical][-CL]
    // Note: label code is only added if CL is selected, with dash prefix
    separatorMap: {
      colour: "",
      buttonColour: "",
      pushButtonType: "",
      electricalArrangements: "",
      label: "-", // Dash before CL if present
    },
  },
  
  primaryDependencyStep: "colour",
};

// ============================================================================
// BIDIRECTIONAL DEPENDENCY IMPLEMENTATION NOTES
// ============================================================================
//
// The current architecture uses `availableFor` which checks:
// "Is this option available given the COLOUR selection?"
//
// But PDF also shows reverse dependencies:
// - If BUTTON COLOUR is selected first, COLOUR options should be filtered
//
// For full bidirectional support, the rule engine needs to:
// 1. Store both COLOUR_TO_BUTTON and BUTTON_TO_COLOUR mappings
// 2. Check which step was selected first
// 3. Filter the other step accordingly
//
// Current implementation: Forward direction only (COLOUR → BUTTON COLOUR)
// TODO: Implement reverse filtering in filterOptions.ts
// ============================================================================

// Export compatibility matrices for rule engine
export const indoorPushButtonsCompatibility = {
  colourToButton: COLOUR_TO_BUTTON,
  buttonToColour: BUTTON_TO_COLOUR,
};