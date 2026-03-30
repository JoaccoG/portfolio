import type { Context } from '@netlify/functions';

import { ApiError } from '@api/lib/errors-handler';
import { withApi } from '@api/middlewares/composer';

const ctx = {} as Context;

describe('Given withApi', () => {
  it('Then it should return the handler response on success', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    const wrapped = withApi(handler);

    const res = await wrapped(new Request('https://test.com'), ctx);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe('ok');
  });

  it('Then it should catch errors via the error handler middleware', async () => {
    const handler = vi.fn().mockRejectedValue(new ApiError(400, 'Bad Request'));
    const wrapped = withApi(handler);

    const res = await wrapped(new Request('https://test.com'), ctx);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: 'Bad Request' });
  });
});
