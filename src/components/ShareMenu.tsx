// ============================================================================
// SHARE MENU COMPONENT
// ============================================================================
//
// Dropdown menu with sharing/export options:
// - Email: Open mail client with pre-filled template
// - Save: Download as PDF (placeholder)
// - Print: Browser print dialog
// - Copy URL: Copy shareable URL to clipboard
// - Copy Model ID: Copy article code to clipboard
// ============================================================================

import type { ProductModel } from "../types";

interface ShareMenuProps {
  /** Generated product model with full code */
  productModel: ProductModel;
  
  /** Callback to close the menu */
  onClose: () => void;
}

/**
 * Dropdown menu with sharing and export options.
 */
export function ShareMenu({ productModel, onClose }: ShareMenuProps) {
  /**
   * Copy model ID to clipboard
   */
  const handleCopyModelId = async () => {
    try {
      await navigator.clipboard.writeText(productModel.fullCode);
      alert("Model ID copied to clipboard!");
    } catch {
      // Fallback for older browsers
      prompt("Copy this Model ID:", productModel.fullCode);
    }
    onClose();
  };

  /**
   * Copy shareable URL to clipboard
   */
  const handleCopyURL = async () => {
    const url = `${window.location.origin}${window.location.pathname}?model=${encodeURIComponent(productModel.fullCode)}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    } catch {
      // Fallback for older browsers
      prompt("Copy this URL:", url);
    }
    onClose();
  };

  /**
   * Open email client with pre-filled template
   */
  const handleEmail = () => {
    const subject = encodeURIComponent(
      `Stopper Station Configuration: ${productModel.fullCode}`
    );
    const body = encodeURIComponent(
      `I've configured a Stopper Station:\n\n` +
      `Model: ${productModel.fullCode}\n\n` +
      `View configuration: ${window.location.origin}${window.location.pathname}?model=${productModel.fullCode}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  /**
   * Open browser print dialog
   */
  const handlePrint = () => {
    window.print();
    onClose();
  };

  /**
   * Save as PDF (placeholder)
   * TODO: Implement PDF generation with jsPDF or similar
   */
  const handleSave = () => {
    alert("Save PDF: Not implemented yet.\n\nUse Print → Save as PDF as a workaround.");
    onClose();
  };

  // Menu items configuration
  const menuItems = [
    { icon: "✉️", label: "Email", onClick: handleEmail },
    { icon: "💾", label: "Save", onClick: handleSave },
    { icon: "🖨️", label: "Print", onClick: handlePrint },
    { icon: "🔗", label: "Copy URL", onClick: handleCopyURL },
    { icon: "📋", label: "Copy Model ID", onClick: handleCopyModelId },
  ];

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown menu */}
      <div
        className="absolute top-full right-0 mt-2 bg-white border border-gray-300 
                   rounded-lg shadow-lg py-2 w-48 z-20"
        role="menu"
      >
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="w-full text-left px-4 py-2 hover:bg-gray-100 
                       text-sm text-gray-700 flex items-center gap-2"
            onClick={item.onClick}
            role="menuitem"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}