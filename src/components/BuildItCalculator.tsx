// ============================================================================
// BUILD IT CALCULATOR - MAIN CONTAINER COMPONENT
// ============================================================================
//
// Root component that orchestrates the entire calculator:
// - Manages configuration state via useConfiguration hook
// - Generates product model via buildProductModel utility
// - Renders Sidebar (left) and MainPanel (right)
//
// Layout: Full-height flex container with two panels
// ============================================================================

import { useConfiguration } from "../hooks/useConfiguration";
import { buildProductModel } from "../utils/buildProductModel";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "./MainPanel";

/**
 * Main calculator component.
 *
 * Responsibilities:
 * - State management (configuration, current step)
 * - Product model generation
 * - Layout orchestration (sidebar + main panel)
 */
export function BuildItCalculator() {
  // Configuration state and controls
  const {
    config,
    currentStep,
    selectOption,
    resetConfiguration,
    setCurrentStep,
  } = useConfiguration();

  // Generate product model from current configuration
  const productModel = buildProductModel(config);

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Step Selection */}
      <Sidebar
        config={config}
        currentStep={currentStep}
        onSelectOption={selectOption}
        onSetCurrentStep={setCurrentStep}
      />

      {/* Right Panel - Preview & Actions */}
      <MainPanel
        config={config}
        productModel={productModel}
        onReset={resetConfiguration}
      />
    </div>
  );
}