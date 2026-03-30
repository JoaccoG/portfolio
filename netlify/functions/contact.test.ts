import type { Context } from '@netlify/functions';

const mockSendEmail = vi.fn();

vi.mock('@api/lib/emails-sender', () => ({
  getEmailSender: () => ({ sendEmail: mockSendEmail })
}));

const ctx = {} as Context;

const post = (body: unknown) =>
  new Request('https://site.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

const validBody = { email: 'user@example.com', subject: 'Hello', message: 'Hi there' };

describe('Given the contact function', () => {
  let handler: (req: Request, ctx: Context) => Promise<Response>;

  beforeAll(async () => {
    handler = (await import('./contact')).default;
  });

  beforeEach(() => {
    mockSendEmail.mockReset();
  });

  describe('When the body is invalid JSON', () => {
    it('Then it should return 400', async () => {
      const req = new Request('https://site.com/api/contact', { method: 'POST', body: 'not json' });
      const res = await handler(req, ctx);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ message: 'Invalid JSON body' });
    });
  });

  describe('When validation fails', () => {
    it('Then it should return 422 with field errors', async () => {
      const res = await handler(post({ email: 'bad', subject: '', message: '' }), ctx);
      expect(res.status).toBe(422);
      const body = (await res.json()) as { message: string; errors: Record<string, string[]> };
      expect(body.message).toBe('Validation failed');
      expect(body.errors).toBeDefined();
    });
  });

  describe('When the email sender fails', () => {
    it('Then it should return 502', async () => {
      mockSendEmail.mockRejectedValueOnce({ status: 502, message: 'Failed to send email' });
      const res = await handler(post(validBody), ctx);
      expect(res.status).toBe(500);
    });
  });

  describe('When everything is valid', () => {
    it('Then it should send the email and return 201', async () => {
      mockSendEmail.mockResolvedValueOnce(undefined);
      const res = await handler(post(validBody), ctx);

      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ success: true });
      expect(mockSendEmail).toHaveBeenCalledWith({
        replyTo: 'user@example.com',
        subject: 'Hello',
        message: 'Hi there'
      });
    });

    it('Then it should trim whitespace from fields', async () => {
      mockSendEmail.mockResolvedValueOnce(undefined);
      await handler(post({ email: '  user@example.com  ', subject: '  Hello  ', message: '  Hi  ' }), ctx);

      expect(mockSendEmail).toHaveBeenCalledWith({
        replyTo: 'user@example.com',
        subject: 'Hello',
        message: 'Hi'
      });
    });
  });
});
