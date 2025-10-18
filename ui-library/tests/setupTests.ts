import "@testing-library/jest-dom";

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  });
}

if (typeof window !== "undefined" && window.HTMLElement) {
  Object.defineProperty(window.HTMLElement.prototype, "focus", {
    configurable: true,
    writable: true,
    value() {
      // JSDOM focus noop shim for Chakra focus-visible polyfill
    }
  });
}

if (typeof window !== "undefined" && window.Element) {
  Object.defineProperty(window.Element.prototype, "focus", {
    configurable: true,
    writable: true,
    value() {}
  });
}
