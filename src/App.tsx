// ============================================================================
// APP - ROOT COMPONENT WITH ROUTING
// ============================================================================
//
// Routes:
// - /                      → HomePage (with embedded configurator)
// - /?model=<slug>         → HomePage with specific model active
// - /configurator/:slug    → Redirect to /?model=<slug> (legacy support)
// - /my-list               → MyListPage (saved configurations)
//
// ============================================================================

import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MyListPage } from "./pages/MyListPage";
import { Layout } from "./components/Layout";

// ============================================================================
// LEGACY REDIRECT COMPONENT
// ============================================================================

/**
 * Redirects /configurator/:slug to /?model=:slug
 * Preserves backward compatibility for shared links.
 */
function ConfiguratorRedirect() {
  const { modelSlug } = useParams<{ modelSlug: string }>();
  
  // Redirect to home with model query param
  // TODO: Add scroll-to-configurator after redirect if needed
  return <Navigate to={`/?model=${modelSlug}`} replace />;
}

// ============================================================================
// APP COMPONENT
// ============================================================================

/**
 * Root application component with routing.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home - Product Selection + Embedded Configurator */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        {/* Legacy Configurator Route - Redirect to Home with query param */}
        <Route
          path="/configurator/:modelSlug"
          element={<ConfiguratorRedirect />}
        />

        {/* My List - Saved Configurations */}
        <Route
          path="/my-list"
          element={
            <Layout>
              <MyListPage />
            </Layout>
          }
        />

        {/* 404 - Redirect to home */}
        <Route 
          path="*" 
          element={
            <Layout>
              <HomePage />
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;