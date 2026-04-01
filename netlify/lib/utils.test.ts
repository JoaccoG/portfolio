import { ApiError } from './errors-handler';
import { requireEnv, json } from './utils';

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
  it('Then it should inject status into the body', async () => {
    const res = json({ message: 'OK' });
    expect(await res.json()).toEqual({ status: 200, message: 'OK' });
  });

  it('Then it should inject the provided status into the body', async () => {
    const res = json({ message: 'Created' }, 201);
    expect(await res.json()).toEqual({ status: 201, message: 'Created' });
  });

  it('Then it should default to HTTP status 200', () => {
    expect(json({ message: 'OK' }).status).toBe(200);
  });

  it('Then it should use the provided HTTP status', () => {
    expect(json({ message: 'Not found' }, 404).status).toBe(404);
  });

  it('Then it should set Content-Type to application/json', () => {
    const res = json({ message: 'OK' });
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });
});
