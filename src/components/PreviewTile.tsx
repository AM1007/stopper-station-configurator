// ============================================================================
// PREVIEW TILE COMPONENT
// ============================================================================
//
// Single tile in the Product Preview grid.
// Shows either:
// - Image of selected option (if available)
// - Selected label (if option selected but no image)
// - Step label placeholder (if nothing selected)
//
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

interface PreviewTileProps {
  /** Step label to show as header (e.g., "COLOUR", "ACTIVATION") */
  label: string;

  /** Image URL of selected option (optional) */
  image?: string;

  /** Text to display when option is selected */
  selectedLabel?: string;

  /** Whether an option is selected for this step */
  isSelected?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Single preview tile showing selected option or placeholder.
 *
 * States:
 * - No selection: Shows step label in grey, dashed border
 * - Selected with image: Shows image + label
 * - Selected without image: Shows selected option label
 */
export function PreviewTile({
  label,
  image,
  selectedLabel,
  isSelected = false,
}: PreviewTileProps) {
  return (
    <div
      className={`
        rounded-lg bg-white p-3
        h-28 md:h-32 flex flex-col items-center justify-center
        transition-all
        ${
          isSelected
            ? "border-2 border-gray-300 shadow-sm"
            : "border-2 border-dashed border-gray-200"
        }
      `}
    >
      {/* Step label header */}
      <p
        className={`
          text-[10px] uppercase tracking-wide mb-1 text-center w-full truncate
          ${isSelected ? "text-gray-500" : "text-gray-400"}
        `}
      >
        {label}
      </p>

      {/* Content area */}
      <div className="flex-1 flex items-center justify-center w-full">
        {image ? (
          // Show image if available
          <img
            src={image}
            alt={selectedLabel ?? label}
            className="max-h-14 md:max-h-16 w-full object-contain"
          />
        ) : selectedLabel ? (
          // Show selected label if no image
          <p className="text-xs text-gray-700 text-center font-medium px-1 line-clamp-2">
            {selectedLabel}
          </p>
        ) : (
          // Show placeholder
          <div className="flex items-center justify-center">
            <span className="text-gray-300 text-2xl">—</span>
          </div>
        )}
      </div>

      {/* Selection indicator dot */}
      {isSelected && (
        <div className="mt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
      )}
    </div>
  );
}