// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================
//
// Left panel of the calculator containing:
// - "Build it" logo/header
// - All 6 step accordions (COLOUR, COVER, ACTIVATION, TEXT, LANGUAGE, INSTALLATION)
//
// Styling:
// - Red background (brand color)
// - White text
// - Fixed width, scrollable content
// ============================================================================

import type { Configuration, StepId, OptionId } from "../types";
import { STEPS } from "../data/steps";
import { StepSelector } from "./StepSelector";

interface SidebarProps {
  /** Current configuration state */
  config: Configuration;
  
  /** Which step accordion is currently open */
  currentStep: StepId;
  
  /** Callback when an option is selected */
  onSelectOption: (stepId: StepId, optionId: OptionId) => void;
  
  /** Callback when step accordion is toggled */
  onSetCurrentStep: (stepId: StepId) => void;
}

/**
 * Left sidebar with step accordions.
 *
 * Layout:
 * - Fixed width (w-96 = 384px)
 * - Red background
 * - "Build it" header at top
 * - Scrollable list of StepSelector components
 */
export function Sidebar({
  config,
  currentStep,
  onSelectOption,
  onSetCurrentStep,
}: SidebarProps) {
  return (
    <aside className="w-96 bg-red-700 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-4xl font-bold">
          Build <span className="text-black bg-white px-2">it</span>
        </h1>
      </div>

      {/* Steps List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-2">
          {STEPS.map((step) => (
            <StepSelector
              key={step.id}
              step={step}
              isOpen={currentStep === step.id}
              selectedOptionId={config[step.id]}
              config={config}
              onSelect={(optionId) => onSelectOption(step.id, optionId)}
              onToggle={() => onSetCurrentStep(step.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}