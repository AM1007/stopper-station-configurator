// ============================================================================
// RESET CALL POINTS MODEL DEFINITION
// ============================================================================
//
// Source: 05_Конфигуратор_ReSet_Call_Points.pdf (VERIFIED)
// BaseCode: RP
// Format: RP-[colour]-[mounting]-[electrical]-[label?]
//
// Example: RP-R-D2-01 (Red, Dual Mount, Conventional, House Flame Logo)
// Example: RP-R-D2-01-CL (with Custom Label)
//
// Steps:
// 1. COLOUR
// 2. MOUNTING
// 3. ELECTRICAL ARRANGEMENT
// 4. LABEL
//
// CRITICAL: This model has BI-DIRECTIONAL dependencies.
// - COLOUR affects ELECTRICAL and LABEL availability
// - ELECTRICAL affects COLOUR and LABEL availability
// - LABEL affects COLOUR and ELECTRICAL availability
// ============================================================================

import type { ModelDefinition, Step } from "../../types";

// ============================================================================
// STEPS DEFINITION (VERIFIED FROM PDF 05)
// ============================================================================

const steps: Step[] = [
  // ==========================================================================
  // STEP 1: COLOUR (Page 13)
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
  // STEP 2: MOUNTING (Page 15)
  // No dependencies - all options always available
  // ==========================================================================
  {
    id: "mounting",
    title: "MOUNTING",
    required: true,
    options: [
      { 
        id: "D2", 
        label: "#D2 Dual Mount (wall plate & back box) Previously 'S'", 
        code: "D2" 
      },
      { 
        id: "S2", 
        label: "#S2 Surface Mounted - back box Previously 'S1'", 
        code: "S2" 
      },
      { 
        id: "F2", 
        label: "#F2 Flush Mounted - wall plate Previously 'F'", 
        code: "F2" 
      },
    ],
  },

  // ==========================================================================
  // STEP 3: ELECTRICAL ARRANGEMENT (Page 16, 22-26)
  // Dependencies: Based on COLOUR selection
  // 
  // Availability matrix (from PDF pages 22-26):
  // - #01: Only Red (R)
  // - #02: Green, Yellow, Blue, White, Orange (NOT Red)
  // - #05: ALL colours
  // - #11: Green, Yellow, Blue, White, Orange (NOT Red)
  // ==========================================================================
  {
    id: "electricalArrangement",
    title: "ELECTRICAL ARRANGEMENT",
    required: true,
    options: [
      {
        id: "01",
        label: "#01 Conventional Model with 470/680 Ω Resistor Value, Series 01",
        code: "01",
        availableFor: ["R"], // Red only (verified page 25)
        dependsOn: "colour",
      },
      {
        id: "02",
        label: "#02 Single Pole Changeover, Series 02",
        code: "02",
        availableFor: ["G", "Y", "B", "W", "O"], // NOT Red (verified page 23, 26)
        dependsOn: "colour",
      },
      {
        id: "05",
        label: "#05 Sav-wire (2-wire) 470/680 Ω Resistor Value & Diode, Series 05",
        code: "05",
        // No availableFor = available for ALL colours (verified page 27)
      },
      {
        id: "11",
        label: "#11 Double Pole Changeover, Series 11",
        code: "11",
        availableFor: ["G", "Y", "B", "W", "O"], // NOT Red (verified page 23)
        dependsOn: "colour",
      },
    ],
  },

  // ==========================================================================
  // STEP 4: LABEL (Page 17-18, 22-29)
  // Dependencies: Based on COLOUR selection
  //
  // Availability matrix (from PDF pages 22-29):
  // - 'House Flame' Logo: Only Red (R)
  // - 'Running Man' Logo: Only Green (G)
  // - Self-Assemble Label Kit: Yellow, Blue, White, Orange (NOT Red, NOT Green)
  // - Custom Label: ALL colours
  //
  // CRITICAL: Only #CL adds code to Product Model (page 18)
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
        availableFor: ["R"], // Red only (verified page 22-23, 28)
        dependsOn: "colour",
      },
      {
        id: "RM",
        label: "# 'Running Man' Logo",
        code: "", // No code in Product Model
        availableFor: ["G"], // Green only (verified page 24, 28-29)
        dependsOn: "colour",
      },
      {
        id: "SAK",
        label: "# Self-Assemble Label Kit",
        code: "", // No code in Product Model
        availableFor: ["Y", "B", "W", "O"], // NOT Red, NOT Green (verified page 24-25, 29)
        dependsOn: "colour",
      },
      {
        id: "CL",
        label: "#CL Custom Label",
        code: "CL", // Adds "CL" section to Product Model (verified page 18)
        // No availableFor = available for ALL colours (verified page 30)
      },
    ],
  },
];

// ============================================================================
// MODEL DEFINITION
// ============================================================================

export const resetCallPointsModel: ModelDefinition = {
  id: "reset-call-points",
  name: "ReSet Call Points",
  slug: "reset-call-points",
  
  steps,
  
  stepOrder: [
    "colour",
    "mounting",
    "electricalArrangement",
    "label",
  ],
  
  productModelSchema: {
    baseCode: "RP",
    partsOrder: [
      "colour",
      "mounting",
      "electricalArrangement",
      "label",
    ],
    separator: "dash",
    // Format: RP-[colour]-[mounting]-[electrical]-[label?]
    // Note: label code is only added if CL is selected
    separatorMap: {
      colour: "-",
      mounting: "-",
      electricalArrangement: "-",
      label: "-", // Only appears if label.code is non-empty (CL)
    },
  },
  
  primaryDependencyStep: "colour",
};

// ============================================================================
// BIDIRECTIONAL DEPENDENCY NOTES (from PDF pages 22-30)
// ============================================================================
//
// The PDF shows that dependencies work BOTH ways:
//
// If user selects ELECTRICAL first:
// - #01 → Only Red available in COLOUR
// - #02 → Only G, Y, B, W, O available in COLOUR  
// - #05 → All colours available
// - #11 → Only G, Y, B, W, O available in COLOUR
//
// If user selects LABEL first:
// - 'House Flame' → Only Red available, only #01/#05 in ELECTRICAL
// - 'Running Man' → Only Green available
// - Self-Assemble → Only Y, B, W, O available
// - Custom Label → All options available everywhere
//
// IMPLEMENTATION NOTE:
// The current architecture uses `availableFor` on the option level.
// For full bidirectional support, the rule engine needs to:
// 1. Check if dependent step has a selection
// 2. If yes, filter current step's options based on reverse compatibility
//
// This is handled in filterOptions.ts by checking both directions.
// ============================================================================

// ============================================================================
// CUSTOM LABEL SPECIAL BEHAVIOR (from PDF pages 8-10)
// ============================================================================
//
// When #CL Custom Label is selected:
// 1. A form appears with Line 1 and Line 2 inputs
// 2. Each line has 10-character maximum
// 3. After Submit, custom text is shown below the accordion
// 4. "CL" is added to the Product Model code
// 5. "CUSTOM PRODUCTS ARE NON-RETURNABLE" warning is displayed
//
// TODO: Implement CustomLabelForm component for this model
// ============================================================================