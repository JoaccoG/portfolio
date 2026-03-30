import { ApiError } from '@api/lib/errors-handler';
import { requireEnv, json } from '@api/lib/utils';

describe('Given requireEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('Then it should return the value when the env var exists', () => {
    vi.stubEnv('TEST_KEY', 'test-value');
    expect(requireEnv('TEST_KEY')).toBe('test-value');
  });

  it('Then it should throw ApiError(500) when the env var is missing', () => {
    expect(() => requireEnv('NONEXISTENT_KEY')).toThrow(ApiError);
    expect(() => requireEnv('NONEXISTENT_KEY')).toThrow('Server configuration error');
  });

  it('Then it should throw ApiError(500) when the env var is empty', () => {
    vi.stubEnv('EMPTY_KEY', '');
    expect(() => requireEnv('EMPTY_KEY')).toThrow(ApiError);
  });
});

describe('Given json', () => {
  it('Then it should return a Response with JSON body', async () => {
    const res = json({ success: true });
    expect(await res.json()).toEqual({ success: true });
  });

  it('Then it should default to status 200', () => {
    expect(json({ ok: true }).status).toBe(200);
  });

  it('Then it should use the provided status', () => {
    expect(json({ error: 'Not found' }, 404).status).toBe(404);
  });

  it('Then it should set Content-Type to application/json', () => {
    const res = json({ ok: true });
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });
});
