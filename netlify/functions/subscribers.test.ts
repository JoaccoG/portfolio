import type { Context } from '@netlify/functions';

const mockAddSubscriber = vi.fn();

vi.mock('@api/lib/emails-sender', () => ({
  getEmailSender: () => ({ addSubscriber: mockAddSubscriber })
}));

const ctx = {} as Context;

const post = (body: unknown) =>
  new Request('https://site.com/api/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

describe('Given the subscribers function', () => {
  let handler: (req: Request, ctx: Context) => Promise<Response>;

  beforeAll(async () => {
    handler = (await import('./subscribers')).default;
  });

  beforeEach(() => {
    mockAddSubscriber.mockReset();
  });

  describe('When the body is invalid JSON', () => {
    it('Then it should return 400', async () => {
      const req = new Request('https://site.com/api/subscribers', { method: 'POST', body: 'not json' });
      const res = await handler(req, ctx);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ message: 'Invalid JSON body' });
    });
  });

  describe('When validation fails', () => {
    it('Then it should return 422 for invalid email', async () => {
      const res = await handler(post({ email: 'not-valid' }), ctx);
      expect(res.status).toBe(422);
      const body = (await res.json()) as { message: string; errors: Record<string, string[]> };
      expect(body.message).toBe('Validation failed');
      expect(body.errors?.email).toBeDefined();
    });

    it('Then it should return 422 for missing email', async () => {
      const res = await handler(post({}), ctx);
      expect(res.status).toBe(422);
    });
  });

  describe('When the email sender fails', () => {
    it('Then it should return 500', async () => {
      mockAddSubscriber.mockRejectedValueOnce(new Error('fail'));
      const res = await handler(post({ email: 'user@example.com' }), ctx);
      expect(res.status).toBe(500);
    });
  });

  describe('When everything is valid', () => {
    it('Then it should subscribe and return 201', async () => {
      mockAddSubscriber.mockResolvedValueOnce(undefined);
      const res = await handler(post({ email: 'user@example.com' }), ctx);

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ success: true });
      expect(mockAddSubscriber).toHaveBeenCalledWith({ email: 'user@example.com' });
    });

    it('Then it should trim whitespace from email', async () => {
      mockAddSubscriber.mockResolvedValueOnce(undefined);
      await handler(post({ email: '  user@example.com  ' }), ctx);

      expect(mockAddSubscriber).toHaveBeenCalledWith({ email: 'user@example.com' });
    });
  });
});
