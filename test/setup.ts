import { vi } from 'vitest';

// Mock ResizeObserver for the JSDOM environment
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
// Mock for window.customCards
if (typeof window !== 'undefined') {
  window.customCards = [];
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

// Minimal type definitions to satisfy the linter and type-checker for the mock.
interface LovelaceCard {
  constructor: {
    getConfigElement: () => void;
  };
}

interface LovelaceCardHelpers {
  createCardElement: (config: object) => Promise<LovelaceCard>;
}

// Mock for Home Assistant helpers
interface CustomWindow extends Window {
  loadCardHelpers?: () => Promise<LovelaceCardHelpers>;
}

(window as CustomWindow).loadCardHelpers = vi.fn().mockResolvedValue({
  createCardElement: vi.fn().mockResolvedValue({ constructor: { getConfigElement: vi.fn() } }),
});
