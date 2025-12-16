// ============================================================================
// STEP SELECTOR COMPONENT
// ============================================================================
//
// Accordion-style step that shows:
// - Step title (COLOUR, COVER, etc.)
// - Current selection or "NO SELECTION"
// - Expandable grid of option cards
//
// Behavior:
// - Click header to toggle open/close
// - When option selected, parent auto-advances to next step
// - Unavailable options shown as disabled with reason
//
// Responsive:
// - Mobile: 1-2 columns depending on option count
// - Desktop: 2-4 columns depending on option count
//
// ============================================================================

import type { Step, OptionId, Configuration } from "../types";
import { OptionCard } from "./OptionCard";
import { getOptionsWithAvailability } from "../filterOptions";

// ============================================================================
// TYPES
// ============================================================================

interface StepSelectorProps {
  /** Step definition with options */
  step: Step;

  /** Whether this step's accordion is currently open */
  isOpen: boolean;

  /** Currently selected option ID (or null) */
  selectedOptionId: OptionId | null;

  /** Full configuration (for option availability checks) */
  config: Configuration;

  /** Callback when an option is selected */
  onSelect: (optionId: OptionId) => void;

  /** Callback to toggle accordion open/close */
  onToggle: () => void;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Determines grid columns based on option count.
 * Returns Tailwind classes for responsive grid.
 */
function getGridClasses(optionCount: number): string {
  if (optionCount <= 2) {
    return "grid-cols-2";
  }
  if (optionCount <= 4) {
    return "grid-cols-2 md:grid-cols-4";
  }
  if (optionCount <= 6) {
    return "grid-cols-2 md:grid-cols-3";
  }
  // Many options: 2 on mobile, 4 on desktop
  return "grid-cols-2 md:grid-cols-4";
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Accordion step component with collapsible options grid.
 *
 * Layout:
 * - Header: Step title + current selection + chevron icon
 * - Body (when open): Responsive grid of OptionCards
 */
export function StepSelector({
  step,
  isOpen,
  selectedOptionId,
  config,
  onSelect,
  onToggle,
}: StepSelectorProps) {
  // Find the currently selected option for display
  const selectedOption = step.options.find((o) => o.id === selectedOptionId);

  // Get options with availability status
  const optionsWithStatus = getOptionsWithAvailability(step, config);

  // Count available options
  const availableCount = optionsWithStatus.filter(
    ({ availability }) => availability.available
  ).length;

  // Determine grid layout
  const gridClasses = getGridClasses(step.options.length);

  return (
    <div className="border-b border-white/20 pb-4">
      {/* Accordion Header */}
      <button
        type="button"
        className="w-full flex justify-between items-center text-left py-2 hover:bg-white/5 rounded transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`step-${step.id}-content`}
      >
        <div className="flex-1 min-w-0">
          {/* Step title with required indicator */}
          <h2 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
            {step.title}
            {step.required && !selectedOptionId && (
              <span className="text-xs font-normal text-red-200">*</span>
            )}
          </h2>

          {/* Current selection or "NO SELECTION" */}
          {selectedOption ? (
            <p className="text-sm text-white/80 mt-0.5 truncate">
              {selectedOption.label}
            </p>
          ) : (
            <p className="text-sm text-white/50 mt-0.5">
              NO SELECTION
              {availableCount < step.options.length && availableCount > 0 && (
                <span className="ml-2 text-white/40">
                  ({availableCount} available)
                </span>
              )}
            </p>
          )}
        </div>

        {/* Chevron icon - rotates when open */}
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Accordion Body - Options Grid */}
      {isOpen && (
        <div
          id={`step-${step.id}-content`}
          className={`grid ${gridClasses} gap-3 mt-4`}
          role="listbox"
          aria-label={`${step.title} options`}
        >
          {optionsWithStatus.map(({ option, availability }) => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={option.id === selectedOptionId}
              isAvailable={availability.available}
              unavailableReason={availability.reason}
              onSelect={() => onSelect(option.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}