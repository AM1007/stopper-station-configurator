// ============================================================================
// PRODUCT MODEL DISPLAY COMPONENT
// ============================================================================
//
// Visual display of the generated product model/article code.
// Shows individual cells for each part of the code:
//
// Format: SS2 | [colour] | [cover] | [activation] | [text] | - | [language] | [installation]
//
// Example: SS2 | 0 | 2 | 4 | NT | - | EN | &KIT-71101B-R
// ============================================================================

import type { ProductModel } from "../types";

interface ProductModelDisplayProps {
  /** Generated product model */
  productModel: ProductModel;
}

/**
 * Visual display of product model code with individual cells.
 *
 * Layout:
 * - "SS2" prefix
 * - 4 cells: colour, cover, activation, text
 * - Separator "-"
 * - 1 cell: language
 * - 1 cell: installation options (if selected)
 */
export function ProductModelDisplay({ productModel }: ProductModelDisplayProps) {
  const { parts } = productModel;

  // Main code cells (before the separator)
  const mainCells = [
    { value: parts.colour, label: "colour" },
    { value: parts.cover, label: "cover" },
    { value: parts.activation, label: "activation" },
    { value: parts.text, label: "text" },
  ];

  return (
    <div className="mb-6">
      {/* Section title */}
      <h3 className="text-lg font-bold text-gray-800 mb-3">PRODUCT MODEL:</h3>

      {/* Model code display */}
      <div className="flex items-center flex-wrap gap-1">
        {/* Base code prefix */}
        <span className="text-2xl font-bold text-gray-800 mr-2">
          {productModel.baseCode}
        </span>

        {/* Main code cells */}
        {mainCells.map((cell) => (
          <div
            key={cell.label}
            className={`
              w-12 h-12 border-2 flex items-center justify-center
              text-lg font-semibold
              ${cell.value ? "border-gray-400 text-gray-800" : "border-gray-300 text-gray-300"}
            `}
            title={cell.label}
          >
            {cell.value || ""}
          </div>
        ))}

        {/* Separator */}
        <span className="text-2xl font-bold text-gray-800 mx-1">–</span>

        {/* Language cell */}
        <div
          className={`
            w-12 h-12 border-2 flex items-center justify-center
            text-lg font-semibold
            ${parts.language ? "border-gray-400 text-gray-800" : "border-gray-300 text-gray-300"}
          `}
          title="language"
        >
          {parts.language || ""}
        </div>

        {/* Installation options cell (only if selected) */}
        {parts.installationOptions && (
          <div
            className="h-12 border-2 border-gray-400 flex items-center justify-center
                       px-3 text-sm font-semibold text-gray-800"
            title="installation options"
          >
            {parts.installationOptions}
          </div>
        )}
      </div>

      {/* Full code text (for reference) */}
      {productModel.isComplete && (
        <p className="mt-3 text-sm text-gray-600">
          Full code: <span className="font-mono font-semibold">{productModel.fullCode}</span>
        </p>
      )}
    </div>
  );
}