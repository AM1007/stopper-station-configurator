// ============================================================================
// STOPPER STATIONS MODEL DEFINITION
// ============================================================================
//
// Source: 01_Конфигуратор_Stopper®_Stations.pdf
// BaseCode: SS2
// Format: SS2[colour][cover][activation][text]-[language][installationOptions]
//
// Example: SS2024NT-EN, SS2021EM-EN&KIT-71101B-R
// ============================================================================

import type { ModelDefinition, Step } from "../../types";

// ============================================================================
// STEPS DEFINITION
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
      { id: "0", label: "#0 Red", code: "0" },
      { id: "1", label: "#1 Green", code: "1" },
      { id: "2", label: "#2 Yellow", code: "2" },
      { id: "3", label: "#3 White", code: "3" },
      { id: "4", label: "#4 Blue", code: "4" },
      { id: "5", label: "#5 Orange", code: "5" },
    ],
  },

  // ==========================================================================
  // STEP 2: COVER
  // ==========================================================================
  {
    id: "cover",
    title: "COVER",
    required: true,
    options: [
      { id: "0", label: "#0 No Cover", code: "0" },
      { id: "2", label: "#2 Shield", code: "2" },
      // ASSUMPTION: "Contact Sales for More Options" is not selectable
    ],
  },

  // ==========================================================================
  // STEP 3: ACTIVATION
  // ==========================================================================
  // CRITICAL: Options #6 and #7 have colour variants (red/green/blue)
  // that share the same code but different IDs for filtering.
  //
  // Availability per colour (from PDF):
  // - Red (0):    0,1,2,3,4,5, 6-red, 7-red, 8,9
  // - Green (1):  0,1,2,3,4,5, 6-green, 7-green, 8,9
  // - Yellow (2): 0,1,2,3,4,5, 6-red, 7-red, 8,9
  // - White (3):  ALL options available
  // - Blue (4):   0,1,2,3,4,5, 6-blue, 7-blue, 8,9
  // - Orange (5): 1,2,3,4,5, 6-red, 7-red, 8,9 (NO #0 Key-to-Reset!)
  // ==========================================================================
  {
    id: "activation",
    title: "ACTIVATION",
    required: true,
    options: [
      {
        id: "0",
        label: "#0 Key-to-Reset",
        code: "0",
        // CRITICAL: Not available for Orange (5)
        availableFor: ["0", "1", "2", "3", "4"],
      },
      {
        id: "1",
        label: "#1 Turn-to-Reset",
        code: "1",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      {
        id: "2",
        label: "#2 Key-to-Reset Illuminates green, red or white",
        code: "2",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      {
        id: "3",
        label: "#3 Key-to-Activate",
        code: "3",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      {
        id: "4",
        label: "#4 Momentary",
        code: "4",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      {
        id: "5",
        label: "#5 Momentary Illuminates green, red or white",
        code: "5",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      // #6 Illuminated - colour variants
      {
        id: "6-red",
        label: "#6 Red Illuminated",
        code: "6",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["0", "2", "3", "5"], // Red, Yellow, White, Orange
      },
      {
        id: "6-green",
        label: "#6 Green Illuminated",
        code: "6",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["1", "3"], // Green, White
      },
      {
        id: "6-blue",
        label: "#6 Blue Illuminated",
        code: "6",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["3", "4"], // White, Blue
      },
      // #7 Weather Resistant Illuminated - colour variants
      {
        id: "7-red",
        label: "#7 Weather Resistant Momentary Illuminated Red",
        code: "7",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["0", "2", "3", "5"], // Red, Yellow, White, Orange
      },
      {
        id: "7-green",
        label: "#7 Weather Resistant Green Illuminated",
        code: "7",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["1", "3"], // Green, White
      },
      {
        id: "7-blue",
        label: "#7 Weather Resistant Blue Illuminated",
        code: "7",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["3", "4"], // White, Blue
      },
      {
        id: "8",
        label: "#8 Pneumatic Illuminates green, red or white",
        code: "8",
        notes: "NOT UL LISTED",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      {
        id: "9",
        label: "#9 Turn-to-Reset Illuminates green, red or white",
        code: "9",
        notes: "EXTENDED LEAD TIMES",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
    ],
  },

  // ==========================================================================
  // STEP 4: TEXT
  // ==========================================================================
  {
    id: "text",
    title: "TEXT",
    required: true,
    options: [
      { id: "AB", label: "#AB ABORT", code: "AB" },
      { id: "EM", label: "#EM EMERGENCY", code: "EM" },
      { id: "EX", label: "#EX EMERGENCY EXIT", code: "EX" },
      { id: "PO", label: "#PO EMERGENCY POWER OFF", code: "PO" },
      { id: "ES", label: "#ES EMERGENCY STOP", code: "ES" },
      { id: "EV", label: "#EV EVACUATION", code: "EV" },
      { id: "XT", label: "#XT EXIT", code: "XT" },
      { id: "PS", label: "#PS FUEL PUMP SHUT-DOWN", code: "PS" },
      { id: "HV", label: "#HV HVAC SHUT-DOWN", code: "HV" },
      { id: "LD", label: "#LD LOCKDOWN", code: "LD" },
      { id: "PX", label: "#PX PUSH TO EXIT", code: "PX" },
      { id: "NT", label: "#NT NO TEXT, blank button and/or cover", code: "NT" },
      { id: "ZA", label: "#ZA NON-RETURNABLE custom text", code: "ZA" },
    ],
  },

  // ==========================================================================
  // STEP 5: LANGUAGE
  // ==========================================================================
  {
    id: "language",
    title: "LANGUAGE",
    required: true,
    options: [
      { id: "EN", label: "#EN English", code: "EN" },
      { id: "ES", label: "#ES Spanish", code: "ES" },
      { id: "FR", label: "#FR French", code: "FR" },
      { id: "ZL", label: "#ZL NON-RETURNABLE other language", code: "ZL" },
    ],
  },

  // ==========================================================================
  // STEP 6: INSTALLATION OPTIONS
  // ==========================================================================
  // CRITICAL: Mounting kits are colour-matched.
  // Each colour only sees kits of the same colour, EXCEPT White (3) sees ALL.
  //
  // Kit naming: R=Red, G=Green, Y=Yellow, W=White, B=Blue, E=Orange
  // ==========================================================================
  {
    id: "installationOptions",
    title: "INSTALLATION OPTIONS",
    required: false,
    options: [
      {
        id: "none",
        label: "# No additional mounting accessories are required",
        code: "",
        availableFor: ["0", "1", "2", "3", "4", "5"],
      },
      // Back Box for Surface Mounting (KIT-71100A-*)
      {
        id: "&KIT-71100A-R",
        label: "#&KIT-71100A-R Red Back Box for Surface Mounting",
        code: "&KIT-71100A-R",
        availableFor: ["0", "3"],
      },
      {
        id: "&KIT-71100A-G",
        label: "#&KIT-71100A-G Green Back Box for Surface Mounting",
        code: "&KIT-71100A-G",
        availableFor: ["1", "3"],
      },
      {
        id: "&KIT-71100A-Y",
        label: "#&KIT-71100A-Y Yellow Back Box for Surface Mounting",
        code: "&KIT-71100A-Y",
        availableFor: ["2", "3"],
      },
      {
        id: "&KIT-71100A-W",
        label: "#&KIT-71100A-W White Back Box for Surface Mounting",
        code: "&KIT-71100A-W",
        availableFor: ["3"],
      },
      {
        id: "&KIT-71100A-B",
        label: "#&KIT-71100A-B Blue Back Box for Surface Mounting",
        code: "&KIT-71100A-B",
        availableFor: ["3", "4"],
      },
      {
        id: "&KIT-71100A-E",
        label: "#&KIT-71100A-E Orange Back Box for Surface Mounting",
        code: "&KIT-71100A-E",
        availableFor: ["3", "5"],
      },
      // Back Box & Spacer Kit for Deep Surface Mounting (KIT-71101B-*)
      {
        id: "&KIT-71101B-R",
        label: "#&KIT-71101B-R Red Back Box & Spacer Kit for Deep Mounting",
        code: "&KIT-71101B-R",
        availableFor: ["0", "3"],
      },
      {
        id: "&KIT-71101B-G",
        label: "#&KIT-71101B-G Green Back Box & Spacer Kit for Deep Surface Mounting",
        code: "&KIT-71101B-G",
        availableFor: ["1", "3"],
      },
      {
        id: "&KIT-71101B-Y",
        label: "#&KIT-71101B-Y Yellow Back Box & Spacer Kit for Deep Surface Mounting",
        code: "&KIT-71101B-Y",
        availableFor: ["2", "3"],
      },
      {
        id: "&KIT-71101B-W",
        label: "#&KIT-71101B-W White Back Box & Spacer Kit for Deep Surface Mounting",
        code: "&KIT-71101B-W",
        availableFor: ["3"],
      },
      {
        id: "&KIT-71101B-B",
        label: "#&KIT-71101B-B Blue Back Box & Spacer Kit for Deep Surface Mounting",
        code: "&KIT-71101B-B",
        availableFor: ["3", "4"],
      },
      {
        id: "&KIT-71101B-E",
        label: "#&KIT-71101B-E Orange Back Box & Spacer Kit for Deep Surface Mounting",
        code: "&KIT-71101B-E",
        availableFor: ["3", "5"],
      },
    ],
  },
];

// ============================================================================
// MODEL DEFINITION
// ============================================================================

export const stopperStationsModel: ModelDefinition = {
  id: "stopper-stations",
  name: "Stopper® Stations",
  slug: "stopper-stations",
  
  steps,
  
  stepOrder: [
    "colour",
    "cover",
    "activation",
    "text",
    "language",
    "installationOptions",
  ],
  
  productModelSchema: {
    baseCode: "SS2",
    partsOrder: [
      "colour",
      "cover",
      "activation",
      "text",
      "language",
      "installationOptions",
    ],
    separator: "none",
    // Custom separators: dash before language, nothing before installation
    separatorMap: {
      colour: "",
      cover: "",
      activation: "",
      text: "",
      language: "-",
      installationOptions: "",
    },
  },
  
  primaryDependencyStep: "colour",
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get step by ID.
 */
export function getStepById(stepId: string): Step | undefined {
  return steps.find((step) => step.id === stepId);
}

/**
 * Get option by step and option ID.
 */
export function getOptionById(stepId: string, optionId: string) {
  const step = getStepById(stepId);
  return step?.options.find((opt) => opt.id === optionId);
}