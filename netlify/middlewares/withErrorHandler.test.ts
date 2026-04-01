import type { Context } from '@netlify/functions';

import { ApiError } from '../lib/errors-handler';
import { withErrorHandler } from './withErrorHandler';

const ctx = {} as Context;

describe('Given withErrorHandler', () => {
  describe('When the handler succeeds', () => {
    it('Then it should return the handler response', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
      const wrapped = withErrorHandler(handler);

      const res = await wrapped(new Request('https://test.com'), ctx);

      expect(res.status).toBe(200);
      expect(await res.text()).toBe('ok');
    });

    it('Then it should pass req and context to the handler', async () => {
      const handler = vi.fn().mockResolvedValue(new Response());
      const wrapped = withErrorHandler(handler);
      const req = new Request('https://test.com');

      await wrapped(req, ctx);

      expect(handler).toHaveBeenCalledWith(req, ctx);
    });
  });

  describe('When the handler throws an ApiError', () => {
    it('Then it should return a JSON error response with the correct status', async () => {
      const handler = vi.fn().mockRejectedValue(new ApiError(422, 'Validation failed'));
      const wrapped = withErrorHandler(handler);

      const res = await wrapped(new Request('https://test.com'), ctx);

      expect(res.status).toBe(422);
      expect(await res.json()).toEqual({ status: 422, message: 'Validation failed', errors: [] });
    });
  });

  describe('When the handler throws an unknown error', () => {
    it('Then it should return 500 Internal Server Error', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('unexpected'));
      const wrapped = withErrorHandler(handler);

      const res = await wrapped(new Request('https://test.com'), ctx);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ status: 500, message: 'Internal Server Error', errors: [] });
    });
  });
});
