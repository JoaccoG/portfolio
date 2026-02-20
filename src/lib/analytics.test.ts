import { stubProductionEnv } from '@test/helpers/env';

vi.unmock('./analytics');

type AnalyticsModule = typeof import('./analytics');
type UmamiMock = { track: ReturnType<typeof vi.fn> };

const MOCK_SCRIPT_URL = 'https://test.com/';
const MOCK_WEBSITE_ID = 'test-website-id';

let loadUmami: AnalyticsModule['loadUmami'];
let track: AnalyticsModule['track'];

const mountUmamiMock = (): UmamiMock => {
  const mock: UmamiMock = { track: vi.fn() };
  (globalThis as unknown as { umami?: UmamiMock }).umami = mock;

  return mock;
};

const getInjectedScript = () => document.head.querySelector('script');

const simulateScriptLoad = () => {
  const script = getInjectedScript();
  script?.onload?.(new Event('load'));
};

beforeEach(async () => {
  vi.resetModules();
  vi.unstubAllEnvs();
  document.head.innerHTML = '';
  delete (globalThis as { umami?: unknown }).umami;

  const mod = await import('./analytics');
  loadUmami = mod.loadUmami;
  track = mod.track;
});

describe('Given the analytics lib', () => {
  describe('When loadUmami() is called', () => {
    it('If in local, then it should not inject the script', () => {
      vi.stubEnv('VITE_ENVIRONMENT', 'local');
      loadUmami();
      expect(getInjectedScript()).toBeNull();
    });

    it('If in production but env vars are missing, then it should not inject the script', () => {
      vi.stubEnv('VITE_ENVIRONMENT', 'production');
      vi.stubEnv('VITE_UMAMI__SCRIPT_URL', '');
      vi.stubEnv('VITE_UMAMI__WEBSITE_ID', '');
      loadUmami();
      expect(getInjectedScript()).toBeNull();
    });

    it('If in production, then it should inject a script tag with correct attributes', () => {
      stubProductionEnv();
      loadUmami();
      const script = getInjectedScript();
      expect(script).not.toBeNull();
      expect(script?.src).toBe(MOCK_SCRIPT_URL);
      expect(script?.dataset.websiteId).toBe(MOCK_WEBSITE_ID);
      expect(script?.async).toBe(true);
    });
  });

  describe('When track() is called', () => {
    it('If Umami has not loaded yet, then it should queue the events', () => {
      stubProductionEnv();
      loadUmami();
      track('test-event');
      expect(mountUmamiMock().track).not.toHaveBeenCalled();
    });

    it('If Umami has loaded, then it should flush queued events', () => {
      stubProductionEnv();
      const umami = mountUmamiMock();
      loadUmami();
      track('queued-event', { key: 'value' });
      simulateScriptLoad();
      expect(umami.track).toHaveBeenCalledWith('queued-event', { key: 'value' });
    });

    it('If Umami has loaded, then it should call umami.track directly', () => {
      stubProductionEnv();
      const umami = mountUmamiMock();
      loadUmami();
      simulateScriptLoad();
      track('direct-event');
      expect(umami.track).toHaveBeenCalledWith('direct-event', undefined);
    });

    it('If document is not in globalThis, then it should not track anything', () => {
      const originalDocument = globalThis.document;
      delete (globalThis as { document: unknown }).document;
      track('ignored-event');
      globalThis.document = originalDocument;
      stubProductionEnv();
      const umami = mountUmamiMock();
      loadUmami();
      simulateScriptLoad();
      expect(umami.track).not.toHaveBeenCalled();
    });

    it('If Umami has loaded, then it should flush multiple queued events in order', () => {
      stubProductionEnv();
      const umami = mountUmamiMock();
      loadUmami();
      track('first');
      track('second');
      track('third');
      simulateScriptLoad();
      expect(umami.track).toHaveBeenCalledTimes(3);
      expect(umami.track).toHaveBeenNthCalledWith(1, 'first', undefined);
      expect(umami.track).toHaveBeenNthCalledWith(2, 'second', undefined);
      expect(umami.track).toHaveBeenNthCalledWith(3, 'third', undefined);
    });
  });
});
