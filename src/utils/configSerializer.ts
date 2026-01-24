import type { Configuration, CustomTextData } from "../types";

interface SerializedState {
  config: Configuration;
  customText?: CustomTextData | null;
}

export function serializeConfig(
  config: Configuration,
  customText?: CustomTextData | null
): string {
  const state: SerializedState = {
    config,
  };

  if (customText) {
    state.customText = customText;
  }

  const json = JSON.stringify(state);
  const base64 = btoa(encodeURIComponent(json));
  
  return base64;
}

export function deserializeConfig(encoded: string): SerializedState | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const state = JSON.parse(json) as SerializedState;

    if (!state.config || typeof state.config !== "object") {
      console.warn("Invalid config structure in URL");
      return null;
    }

    return state;
  } catch (error) {
    console.warn("Failed to deserialize config from URL:", error);
    return null;
  }
}

export function buildShareableUrl(
  baseUrl: string,
  modelId: string,
  config: Configuration,
  customText?: CustomTextData | null
): string {
  const serialized = serializeConfig(config, customText);
  
  const params = new URLSearchParams({
    model: modelId,
    state: serialized,
  });

  return `${baseUrl}?${params.toString()}`;
}

export function parseConfigFromUrl(searchParams: URLSearchParams): {
  modelId: string | null;
  state: SerializedState | null;
} {
  const modelId = searchParams.get("model");
  const stateParam = searchParams.get("state");

  let state: SerializedState | null = null;

  if (stateParam) {
    state = deserializeConfig(stateParam);
  }

  return { modelId, state };
}

