type Listener = (e: { matches: boolean }) => void;

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
