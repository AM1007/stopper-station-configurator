import type { ModelConstraints, ConstraintMatrix } from "./types";

const COLOUR_TO_LABEL: ConstraintMatrix = {
  "R": ["FIRE", "CL", "PLAIN"],
  "G": ["EMERGENCY_DOOR", "CL", "PLAIN"],
  "Y": ["EMERGENCY_OPERATE", "CL", "PLAIN"],
  "W": ["EMERGENCY_OPERATE", "CL", "PLAIN"],
  "B": ["EMERGENCY_OPERATE", "CL", "PLAIN"],
  "E": ["EMERGENCY_OPERATE", "CL", "PLAIN"],
};

const LABEL_TO_COLOUR: ConstraintMatrix = {
  "FIRE": ["R"],
  "EMERGENCY_DOOR": ["G"],
  "EMERGENCY_OPERATE": ["Y", "W", "B", "E"],
  "CL": ["R", "G", "Y", "W", "B", "E"],
  "PLAIN": ["R", "G", "Y", "W", "B", "E"],
};

export const CALL_POINT_STOPPER_CONSTRAINTS: ModelConstraints = {
  modelId: "call-point-stopper",
  constraints: [
    {
      sourceStep: "colour",
      targetStep: "label",
      matrix: COLOUR_TO_LABEL,
    },
    {
      sourceStep: "label",
      targetStep: "colour",
      matrix: LABEL_TO_COLOUR,
    },
  ],
};