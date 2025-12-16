// ============================================================================
// MAIN PANEL COMPONENT
// ============================================================================
//
// Right panel of the configurator containing:
// - Tab switcher (Edit Selections / Product Preview)
// - Product Preview (tiles showing selections)
// - Product Model Display (article code visualization)
// - Action Buttons (shown when configuration is complete)
//
// Responsive:
// - Desktop: Fills remaining space next to sidebar
// - Mobile: Full width below header
//
// ============================================================================

import type { Configuration, ProductModel, ModelDefinition } from "../types";
import { ProductPreview } from "./ProductPreview";
import { ProductModelDisplay } from "./ProductModelDisplay";
import { ActionButtons } from "./ActionButtons";

// ============================================================================
// TYPES
// ============================================================================

interface MainPanelProps {
  /** Current model definition */
  model: ModelDefinition;

  /** Current configuration state */
  config: Configuration;

  /** Generated product model */
  productModel: ProductModel;

  /** Callback to reset configuration */
  onReset: () => void;

  /** Callback to add to My List */
  onAddToMyList: () => void;

  /** Optional: additional CSS classes */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Right panel with product preview, model display, and actions.
 *
 * Layout:
 * - Flexible width (fills remaining space)
 * - Grey background
 * - Scrollable content
 * - Centered content with max-width
 */
export function MainPanel({
  model,
  config,
  productModel,
  onReset,
  onAddToMyList,
  className = "",
}: MainPanelProps) {
  return (
    <main className={`flex-1 bg-gray-100 overflow-y-auto ${className}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Tabs: Edit Selections / Product Preview */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <TabButton active>Edit Selections</TabButton>
          <TabButton active={false}>Product Preview</TabButton>
        </div>

        {/* Product Preview Grid */}
        <ProductPreview model={model} config={config} />

        {/* Product Model Code Display */}
        <ProductModelDisplay model={model} productModel={productModel} />

        {/* Action Buttons - only shown when configuration is complete */}
        {productModel.isComplete && (
          <ActionButtons
            productModel={productModel}
            onReset={onReset}
            onAddToMyList={onAddToMyList}
          />
        )}

        {/* Incomplete configuration hint */}
        {!productModel.isComplete && productModel.missingSteps && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Complete all required selections to see action buttons.
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Missing:{" "}
              {productModel.missingSteps
                .map((stepId) => {
                  const step = model.steps.find((s) => s.id === stepId);
                  return step?.title ?? stepId;
                })
                .join(", ")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================================
// TAB BUTTON (internal component)
// ============================================================================

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

/**
 * Tab button for Edit Selections / Product Preview toggle.
 * TODO: Implement actual tab switching when Product Preview images are ready.
 */
function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      className={`
        pb-2 px-1 text-sm font-medium transition-colors
        ${
          active
            ? "text-red-600 border-b-2 border-red-600"
            : "text-gray-500 hover:text-gray-700"
        }
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}