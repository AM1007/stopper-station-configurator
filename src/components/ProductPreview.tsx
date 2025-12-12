// ============================================================================
// PRODUCT PREVIEW COMPONENT
// ============================================================================
//
// Grid of 6 preview tiles showing current selections:
// - COLOUR
// - COVER
// - ACTIVATION
// - TEXT
// - LANGUAGE
// - INSTALLATION OPTIONS
//
// Layout: 4 columns on first row, 2 columns on second row (responsive)
// ============================================================================

import type { Configuration, StepId } from "../types";
import { STEPS } from "../data/steps";
import { PreviewTile } from "./PreviewTile";

interface ProductPreviewProps {
  /** Current configuration state */
  config: Configuration;
}

/**
 * Tile configuration for preview grid
 */
const PREVIEW_TILES: { stepId: StepId; label: string }[] = [
  { stepId: "colour", label: "COLOUR" },
  { stepId: "cover", label: "COVER" },
  { stepId: "activation", label: "ACTIVATION" },
  { stepId: "text", label: "TEXT" },
  { stepId: "language", label: "LANGUAGE" },
  { stepId: "installationOptions", label: "INSTALLATION OPTIONS" },
];

/**
 * Grid of preview tiles showing all current selections.
 *
 * Layout:
 * - First row: 4 tiles (COLOUR, COVER, ACTIVATION, TEXT)
 * - Second row: 2 tiles (LANGUAGE, INSTALLATION OPTIONS)
 */
export function ProductPreview({ config }: ProductPreviewProps) {
  return (
    <div className="mb-6">
      {/* Header tabs (Edit Selections / Product Preview) */}
      <div className="flex gap-6 mb-4">
        <button
          type="button"
          className="text-red-600 font-semibold hover:text-red-700"
        >
          Edit Selections
        </button>
        <button
          type="button"
          className="text-red-600 font-semibold hover:text-red-700 border-b-2 border-red-600"
        >
          Product Preview
        </button>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-4 gap-4">
        {PREVIEW_TILES.map((tile) => {
          // Find the step data
          const step = STEPS.find((s) => s.id === tile.stepId);
          
          // Get selected option ID from config
          const selectedOptionId = config[tile.stepId];
          
          // Find the selected option details
          const selectedOption = step?.options.find(
            (o) => o.id === selectedOptionId
          );

          return (
            <PreviewTile
              key={tile.stepId}
              label={tile.label}
              image={selectedOption?.image}
              selectedLabel={selectedOption?.label}
            />
          );
        })}
      </div>
    </div>
  );
}