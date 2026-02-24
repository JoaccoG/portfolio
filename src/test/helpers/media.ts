type Listener = (e: { matches: boolean }) => void;

/**
 * Mocks `window.matchMedia` with controllable query results.
 * Tracks listeners per query and exposes a `triggerChange` function to simulate media query changes at runtime.
 *
 * @param {Record<string, boolean>} matches - A record mapping media query strings to their initial match state (e.g., `{ 'xs': true, 'sm': false }`).
 *
 * @returns {vi.fn()} mock - The spy replacing `matchMedia`
 * @returns {Function} triggerChange - A function to update a query's match state and notify its listeners.
 */
export const mockMatchMedia = (matches: Record<string, boolean>) => {
  const listeners = new Map<string, Listener[]>();

  const mock = vi.fn((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn((_event: string, listener: Listener) => {
      const existing = listeners.get(query) ?? [];
      existing.push(listener);
      listeners.set(query, existing);
    }),
    removeEventListener: vi.fn((_event: string, listener: Listener) => {
      const existing = listeners.get(query) ?? [];
      listeners.set(
        query,
        existing.filter((l) => l !== listener)
      );
    }),
    dispatchEvent: vi.fn()
  }));

  Object.defineProperty(globalThis, 'matchMedia', { value: mock, writable: true });

  const triggerChange = (query: string, newMatches: boolean) => {
    matches[query] = newMatches;
    const queryListeners = listeners.get(query) ?? [];
    queryListeners.forEach((listener) => listener({ matches: newMatches }));
  };

  return { mock, triggerChange };
};
