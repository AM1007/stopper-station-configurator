// ============================================================================
// PREVIEW TILE COMPONENT
// ============================================================================
//
// Single tile in the Product Preview grid.
// Shows either:
// - Image of selected option (if available)
// - Step label placeholder (if nothing selected)
// ============================================================================

interface PreviewTileProps {
  /** Step label to show when no selection (e.g., "COLOUR", "ACTIVATION") */
  label: string;
  
  /** Image URL of selected option (optional) */
  image?: string;
  
  /** Text to display when option is selected but has no image */
  selectedLabel?: string;
}

/**
 * Single preview tile showing selected option or placeholder.
 *
 * States:
 * - No selection: Shows step label in grey
 * - Selected with image: Shows image
 * - Selected without image: Shows selected option label
 */
export function PreviewTile({ label, image, selectedLabel }: PreviewTileProps) {
  const hasSelection = image || selectedLabel;

  return (
    <div
      className={`
        border-2 rounded bg-gray-50 p-3 
        h-32 flex flex-col items-center justify-center
        ${hasSelection ? "border-gray-300" : "border-gray-200"}
      `}
    >
      {image ? (
        // Show image if available
        <>
          <img
            src={image}
            alt={label}
            className="h-16 w-full object-contain mb-2"
          />
          <p className="text-xs text-gray-600 text-center font-medium truncate w-full">
            {label}
          </p>
        </>
      ) : selectedLabel ? (
        // Show selected label if no image
        <p className="text-sm text-gray-700 text-center font-medium px-2">
          {selectedLabel}
        </p>
      ) : (
        // Show placeholder
        <p className="text-sm text-gray-400 text-center font-semibold">
          {label}
        </p>
      )}
    </div>
  );
}