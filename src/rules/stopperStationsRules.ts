import type { ModelConstraints, ConstraintMatrix } from "./types";

const COLOUR_TO_ACTIVATION: ConstraintMatrix = {
  "0": ["0", "1", "2", "3", "4", "5", "6-red", "7-red", "8", "9"],
  "1": ["0", "1", "2", "3", "4", "5", "6-green", "7-green", "8", "9"],
  "2": ["0", "1", "2", "3", "4", "5", "7-red", "8", "9"],
  "3": ["0", "1", "2", "3", "4", "5", "7-red", "8", "9"],
  "4": ["0", "1", "2", "3", "4", "5", "6-blue", "8", "9"],
  "5": ["1", "2", "3", "9"],
};

const ACTIVATION_TO_COLOUR: ConstraintMatrix = {
  "0": ["0", "1", "2", "3", "4"],
  "1": ["0", "1", "2", "3", "4", "5"],
  "2": ["0", "1", "2", "3", "4", "5"],
  "3": ["0", "1", "2", "3", "4", "5"],
  "4": ["0", "1", "2", "3", "4"],
  "5": ["0", "1", "2", "3", "4"],
  "6-red": ["0"],
  "6-green": ["1"],
  "6-blue": ["4"],
  "7-red": ["0", "2", "3"],
  "7-green": ["1"],
  "8": ["0", "1", "2", "3", "4"],
  "9": ["0", "1", "2", "3", "4", "5"],
};

const COLOUR_TO_TEXT: ConstraintMatrix = {
  "0": ["AB", "EM", "ES", "EV", "EX", "HV", "LD", "NT", "PO", "PS", "PX", "ZA"],
  "1": ["AB", "EM", "ES", "EV", "EX", "HV", "LD", "NT", "PX", "XT", "ZA"],
  "2": ["AB", "EM", "ES", "EV", "EX", "HV", "LD", "NT", "PO", "PS", "PX", "ZA"],
  "3": ["AB", "EM", "ES", "EX", "HV", "LD", "NT", "PO", "PX", "ZA"],
  "4": ["EM", "ES", "EX", "LD", "NT", "PX", "ZA"],
  "5": ["EM", "LD", "PO", "ZA"],
};

const TEXT_TO_COLOUR: ConstraintMatrix = {
  "AB": ["0", "1", "2", "3"],
  "EM": ["0", "1", "2", "3", "4", "5"],
  "ES": ["0", "1", "2", "3", "4"],
  "EV": ["0", "1", "2"],
  "EX": ["0", "1", "2", "3", "4"],
  "HV": ["0", "1", "2", "3"],
  "LD": ["0", "1", "2", "3", "4", "5"],
  "NT": ["0", "1", "2", "3", "4"],
  "PO": ["0", "2", "3", "5"],
  "PS": ["0", "2"],
  "PX": ["0", "1", "2", "3", "4"],
  "XT": ["1"],
  "ZA": ["0", "1", "2", "3", "4", "5"],
};

const COLOUR_TO_LANGUAGE: ConstraintMatrix = {
  "0": ["EN", "ES", "ZL"],
  "1": ["EN", "ES", "ZL"],
  "2": ["EN", "ES"],
  "3": ["EN", "ES"],
  "4": ["EN"],
  "5": ["EN"],
};

const LANGUAGE_TO_COLOUR: ConstraintMatrix = {
  "EN": ["0", "1", "2", "3", "4", "5"],
  "ES": ["0", "1", "2", "3"],
  "ZL": ["0", "1"],
};

const ACTIVATION_TO_TEXT: ConstraintMatrix = {
  "0": ["EM", "ES", "EX", "LD", "NT", "PO", "ZA"],
  "1": ["AB", "EM", "ES", "EV", "EX", "HV", "LD", "NT", "PO", "PS", "PX", "ZA"],
  "2": ["AB", "EM", "ES", "EV", "EX", "HV", "LD", "NT", "PO", "PX", "XT", "ZA"],
  "3": ["AB", "EM", "LD", "NT", "PO", "ZA"],
  "4": ["AB", "EM", "ES", "EV", "EX", "LD", "NT", "PO", "PS", "PX", "XT", "ZA"],
  "5": ["EM", "ES", "EX", "LD", "NT", "PO", "PX", "ZA"],
  "6-red": ["EM", "NT"],
  "6-green": ["EX", "NT", "PX", "XT", "ZA"],
  "6-blue": ["EM", "LD"],
  "7-red": ["AB", "PO", "ZA"],
  "7-green": ["XT", "ZA"],
  "8": ["EM", "EX", "NT", "PX", "XT", "ZA"],
  "9": ["AB", "EM", "ES", "EV", "EX", "LD", "NT", "PO", "PS", "PX", "ZA"],
};

const TEXT_TO_ACTIVATION: ConstraintMatrix = {
  "AB": ["1", "2", "3", "4", "7-red", "9"],
  "EM": ["0", "1", "2", "3", "4", "5", "6-blue", "6-red", "8", "9"],
  "ES": ["0", "1", "2", "4", "5", "9"],
  "EV": ["1", "2", "4", "9"],
  "EX": ["0", "1", "2", "4", "5", "6-green", "8", "9"],
  "HV": ["1", "2"],
  "LD": ["0", "1", "2", "3", "4", "5", "6-blue", "9"],
  "NT": ["0", "1", "2", "3", "4", "5", "6-green", "6-red", "8", "9"],
  "PO": ["0", "1", "2", "3", "4", "5", "7-red", "9"],
  "PS": ["1", "4", "9"],
  "PX": ["1", "2", "4", "5", "6-green", "8", "9"],
  "XT": ["2", "4", "6-green", "7-green", "8"],
  "ZA": ["0", "1", "2", "3", "4", "5", "6-green", "7-green", "7-red", "8", "9"],
};

const ACTIVATION_TO_LANGUAGE: ConstraintMatrix = {
  "0": ["EN", "ES"],
  "1": ["EN", "ZL"],
  "2": ["EN", "ES"],
  "3": ["EN", "ES"],
  "4": ["EN"],
  "5": ["EN"],
  "6-red": ["EN"],
  "6-green": ["EN"],
  "6-blue": ["EN"],
  "7-red": ["EN"],
  "7-green": ["EN", "ZL"],
  "8": ["EN", "ES"],
  "9": ["EN"],
};

const LANGUAGE_TO_ACTIVATION: ConstraintMatrix = {
  "EN": ["0", "1", "2", "3", "4", "5", "6-blue", "6-green", "6-red", "7-green", "7-red", "8", "9"],
  "ES": ["0", "2", "3", "8"],
  "ZL": ["1", "7-green"],
};

const TEXT_TO_LANGUAGE: ConstraintMatrix = {
  "AB": ["EN"],
  "EM": ["EN"],
  "ES": ["EN"],
  "EV": ["EN"],
  "EX": ["EN"],
  "HV": ["EN"],
  "LD": ["EN"],
  "NT": ["EN"],
  "PO": ["EN"],
  "PS": ["EN"],
  "PX": ["EN"],
  "XT": ["EN"],
  "ZA": ["EN", "ZL"],
};

const LANGUAGE_TO_TEXT: ConstraintMatrix = {
  "EN": ["AB", "EM", "ES", "EV", "EX", "HV", "LD", "NT", "PO", "PS", "PX", "XT", "ZA"],
  "ES": ["NT"],
  "ZL": ["ZA"],
};

const COLOUR_TO_INSTALLATION: ConstraintMatrix = {
  "0": ["none", "&KIT-71100A-R", "&KIT-71101B-R"],
  "1": ["none", "&KIT-71100A-G", "&KIT-71101B-G"],
  "2": ["none", "&KIT-71100A-Y", "&KIT-71101B-Y"],
  "3": ["none", "&KIT-71100A-W", "&KIT-71101B-W"],
  "4": ["none", "&KIT-71100A-B", "&KIT-71101B-B"],
  "5": ["none", "&KIT-71100A-E", "&KIT-71101B-E"],
};

const ACTIVATION_TO_INSTALLATION: ConstraintMatrix = {
  "0": [
    "&KIT-71101B-R", "&KIT-71101B-G", "&KIT-71101B-Y",
    "&KIT-71101B-W", "&KIT-71101B-B", "&KIT-71101B-E",
  ],
  "1": [
    "&KIT-71101B-R", "&KIT-71101B-E",
    "&KIT-71101B-G", "&KIT-71101B-Y",
    "&KIT-71101B-W", "&KIT-71101B-B",
  ],
  "2": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
  ],
  "3": [
    "&KIT-71101B-R", "&KIT-71101B-G", "&KIT-71101B-Y",
    "&KIT-71101B-W", "&KIT-71101B-B", "&KIT-71101B-E",
  ],
  "4": [
    "&KIT-71101B-R", "&KIT-71101B-G", "&KIT-71101B-Y",
    "&KIT-71101B-W", "&KIT-71101B-B", "&KIT-71101B-E",
  ],
  "5": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
  ],
  "6-red": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
    "&KIT-71101B-G", "&KIT-71101B-B",
  ],
  "6-green": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
    "&KIT-71101B-R", "&KIT-71101B-Y", "&KIT-71101B-W",
    "&KIT-71101B-B", "&KIT-71101B-E",
  ],
  "6-blue": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
    "&KIT-71101B-R", "&KIT-71101B-G", "&KIT-71101B-Y",
    "&KIT-71101B-W", "&KIT-71101B-E",
  ],
  "7-red": [
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
    "&KIT-71101B-G", "&KIT-71101B-B",
  ],
  "7-green": [
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
    "&KIT-71101B-R", "&KIT-71101B-Y", "&KIT-71101B-W",
    "&KIT-71101B-B", "&KIT-71101B-E",
  ],
  "8": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
  ],
  "9": [
    "none",
    "&KIT-71100A-R", "&KIT-71100A-G", "&KIT-71100A-Y",
    "&KIT-71100A-W", "&KIT-71100A-B", "&KIT-71100A-E",
  ],
};

const INSTALLATION_TO_ACTIVATION: ConstraintMatrix = {
  "none": ["2", "5", "6-red", "6-green", "6-blue", "8", "9"],
  "&KIT-71100A-R": ["2", "5", "6-red", "6-green", "6-blue", "7-red", "7-green", "8", "9"],
  "&KIT-71100A-G": ["2", "5", "6-red", "6-green", "6-blue", "7-red", "7-green", "8", "9"],
  "&KIT-71100A-Y": ["2", "5", "6-red", "6-green", "6-blue", "7-red", "7-green", "8", "9"],
  "&KIT-71100A-W": ["2", "5", "6-red", "6-green", "6-blue", "7-red", "7-green", "8", "9"],
  "&KIT-71100A-B": ["2", "5", "6-red", "6-green", "6-blue", "7-red", "7-green", "8", "9"],
  "&KIT-71100A-E": ["2", "5", "6-red", "6-green", "6-blue", "7-red", "7-green", "8", "9"],
  "&KIT-71101B-R": ["0", "1", "3", "4", "6-green", "6-blue", "7-green"],
  "&KIT-71101B-G": ["0", "1", "3", "4", "6-red", "6-blue", "7-red"],
  "&KIT-71101B-Y": ["0", "1", "3", "4", "6-green", "6-blue", "7-green"],
  "&KIT-71101B-W": ["0", "1", "3", "4", "6-green", "6-blue", "7-green"],
  "&KIT-71101B-B": ["0", "1", "3", "4", "6-red", "6-green", "7-red", "7-green"],
  "&KIT-71101B-E": ["0", "1", "3", "4", "6-green", "6-blue", "7-green"],
};

const INSTALLATION_TO_COLOUR: ConstraintMatrix = {
  "none": ["0", "1", "2", "3", "4", "5"],
  "&KIT-71100A-R": ["0"],
  "&KIT-71101B-R": ["0"],
  "&KIT-71100A-G": ["1"],
  "&KIT-71101B-G": ["1"],
  "&KIT-71100A-Y": ["2"],
  "&KIT-71101B-Y": ["2"],
  "&KIT-71100A-W": ["3"],
  "&KIT-71101B-W": ["3"],
  "&KIT-71100A-B": ["4"],
  "&KIT-71101B-B": ["4"],
  "&KIT-71100A-E": ["5"],
  "&KIT-71101B-E": ["5"],
};

export const STOPPER_STATIONS_CONSTRAINTS: ModelConstraints = {
  modelId: "stopper-stations",
  constraints: [
    { sourceStep: "colour", targetStep: "activation", matrix: COLOUR_TO_ACTIVATION },
    { sourceStep: "activation", targetStep: "colour", matrix: ACTIVATION_TO_COLOUR },
    
    { sourceStep: "colour", targetStep: "text", matrix: COLOUR_TO_TEXT },
    { sourceStep: "text", targetStep: "colour", matrix: TEXT_TO_COLOUR },
    
    { sourceStep: "colour", targetStep: "language", matrix: COLOUR_TO_LANGUAGE },
    { sourceStep: "language", targetStep: "colour", matrix: LANGUAGE_TO_COLOUR },
    
    { sourceStep: "activation", targetStep: "text", matrix: ACTIVATION_TO_TEXT },
    { sourceStep: "text", targetStep: "activation", matrix: TEXT_TO_ACTIVATION },
    
    { sourceStep: "activation", targetStep: "language", matrix: ACTIVATION_TO_LANGUAGE },
    { sourceStep: "language", targetStep: "activation", matrix: LANGUAGE_TO_ACTIVATION },
    
    { sourceStep: "text", targetStep: "language", matrix: TEXT_TO_LANGUAGE },
    { sourceStep: "language", targetStep: "text", matrix: LANGUAGE_TO_TEXT },
    
    { sourceStep: "colour", targetStep: "installationOptions", matrix: COLOUR_TO_INSTALLATION },
    { sourceStep: "activation", targetStep: "installationOptions", matrix: ACTIVATION_TO_INSTALLATION },
    { sourceStep: "installationOptions", targetStep: "colour", matrix: INSTALLATION_TO_COLOUR },
    { sourceStep: "installationOptions", targetStep: "activation", matrix: INSTALLATION_TO_ACTIVATION },
  ],
};

export const DEBUG_MATRICES = {
  COLOUR_TO_ACTIVATION,
  ACTIVATION_TO_COLOUR,
  COLOUR_TO_TEXT,
  TEXT_TO_COLOUR,
  COLOUR_TO_LANGUAGE,
  LANGUAGE_TO_COLOUR,
  ACTIVATION_TO_TEXT,
  TEXT_TO_ACTIVATION,
  ACTIVATION_TO_LANGUAGE,
  LANGUAGE_TO_ACTIVATION,
  TEXT_TO_LANGUAGE,
  LANGUAGE_TO_TEXT,
  COLOUR_TO_INSTALLATION,
  ACTIVATION_TO_INSTALLATION,
  INSTALLATION_TO_ACTIVATION,
  INSTALLATION_TO_COLOUR,
};

