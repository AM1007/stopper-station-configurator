// ============================================================================
// LAYOUT COMPONENT
// ============================================================================
//
// Shared layout wrapper for pages with:
// - Header (logo + navigation)
// - Main content area
// - Footer (placeholder)
//
// Used by: HomePage, MyListPage
// NOT used by: ConfiguratorPage (has its own full-screen layout)
//
// ============================================================================

import { Link } from "react-router-dom";
import { useMyListCount } from "../stores/configurationStore";

// ============================================================================
// TYPES
// ============================================================================

interface LayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// ============================================================================
// HEADER
// ============================================================================

function Header() {
  const myListCount = useMyListCount();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-red-600">
            Build <span className="bg-red-600 text-white px-1">it</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-red-600 font-medium text-sm"
            >
              Home
            </Link>
            <Link
              to="/my-list"
              className="text-gray-600 hover:text-red-600 font-medium text-sm flex items-center gap-2"
            >
              My List
              {myListCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {myListCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="text-xl font-bold text-white">
            Build <span className="bg-red-600 px-1">it</span>
          </div>

          {/* Copyright */}
          <p className="text-sm">
            © {new Date().getFullYear()} Product Configurator. All rights reserved.
          </p>

          {/* Links placeholder */}
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}