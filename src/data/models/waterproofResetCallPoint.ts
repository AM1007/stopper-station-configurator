// ============================================================================
// WATERPROOF RESET CALL POINT MODEL DEFINITION
// ============================================================================
//
// Source: 06_Конфигуратор_Waterproof_ReSet_Call_Point.pdf (VERIFIED)
// BaseCode: WRP2
// Format: WRP2-[colour]-[electrical]-[label?]
//
// Example: WRP2-R-01 (Red, Conventional Fire Model, House Flame Logo)
// Example: WRP2-R-01-CL (with Custom Label)
//
// Steps:
// 1. COLOUR
// 2. ELECTRICAL ARRANGEMENT
// 3. LABEL
//
// NOTE: No MOUNTING step (unlike ReSet Call Points PDF 05)
// ============================================================================

import type { ModelDefinition, Step } from "../../types";

// ============================================================================
// STEPS DEFINITION (VERIFIED FROM PDF 06)
// ============================================================================

const steps: Step[] = [
  // ==========================================================================
  // STEP 1: COLOUR
  // ==========================================================================
  {
    id: "colour",
    title: "COLOUR",
    required: true,
    options: [
      { id: "R", label: "#R Red", code: "R" },
      { id: "G", label: "#G Green", code: "G" },
      { id: "Y", label: "#Y Yellow", code: "Y" },
      { id: "B", label: "#B Blue", code: "B" },
      { id: "W", label: "#W White", code: "W" },
      { id: "O", label: "#O Orange", code: "O" },
    ],
  },

  // ==========================================================================
  // STEP 2: ELECTRICAL ARRANGEMENT
  // ==========================================================================
  // Dependencies from PDF 06 pages 19-23:
  // - #01: Only Red (R)
  // - #02: Green, Yellow, Blue, White, Orange (NOT Red)
  // - #11: Green, Yellow, Blue, White, Orange (NOT Red)
  //
  // NOTE: No #05 option in Waterproof model (unlike ReSet Call Points)
  // ==========================================================================
  {
    id: "electricalArrangement",
    title: "ELECTRICAL ARRANGEMENT",
    required: true,
    options: [
      {
        id: "01",
        label: "#01 Conventional Fire Model (EN54-11 approved)",
        code: "01",
        availableFor: ["R"], // Red only (verified page 19, 22)
        dependsOn: "colour",
      },
      {
        id: "02",
        label: "#02 Single Pole Changeover",
        code: "02",
        availableFor: ["G", "Y", "B", "W", "O"], // NOT Red (verified page 20-21, 23)
        dependsOn: "colour",
      },
      {
        id: "11",
        label: "#11 Double Pole Changeover",
        code: "11",
        availableFor: ["G", "Y", "B", "W", "O"], // NOT Red (verified page 20-21)
        dependsOn: "colour",
      },
    ],
  },

  // ==========================================================================
  // STEP 3: LABEL
  // ==========================================================================
  // Dependencies from PDF 06 pages 19-24:
  // - 'House Flame' Logo: Only Red (R)
  // - 'Running Man' Logo: Only Green (G)
  // - Self-Assemble Label Kit: Yellow, Blue, White, Orange (NOT Red, NOT Green)
  // - Custom Label: ALL colours
  //
  // CRITICAL: Only #CL adds code to Product Model
  // Other labels have empty code - they don't appear in the model string
  // ==========================================================================
  {
    id: "label",
    title: "LABEL",
    required: true,
    options: [
      {
        id: "HF",
        label: "# 'House Flame' Logo",
        code: "", // No code in Product Model
        availableFor: ["R"], // Red only (verified page 20)
        dependsOn: "colour",
      },
      {
        id: "RM",
        label: "# 'Running Man' Logo",
        code: "", // No code in Product Model
        availableFor: ["G"], // Green only (verified page 21)
        dependsOn: "colour",
      },
      {
        id: "SAK",
        label: "# Self-Assemble Label Kit",
        code: "", // No code in Product Model
        availableFor: ["Y", "B", "W", "O"], // NOT Red, NOT Green (verified page 21-22)
        dependsOn: "colour",
      },
      {
        id: "CL",
        label: "#CL Custom Label",
        code: "CL", // Adds "CL" section to Product Model
        // No availableFor = available for ALL colours
      },
    ],
  },
];

// ============================================================================
// MODEL DEFINITION
// ============================================================================

export const waterproofResetCallPointModel: ModelDefinition = {
  id: "waterproof-reset-call-point",
  name: "Waterproof ReSet Call Point",
  slug: "waterproof-reset-call-point",
  
  steps,
  
  stepOrder: [
    "colour",
    "electricalArrangement",
    "label",
  ],
  
  productModelSchema: {
    baseCode: "WRP2",
    partsOrder: [
      "colour",
      "electricalArrangement",
      "label",
    ],
    separator: "dash",
    // Format: WRP2-[colour]-[electrical]-[label?]
    // Note: label code is only added if CL is selected
    separatorMap: {
      colour: "-",
      electricalArrangement: "-",
      label: "-", // Only appears if label.code is non-empty (CL)
    },
  },
  
  primaryDependencyStep: "colour",
};

// ============================================================================
// KEY DIFFERENCES FROM RESET CALL POINTS (PDF 05)
// ============================================================================
//
// 1. No MOUNTING step (3 steps vs 4 steps)
// 2. No #05 Sav-wire option in ELECTRICAL ARRANGEMENT
// 3. #01 label is "Conventional Fire Model (EN54-11 approved)" vs 
//    "Conventional Model with 470/680 Ω Resistor Value, Series 01"
// 4. Same COLOUR options (6 colours)
// 5. Same LABEL options (4 labels with same dependency pattern)
// ============================================================================