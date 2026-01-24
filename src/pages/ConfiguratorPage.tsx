import { useParams, Navigate } from "react-router-dom";
import { getConfiguratorBySlug } from "../data/catalog";
import { getModelBySlug } from "../data/models";
import { BuildItCalculator } from "../components/BuildItCalculator";
import { ConfiguratorHero } from "../components/ConfiguratorHero";
import { getHeroContent } from "../data/heroContent";
import { useConfigurationStore } from "../stores/configurationStore";
import { InDevelopmentPage } from "./InDevelopmentPage";

export function ConfiguratorPage() {
  const { slug } = useParams<{ slug: string }>();

  const addToMyList = useConfigurationStore((state) => state.addToMyList);
  const removeFromMyList = useConfigurationStore((state) => state.removeFromMyList);
  const setModel = useConfigurationStore((state) => state.setModel);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const config = getConfiguratorBySlug(slug);

  if (!config) {
    return <Navigate to="/" replace />;
  }

  if (!config.isImplemented) {
    return <InDevelopmentPage />;
  }

  const model = getModelBySlug(slug);

  if (!model) {
    return <InDevelopmentPage />;
  }

  const heroContent = getHeroContent(model.id);

  const handleAddToMyList = () => {
    setModel(model.id);
    addToMyList();
  };

  const handleRemoveFromMyList = (itemId: string) => {
    removeFromMyList(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {heroContent && (
        <ConfiguratorHero data={heroContent} productName={config.name} />
      )}

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto">
          <BuildItCalculator
            model={model}
            productName={config.name}
            onAddToMyList={handleAddToMyList}
            onRemoveFromMyList={handleRemoveFromMyList}
          />
        </div>
      </section>
    </div>
  );
}

// import { useParams, Navigate } from "react-router-dom";
// import { getConfiguratorBySlug } from "../data/catalog";
// import { getModelBySlug } from "../data/models";
// import { BuildItCalculator } from "../components/BuildItCalculator";
// import { ConfiguratorHero } from "../components/ConfiguratorHero";
// import { getHeroContent } from "../data/heroContent";
// import { useConfigurationStore } from "../stores/configurationStore";
// import { InDevelopmentPage } from "./InDevelopmentPage";

// export function ConfiguratorPage() {
//   const { slug } = useParams<{ slug: string }>();

//   const addToMyList = useConfigurationStore((state) => state.addToMyList);
//   const removeFromMyList = useConfigurationStore((state) => state.removeFromMyList);
//   const setModel = useConfigurationStore((state) => state.setModel);

//   if (!slug) {
//     return <Navigate to="/" replace />;
//   }

//   const config = getConfiguratorBySlug(slug);

//   if (!config) {
//     return <Navigate to="/" replace />;
//   }

//   if (!config.isImplemented) {
//     return <InDevelopmentPage />;
//   }

//   const model = getModelBySlug(slug);

//   if (!model) {
//     return <InDevelopmentPage />;
//   }

//   const heroContent = getHeroContent(model.id);

//   const handleAddToMyList = () => {
//     setModel(model.id);
//     addToMyList();
//   };

//   const handleRemoveFromMyList = (itemId: string) => {
//     removeFromMyList(itemId);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {heroContent && (
//         <ConfiguratorHero data={heroContent} productName={config.name} />
//       )}

//       <section className="bg-white border-b border-gray-200">
//         <div className="max-w-8xl mx-auto">
//           <BuildItCalculator
//             model={model}
//             onAddToMyList={handleAddToMyList}
//             onRemoveFromMyList={handleRemoveFromMyList}
//           />
//         </div>
//       </section>
//     </div>
//   );
// }