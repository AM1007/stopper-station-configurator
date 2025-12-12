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
// ============================================================================

import type { Step, OptionId, Configuration } from "../types";
import { OptionCard } from "./OptionCard";

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

/**
 * Accordion step component with collapsible options grid.
 *
 * Layout:
 * - Header: Step title + current selection + chevron icon
 * - Body (when open): 2-column grid of OptionCards
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

  return (
    <div className="border-b border-white/20 pb-4">
      {/* Accordion Header */}
      <button
        type="button"
        className="w-full flex justify-between items-center text-left py-2"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div>
          {/* Step title */}
          <h2 className="text-lg font-bold uppercase tracking-wide">
            {step.title}
          </h2>
          
          {/* Current selection or "NO SELECTION" */}
          {selectedOption ? (
            <p className="text-sm text-white/80 mt-0.5">
              {selectedOption.label}
            </p>
          ) : (
            <p className="text-sm text-white/50 mt-0.5">NO SELECTION</p>
          )}
        </div>

        {/* Chevron icon - rotates when open */}
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
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
        <div className="grid grid-cols-2 gap-3 mt-4">
          {step.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={option.id === selectedOptionId}
              config={config}
              onSelect={() => onSelect(option.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}