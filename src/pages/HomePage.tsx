import { allConfigurators } from "../data/catalog";
import { ConfiguratorCard } from "../components/ConfiguratorCard";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-brand-700 text-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
            Build <span className="bg-white text-black px-2">it</span>
          </h1>

          <p className="text-lg md:text-xl text-red-100 text-center max-w-2xl mx-auto">
            Configure your safety products with our interactive configurator.
            Select a product to get started.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-301.5 px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {allConfigurators.map((config) => (
              <ConfiguratorCard key={config.id} config={config} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}