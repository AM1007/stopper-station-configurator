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
// ============================================================================

import type { Option, Configuration } from "../types";
import { isOptionAvailable } from "../utils/filterOptions";

interface OptionCardProps {
  /** The option to display */
  option: Option;
  
  /** Whether this option is currently selected */
  isSelected: boolean;
  
  /** Current configuration (for availability check) */
  config: Configuration;
  
  /** Callback when option is clicked */
  onSelect: () => void;
}

/**
 * Card component for a single option within a step.
 *
 * Visual states:
 * - Default: White border, clickable
 * - Selected: Solid white border, light background
 * - Disabled: Grey, reduced opacity, 🚫 icon overlay, not clickable
 */
export function OptionCard({
  option,
  isSelected,
  config,
  onSelect,
}: OptionCardProps) {
  const available = isOptionAvailable(option, config);

  return (
    <button
      type="button"
      className={`
        relative p-3 rounded border-2 transition-all text-left w-full
        ${
          !available
            ? "border-gray-400 bg-gray-200 opacity-50 cursor-not-allowed"
            : isSelected
            ? "border-white bg-white/20"
            : "border-white/30 hover:border-white/60 hover:bg-white/10"
        }
      `}
      onClick={available ? onSelect : undefined}
      disabled={!available}
      aria-disabled={!available}
      aria-pressed={isSelected}
    >
      {/* Option image */}
      {option.image && (
        <img
          src={option.image}
          alt={option.label}
          className={`
            w-full h-20 object-contain mb-2
            ${!available ? "grayscale" : ""}
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
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center rounded">
          <span className="text-3xl opacity-60">🚫</span>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && available && (
        <div className="absolute top-1 right-1">
          <span className="text-green-400 text-lg">✓</span>
        </div>
      )}
    </button>
  );
}