import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ConfiguratorPage } from "./pages/ConfiguratorPage";
import { MyListPage } from "./pages/MyListPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        <Route
          path="/configurator/:slug"
          element={
            <Layout>
              <ConfiguratorPage />
            </Layout>
          }
        />

        <Route
          path="/my-list"
          element={
            <Layout>
              <MyListPage />
            </Layout>
          }
        />

        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;