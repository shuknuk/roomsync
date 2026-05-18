import { createInitialState, swipeWindowMs } from "./data";
import type { AppState } from "./types";

const storageKey = "roomsync-mvp-state";

function normalizeState(state: AppState): AppState {
  const windowStart = new Date(state.swipeWindowStartedAt).getTime();
  if (Number.isNaN(windowStart) || Date.now() - windowStart >= swipeWindowMs) {
    return {
      ...state,
      swipes: [],
      swipeWindowStartedAt: new Date().toISOString(),
    };
  }

  return state;
}

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return createInitialState();
    }

    return normalizeState({
      ...createInitialState(),
      ...JSON.parse(raw),
    });
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function resetState() {
  window.localStorage.removeItem(storageKey);
}
