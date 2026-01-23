import type { ModelConstraints, ConstraintMatrix } from "./types";

const MATERIAL_TO_SIZE: ConstraintMatrix = {
  "T": ["121006", "141007", "181408"],
  "S": ["121005", "161608", "231609", "312312"],
};

const MATERIAL_TO_DOOR_TYPE: ConstraintMatrix = {
  "T": ["C", "O"],
  "S": ["O"],
};

const SIZE_TO_MATERIAL: ConstraintMatrix = {
  "121005": ["S"],
  "121006": ["T"],
  "141007": ["T"],
  "161608": ["S"],
  "181408": ["T"],
  "231609": ["S"],
  "312312": ["S"],
};

const SIZE_TO_DOOR_TYPE: ConstraintMatrix = {
  "121005": ["C", "O"],
  "121006": ["C", "O"],
  "141007": ["C", "O"],
  "161608": ["C", "O"],
  "181408": ["O"],
  "231609": ["C", "O"],
  "312312": ["C", "O"],
};

const DOOR_TYPE_TO_MATERIAL: ConstraintMatrix = {
  "C": ["T"],
  "O": ["T", "S"],
};

const DOOR_TYPE_TO_SIZE: ConstraintMatrix = {
  "C": ["121005", "121006", "141007", "161608", "231609", "312312"],
  "O": ["121005", "121006", "141007", "161608", "181408", "231609", "312312"],
};

export const ENVIRO_ARMOUR_CONSTRAINTS: ModelConstraints = {
  modelId: "enviro-armour",
  constraints: [
    {
      sourceStep: "material",
      targetStep: "size",
      matrix: MATERIAL_TO_SIZE,
    },
    {
      sourceStep: "material",
      targetStep: "doorType",
      matrix: MATERIAL_TO_DOOR_TYPE,
    },
    {
      sourceStep: "size",
      targetStep: "material",
      matrix: SIZE_TO_MATERIAL,
    },
    {
      sourceStep: "size",
      targetStep: "doorType",
      matrix: SIZE_TO_DOOR_TYPE,
    },
    {
      sourceStep: "doorType",
      targetStep: "material",
      matrix: DOOR_TYPE_TO_MATERIAL,
    },
    {
      sourceStep: "doorType",
      targetStep: "size",
      matrix: DOOR_TYPE_TO_SIZE,
    },
  ],
};