// ============================================================================
// PRODUCT MODEL DISPLAY COMPONENT
// ============================================================================
//
// Visual display of the generated product model/article code.
// Shows individual cells for each part of the code.
//
// Supports different formats:
// - SS2: SS2 | 0 | 2 | 4 | NT | - | EN | &KIT-71101B-R
// - SS3-: SS3- | 1 | R | 0 | 4 | - | CL
// - WSS3: WSS3 | - | 1 | R | 0 | 4 | - | CL
// - RP: RP | - | R | - | SM | - | 02 | - | CL
// - WRP2: WRP2 | - | R | - | 02 | - | CL
//
// ============================================================================

import type { ProductModel, ModelDefinition } from "../types";

// ============================================================================
// TYPES
// ============================================================================

interface ProductModelDisplayProps {
  /** Current model definition */
  model: ModelDefinition;

  /** Generated product model */
  productModel: ProductModel;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Visual display of product model code with individual cells.
 *
 * Layout adapts to model's productModelSchema:
 * - baseCode prefix
 * - cells for each part in partsOrder
 * - separators based on separatorMap
 */
export function ProductModelDisplay({
  model,
  productModel,
}: ProductModelDisplayProps) {
  const { parts, baseCode, isComplete, fullCode } = productModel;
  const { partsOrder, separatorMap } = model.productModelSchema;

  return (
    <div className="mb-6">
      {/* Section title */}
      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
        Product Model:
      </h3>

      {/* Model code display */}
      <div className="flex items-center flex-wrap gap-1">
        {/* Base code prefix */}
        <span className="text-xl md:text-2xl font-bold text-gray-800 mr-1">
          {baseCode}
        </span>

        {/* Dynamic cells based on partsOrder */}
        {partsOrder.map((stepId, index) => {
          const value = parts[stepId] ?? "";
          const step = model.steps.find((s) => s.id === stepId);
          const separator = separatorMap?.[stepId] ?? "";

          // Determine if this is a "special" cell (like label with CL)
          const isLabelStep = stepId === "label";
          const isEmpty = !value;

          return (
            <div key={stepId} className="flex items-center">
              {/* Separator before cell (if defined) */}
              {separator && (
                <span className="text-xl md:text-2xl font-bold text-gray-400 mx-0.5">
                  {separator}
                </span>
              )}

              {/* Cell - skip if label step with empty value */}
              {!(isLabelStep && isEmpty) && (
                <div
                  className={`
                    min-w-10 h-10 md:min-w-12 md:h-12 
                    border-2 flex items-center justify-center
                    px-2 text-base md:text-lg font-semibold
                    ${
                      value
                        ? "border-gray-400 text-gray-800 bg-white"
                        : "border-gray-200 text-gray-300 bg-gray-50"
                    }
                  `}
                  title={step?.title ?? stepId}
                >
                  {value || "—"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full code text (for copy/reference) */}
      <div className="mt-4">
        {isComplete ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600">
              Full code:{" "}
              <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                {fullCode}
              </span>
            </p>
            <CopyButton text={fullCode} />
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Complete all selections to generate full code
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COPY BUTTON (internal component)
// ============================================================================

interface CopyButtonProps {
  text: string;
}

/**
 * Small button to copy product code to clipboard.
 */
function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Show toast notification
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs text-gray-500 hover:text-gray-700 underline"
      title="Copy to clipboard"
    >
      Copy
    </button>
  );
}

// ============================================================================
// COMPACT DISPLAY (for My List)
// ============================================================================

interface CompactModelDisplayProps {
  /** Full product code */
  code: string;
}

/**
 * Compact one-line display for My List items.
 */
export function CompactModelDisplay({ code }: CompactModelDisplayProps) {
  return (
    <span className="font-mono text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
      {code}
    </span>
  );
}