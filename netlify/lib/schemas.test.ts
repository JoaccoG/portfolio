import { ApiError } from '@api/lib/errors-handler';
import { parseBody, contactSchema, subscriberSchema } from '@api/lib/schemas';

const makeRequest = (body: unknown) =>
  new Request('https://test.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

describe('Given parseBody', () => {
  describe('When the body is not valid JSON', () => {
    it('Then it should throw ApiError(400)', async () => {
      const req = new Request('https://test.com', { method: 'POST', body: 'not json' });
      await expect(parseBody(req, contactSchema)).rejects.toThrow(new ApiError(400, 'Invalid JSON body'));
    });
  });

  describe('When the body fails schema validation', () => {
    it('Then it should throw ApiError(422) with field errors', async () => {
      const req = makeRequest({ email: 'bad', subject: '', message: '' });

      try {
        await parseBody(req, contactSchema);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        const apiError = error as ApiError;
        expect(apiError.status).toBe(422);
        expect(apiError.message).toBe('Validation failed');
        expect(apiError.errors).toBeDefined();
        expect(apiError.errors?.email).toBeDefined();
      }
    });
  });
});

describe('Given contactSchema', () => {
  it('Then it should accept valid input', async () => {
    const req = makeRequest({ email: 'user@example.com', subject: 'Hello', message: 'Hi there' });
    const result = await parseBody(req, contactSchema);
    expect(result).toEqual({ email: 'user@example.com', subject: 'Hello', message: 'Hi there' });
  });

  it('Then it should trim whitespace', async () => {
    const req = makeRequest({ email: '  user@example.com  ', subject: '  Hello  ', message: '  Hi  ' });
    const result = await parseBody(req, contactSchema);
    expect(result).toEqual({ email: 'user@example.com', subject: 'Hello', message: 'Hi' });
  });

  it('Then it should reject invalid email', async () => {
    const req = makeRequest({ email: 'not-email', subject: 'Hi', message: 'Msg' });
    await expect(parseBody(req, contactSchema)).rejects.toThrow(ApiError);
  });

  it('Then it should reject missing fields', async () => {
    const req = makeRequest({ email: 'user@example.com' });
    await expect(parseBody(req, contactSchema)).rejects.toThrow(ApiError);
  });

  it('Then it should reject subject exceeding 200 characters', async () => {
    const req = makeRequest({ email: 'user@example.com', subject: 'x'.repeat(201), message: 'Msg' });
    await expect(parseBody(req, contactSchema)).rejects.toThrow(ApiError);
  });

  it('Then it should reject message exceeding 5000 characters', async () => {
    const req = makeRequest({ email: 'user@example.com', subject: 'Hi', message: 'x'.repeat(5001) });
    await expect(parseBody(req, contactSchema)).rejects.toThrow(ApiError);
  });

  it('Then it should reject empty subject after trim', async () => {
    const req = makeRequest({ email: 'user@example.com', subject: '   ', message: 'Msg' });
    await expect(parseBody(req, contactSchema)).rejects.toThrow(ApiError);
  });
});

describe('Given subscriberSchema', () => {
  it('Then it should accept a valid email', async () => {
    const req = makeRequest({ email: 'user@example.com' });
    const result = await parseBody(req, subscriberSchema);
    expect(result).toEqual({ email: 'user@example.com' });
  });

  it('Then it should trim whitespace', async () => {
    const req = makeRequest({ email: '  user@example.com  ' });
    const result = await parseBody(req, subscriberSchema);
    expect(result).toEqual({ email: 'user@example.com' });
  });

  it('Then it should reject invalid email', async () => {
    const req = makeRequest({ email: 'not-valid' });
    await expect(parseBody(req, subscriberSchema)).rejects.toThrow(ApiError);
  });

  it('Then it should reject non-string email', async () => {
    const req = makeRequest({ email: 123 });
    await expect(parseBody(req, subscriberSchema)).rejects.toThrow(ApiError);
  });
});
