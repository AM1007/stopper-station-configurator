// ============================================================================
// WATERPROOF PUSH BUTTONS MODEL DEFINITION
// ============================================================================
//
// Source: 04_Конфигуратор_StopperSwitches_Waterproof_Push_Buttons.pdf (VERIFIED)
// BaseCode: WSS3
// Format: WSS3-[housing][buttonColour][buttonType][electrical][-CL]
//
// Example: WSS3-1R04 (Red housing, Red button, Latching, Multi-Functional)
// Example: WSS3-1R04-CL (with Custom Label)
//
// Steps:
// 1. HOUSING COLOUR & MOUNTING
// 2. BUTTON COLOUR
// 3. BUTTON TYPE
// 4. ELECTRICAL ARRANGEMENTS
// 5. LABEL
//
// KEY DIFFERENCES FROM INDOOR PUSH BUTTONS (PDF 02):
// - BaseCode: WSS3 vs SS3-
// - BUTTON TYPE: 2 options (#0, #1) vs 3 options (#0, #1, #6)
// - ELECTRICAL: Only 1 option (#4) vs 2 options (#0, #4)
// - HOUSING COLOUR dependencies differ slightly
//
// CRITICAL: This model has ONE-WAY dependencies from HOUSING COLOUR to BUTTON COLOUR.
// ============================================================================

import type { ModelDefinition, Step } from "../../types";

// ============================================================================
// COMPATIBILITY MATRIX (from PDF pages with dependencies)
// ============================================================================

// HOUSING COLOUR → BUTTON COLOUR availability
const HOUSING_TO_BUTTON: Record<string, string[]> = {
  "1": ["R", "W"],           // Red housing → Red, White buttons
  "3": ["G", "W"],           // Green housing → Green, White buttons (differs from Indoor!)
  "5": ["R", "G", "Y"],      // Yellow housing → Red, Green, Yellow buttons
  "7": ["R", "G", "W", "B"], // White housing → Red, Green, White, Blue buttons
  "9": ["B"],                // Blue housing → Blue button only (differs from Indoor!)
  "E": ["E"],                // Orange housing → Orange button only (differs from Indoor!)
};

// ============================================================================
// STEPS DEFINITION (VERIFIED FROM PDF 04)
// ============================================================================

const steps: Step[] = [
  // ==========================================================================
  // STEP 1: HOUSING COLOUR & MOUNTING
  // ==========================================================================
  // Note: All options are "Surface Mount" (not "Dual Mount" like Indoor)
  // ==========================================================================
  {
    id: "housingColour",
    title: "HOUSING COLOUR & MOUNTING",
    required: true,
    options: [
      { id: "1", label: "#1 Red (Surface Mount)", code: "1" },
      { id: "3", label: "#3 Green (Surface Mount)", code: "3" },
      { id: "5", label: "#5 Yellow (Surface Mount)", code: "5" },
      { id: "7", label: "#7 White (Surface Mount)", code: "7" },
      { id: "9", label: "#9 Blue (Surface Mount)", code: "9" },
      { id: "E", label: "#E Orange (Surface Mount)", code: "E" },
    ],
  },

  // ==========================================================================
  // STEP 2: BUTTON COLOUR
  // ==========================================================================
  // Dependencies from HOUSING COLOUR step.
  // Note: Dependencies differ from Indoor Push Buttons!
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
        availableFor: ["1", "5", "7"], // Red, Yellow, White housing
        dependsOn: "housingColour",
      },
      {
        id: "G",
        label: "#G Green Button",
        code: "G",
        availableFor: ["3", "5", "7"], // Green, Yellow, White housing
        dependsOn: "housingColour",
      },
      {
        id: "Y",
        label: "#Y Yellow Button",
        code: "Y",
        availableFor: ["5"], // Yellow housing only
        dependsOn: "housingColour",
      },
      {
        id: "W",
        label: "#W White Button",
        code: "W",
        availableFor: ["1", "3", "7"], // Red, Green, White housing
        dependsOn: "housingColour",
      },
      {
        id: "B",
        label: "#B Blue Button",
        code: "B",
        availableFor: ["7", "9"], // White, Blue housing
        dependsOn: "housingColour",
      },
      {
        id: "E",
        label: "#E Orange Button",
        code: "E",
        availableFor: ["E"], // Orange housing only
        dependsOn: "housingColour",
      },
    ],
  },

  // ==========================================================================
  // STEP 3: BUTTON TYPE
  // ==========================================================================
  // Only 2 options (Indoor has 3 with #6 Pneumatic)
  // No dependencies - all options always available
  // ==========================================================================
  {
    id: "buttonType",
    title: "BUTTON TYPE",
    required: true,
    options: [
      { id: "0", label: "#0 Latching (Key-to-Reset)", code: "0" },
      { id: "1", label: "#1 Momentary", code: "1" },
    ],
  },

  // ==========================================================================
  // STEP 4: ELECTRICAL ARRANGEMENTS
  // ==========================================================================
  // Only 1 option! (Indoor has 2: #0 and #4)
  // No dependencies - always available
  // ==========================================================================
  {
    id: "electricalArrangements",
    title: "ELECTRICAL ARRANGEMENTS",
    required: true,
    options: [
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

export const waterproofPushButtonsModel: ModelDefinition = {
  id: "waterproof-push-buttons",
  name: "StopperSwitches Waterproof Push Buttons",
  slug: "waterproof-push-buttons",
  
  steps,
  
  stepOrder: [
    "housingColour",
    "buttonColour",
    "buttonType",
    "electricalArrangements",
    "label",
  ],
  
  productModelSchema: {
    baseCode: "WSS3",
    partsOrder: [
      "housingColour",
      "buttonColour",
      "buttonType",
      "electricalArrangements",
      "label",
    ],
    separator: "none", // Parts are concatenated without separator
    // Format: WSS3-[housing][button][type][electrical][-CL]
    // Note: There's a dash between WSS3 and the codes
    separatorMap: {
      housingColour: "-", // Dash after WSS3
      buttonColour: "",
      buttonType: "",
      electricalArrangements: "",
      label: "-", // Dash before CL if present
    },
  },
  
  primaryDependencyStep: "housingColour",
};

// ============================================================================
// KEY DIFFERENCES FROM INDOOR PUSH BUTTONS
// ============================================================================
//
// | Element | Indoor (PDF 02) | Waterproof (PDF 04) |
// |---------|-----------------|---------------------|
// | BaseCode | SS3- | WSS3 |
// | Mounting | Dual Mount | Surface Mount |
// | BUTTON TYPE | 3 (#0, #1, #6) | 2 (#0, #1) |
// | ELECTRICAL | 2 (#0, #4) | 1 (#4 only) |
// | #3 Green housing | All buttons | G, W only |
// | #9 Blue housing | W, B | B only |
// | #E Orange housing | W, E | E only |
//
// ============================================================================

// Export compatibility matrix for rule engine
export const waterproofPushButtonsCompatibility = {
  housingToButton: HOUSING_TO_BUTTON,
};