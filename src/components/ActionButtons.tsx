// ============================================================================
// ACTION BUTTONS COMPONENT
// ============================================================================
//
// Row of action buttons shown when configuration is complete:
// - Start over: Reset configuration
// - Where to Buy: Placeholder link
// - Share: Dropdown menu with export options
// - Star (My List): Add to favorites (placeholder)
// ============================================================================

import { useState } from "react";
import type { ProductModel } from "../types";
import { ShareMenu } from "./ShareMenu";

interface ActionButtonsProps {
  /** Generated product model */
  productModel: ProductModel;
  
  /** Callback to reset configuration */
  onReset: () => void;
}

/**
 * Action buttons row for completed configuration.
 */
export function ActionButtons({ productModel, onReset }: ActionButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);

  /**
   * Handle "Where to Buy" click
   * TODO: Implement actual navigation or modal
   */
  const handleWhereToBuy = () => {
    alert("Where to Buy: Not implemented yet.\n\nThis would redirect to distributor information.");
  };

  /**
   * Toggle My List (favorites)
   * TODO: Implement localStorage persistence
   */
  const handleMyListToggle = () => {
    setIsInMyList((prev) => !prev);
    if (!isInMyList) {
      alert(`Added ${productModel.fullCode} to My List`);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Start Over Button */}
      <button
        type="button"
        onClick={onReset}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                   transition-colors text-sm font-medium flex items-center gap-2"
      >
        <span>↺</span>
        <span>Start over</span>
      </button>

      {/* Where to Buy Button */}
      <button
        type="button"
        onClick={handleWhereToBuy}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 
                   transition-colors text-sm font-medium"
      >
        Where to Buy
      </button>

      {/* Share Button with Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowShareMenu((prev) => !prev)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                     transition-colors text-sm font-medium flex items-center gap-2"
          aria-expanded={showShareMenu}
          aria-haspopup="true"
        >
          <span>Share</span>
          <span>↗</span>
        </button>

        {showShareMenu && (
          <ShareMenu
            productModel={productModel}
            onClose={() => setShowShareMenu(false)}
          />
        )}
      </div>

      {/* My List (Star) Button */}
      <button
        type="button"
        onClick={handleMyListToggle}
        className={`
          w-10 h-10 rounded flex items-center justify-center text-xl
          transition-colors border-2
          ${
            isInMyList
              ? "bg-red-600 border-red-600 text-white"
              : "bg-white border-red-600 text-red-600 hover:bg-red-50"
          }
        `}
        aria-label={isInMyList ? "Remove from My List" : "Add to My List"}
        aria-pressed={isInMyList}
      >
        {isInMyList ? "★" : "☆"}
      </button>
    </div>
  );
}