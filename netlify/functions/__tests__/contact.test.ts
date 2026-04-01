import type { Context } from '@netlify/functions';
import type { FieldError } from '../../lib/errors-handler';

interface ApiBody {
  status: number;
  message: string;
  errors: FieldError[];
}

const mockSendEmail = vi.fn();

vi.mock('../../lib/emails-sender', () => ({
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
    handler = (await import('../contact')).default;
  });

  beforeEach(() => {
    mockSendEmail.mockReset();
  });

  describe('When the body is invalid JSON', () => {
    it('Then it should return 400 with status in body', async () => {
      const req = new Request('https://site.com/api/contact', { method: 'POST', body: 'not json' });
      const res = await handler(req, ctx);
      expect(res.status).toBe(400);
      const body = (await res.json()) as ApiBody;
      expect(body.status).toBe(400);
      expect(body.message).toBe('Invalid JSON body');
      expect(body.errors).toEqual([]);
    });
  });

  describe('When validation fails', () => {
    it('Then it should return 422 with field errors as array', async () => {
      const res = await handler(post({ email: 'bad', subject: '', message: '' }), ctx);
      expect(res.status).toBe(422);
      const body = (await res.json()) as ApiBody;
      expect(body.status).toBe(422);
      expect(body.message).toBe('Validation failed');
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
      expect(body.errors[0]).toHaveProperty('field');
      expect(body.errors[0]).toHaveProperty('message');
    });
  });

  describe('When the email sender fails', () => {
    it('Then it should return 500', async () => {
      mockSendEmail.mockRejectedValueOnce(new Error('fail'));
      const res = await handler(post(validBody), ctx);
      expect(res.status).toBe(500);
      const body = (await res.json()) as ApiBody;
      expect(body.status).toBe(500);
      expect(body.errors).toEqual([]);
    });
  });

  describe('When everything is valid', () => {
    it('Then it should send the email and return 201', async () => {
      mockSendEmail.mockResolvedValueOnce(undefined);
      const res = await handler(post(validBody), ctx);

      expect(res.status).toBe(201);
      const body = (await res.json()) as ApiBody;
      expect(body.status).toBe(201);
      expect(body.message).toBe('Message sent');
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
