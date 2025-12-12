// ============================================================================
// MAIN PANEL COMPONENT
// ============================================================================
//
// Right panel of the calculator containing:
// - Product Preview (6 tiles showing selections)
// - Product Model Display (article code visualization)
// - Action Buttons (shown when configuration is complete)
// ============================================================================

import type { Configuration, ProductModel } from "../types";
import { ProductPreview } from "./ProductPreview";
import { ProductModelDisplay } from "./ProductModelDisplay";
import { ActionButtons } from "./ActionButtons";

interface MainPanelProps {
  /** Current configuration state */
  config: Configuration;
  
  /** Generated product model */
  productModel: ProductModel;
  
  /** Callback to reset configuration */
  onReset: () => void;
}

/**
 * Right panel with product preview, model display, and actions.
 *
 * Layout:
 * - Flexible width (fills remaining space)
 * - Grey background
 * - Scrollable content
 */
export function MainPanel({ config, productModel, onReset }: MainPanelProps) {
  return (
    <main className="flex-1 bg-gray-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Product Preview Grid */}
        <ProductPreview config={config} />

        {/* Product Model Code Display */}
        <ProductModelDisplay productModel={productModel} />

        {/* Action Buttons - only shown when configuration is complete */}
        {productModel.isComplete && (
          <ActionButtons productModel={productModel} onReset={onReset} />
        )}

        {/* Incomplete configuration hint */}
        {!productModel.isComplete && (
          <p className="text-sm text-gray-500 italic">
            Complete all required selections to see action buttons.
          </p>
        )}
      </div>
    </main>
  );
}