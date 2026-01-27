import type { ModelId } from "../types";

type Language = "en" | "uk";

type ModelDescriptions = Record<string, string>;

// Vite-compatible glob import for model descriptions
// This statically analyzes all JSON files at build time
const descriptionModules = import.meta.glob<{ default: ModelDescriptions }>(
  "../i18n/locales/*/modelDescriptions/*.json",
  { eager: false }
);

const descriptionsCache = new Map<string, ModelDescriptions>();

/**
 * Builds the glob path key for a given language and modelId
 */
function buildGlobPath(lang: Language, modelId: string): string {
  return `../i18n/locales/${lang}/modelDescriptions/${modelId}.json`;
}

/**
 * Dynamically imports model descriptions JSON file for given modelId and language.
 * Returns cached version if already loaded.
 */
async function loadModelDescriptions(
  modelId: ModelId,
  lang: Language
): Promise<ModelDescriptions | null> {
  const cacheKey = `${modelId}:${lang}`;
  
  if (descriptionsCache.has(cacheKey)) {
    return descriptionsCache.get(cacheKey)!;
  }

  const globPath = buildGlobPath(lang, modelId);
  const loader = descriptionModules[globPath];

  if (!loader) {
    console.warn(
      `[getModelDescription] No description file found for path: ${globPath}`
    );
    console.warn(
      `[getModelDescription] Available paths:`,
      Object.keys(descriptionModules)
    );
    return null;
  }

  try {
    const module = await loader();
    const descriptions: ModelDescriptions = module.default;
    
    descriptionsCache.set(cacheKey, descriptions);
    console.log(
      `[getModelDescription] Loaded descriptions for ${modelId} (${lang}):`,
      Object.keys(descriptions).length,
      "entries"
    );
    
    return descriptions;
  } catch (error) {
    console.error(
      `[getModelDescription] Failed to load descriptions for ${modelId} (${lang}):`,
      error
    );
    return null;
  }
}

/**
 * Gets the description for a specific product code (SKU).
 * 
 * @param productCode - Full product code (e.g., "G3A209ZA-EN")
 * @param modelId - Model identifier (e.g., "g3-multipurpose-push-button")
 * @param lang - Language code ("en" or "uk")
 * @returns Description string or null if not found
 * 
 * @example
 * const description = await getModelDescription(
 *   "G3A209ZA-EN",
 *   "g3-multipurpose-push-button",
 *   "uk"
 * );
 */
export async function getModelDescription(
  productCode: string,
  modelId: ModelId,
  lang: Language
): Promise<string | null> {
  // Try requested language first
  let descriptions = await loadModelDescriptions(modelId, lang);
  
  // Fallback to English if requested language not found
  if (!descriptions && lang !== "en") {
    console.warn(
      `[getModelDescription] Falling back to EN for ${modelId}`
    );
    descriptions = await loadModelDescriptions(modelId, "en");
  }

  if (!descriptions) {
    console.warn(
      `[getModelDescription] No descriptions available for model: ${modelId}`
    );
    return null;
  }

  const description = descriptions[productCode] ?? null;
  
  if (!description) {
    console.warn(
      `[getModelDescription] No description found for product code: ${productCode}`
    );
  }

  return description;
}

/**
 * Synchronous version that only checks cache.
 * Returns null if descriptions are not yet loaded.
 * Use getModelDescription() for async loading.
 */
export function getModelDescriptionSync(
  productCode: string,
  modelId: ModelId,
  lang: Language
): string | null {
  const cacheKey = `${modelId}:${lang}`;
  const descriptions = descriptionsCache.get(cacheKey);
  
  if (!descriptions) {
    return null;
  }

  return descriptions[productCode] ?? null;
}

/**
 * Preloads model descriptions into cache.
 * Useful to call on page load to avoid delays later.
 */
export async function preloadModelDescriptions(
  modelId: ModelId,
  lang: Language
): Promise<void> {
  await loadModelDescriptions(modelId, lang);
}

/**
 * Clears the descriptions cache.
 * Useful when language changes.
 */
export function clearModelDescriptionsCache(): void {
  descriptionsCache.clear();
}

/**
 * Debug function to list all available description modules
 */
export function listAvailableDescriptionModules(): string[] {
  return Object.keys(descriptionModules);
}

