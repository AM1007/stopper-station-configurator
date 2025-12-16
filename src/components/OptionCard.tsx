// ============================================================================
// OPTION CARD COMPONENT
// ============================================================================
//
// Displays a single selectable option within a step.
// Handles:
// - Selected state styling (highlighted border)
// - Disabled state for unavailable options (greyed out, blocked icon)
// - Optional image display
// - Notes display (e.g., "EXTENDED LEAD TIMES")
// - Tooltip with unavailability reason
//
// ============================================================================

import type { Option } from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface OptionCardProps {
  /** The option to display */
  option: Option;

  /** Whether this option is currently selected */
  isSelected: boolean;

  /** Whether this option is available for selection */
  isAvailable: boolean;

  /** Reason why option is unavailable (shown in tooltip) */
  unavailableReason?: string;

  /** Callback when option is clicked */
  onSelect: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Card component for a single option within a step.
 *
 * Visual states:
 * - Default: White border, clickable
 * - Selected: Solid white border, light background, checkmark
 * - Disabled: Grey, reduced opacity, 🚫 icon overlay, not clickable
 */
export function OptionCard({
  option,
  isSelected,
  isAvailable,
  unavailableReason,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`
        relative p-3 rounded border-2 transition-all text-left w-full
        ${
          !isAvailable
            ? "border-gray-400 bg-gray-200 opacity-50 cursor-not-allowed"
            : isSelected
              ? "border-white bg-white/20"
              : "border-white/30 hover:border-white/60 hover:bg-white/10"
        }
      `}
      onClick={isAvailable ? onSelect : undefined}
      disabled={!isAvailable}
      aria-disabled={!isAvailable}
      aria-pressed={isSelected}
      title={!isAvailable ? unavailableReason : undefined}
      role="option"
      aria-selected={isSelected}
    >
      {/* Option image */}
      {option.image && (
        <img
          src={option.image}
          alt=""
          className={`
            w-full h-20 object-contain mb-2
            ${!isAvailable ? "grayscale" : ""}
          `}
        />
      )}

      {/* Option label */}
      <p className="text-xs text-center font-medium">{option.label}</p>

      {/* Notes (e.g., "EXTENDED LEAD TIMES", "NOT UL LISTED") */}
      {option.notes && (
        <p className="text-[10px] text-yellow-300 text-center mt-1 font-medium">
          {option.notes}
        </p>
      )}

      {/* Blocked overlay for unavailable options */}
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/10">
          <span className="text-3xl opacity-60" aria-hidden="true">
            🚫
          </span>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && isAvailable && (
        <div className="absolute top-1 right-1">
          <span className="text-green-400 text-lg" aria-hidden="true">
            ✓
          </span>
        </div>
      )}
    </button>
  );
}