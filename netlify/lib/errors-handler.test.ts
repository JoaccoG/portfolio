import { ApiError, handleError } from './errors-handler';

describe('Given ApiError', () => {
  it('Then it should use the provided message', () => {
    const error = new ApiError(400, 'Custom message');
    expect(error.message).toBe('Custom message');
    expect(error.status).toBe(400);
  });

  it('Then it should fallback to STATUS_MESSAGES when no message provided', () => {
    expect(new ApiError(400).message).toBe('Bad Request');
    expect(new ApiError(401).message).toBe('Unauthorized');
    expect(new ApiError(404).message).toBe('Not Found');
    expect(new ApiError(422).message).toBe('Unprocessable Entity');
    expect(new ApiError(500).message).toBe('Internal Server Error');
    expect(new ApiError(502).message).toBe('Bad Gateway');
  });

  it('Then it should fallback to "Internal Server Error" for unknown status codes', () => {
    expect(new ApiError(999).message).toBe('Internal Server Error');
  });

  it('Then it should default errors to an empty array', () => {
    expect(new ApiError(500).errors).toEqual([]);
  });

  it('Then it should store field errors when provided', () => {
    const errors = [{ field: 'email', message: 'Invalid email format' }];
    const error = new ApiError(422, 'Validation failed', errors);
    expect(error.errors).toEqual(errors);
  });

  it('Then it should be an instance of Error', () => {
    expect(new ApiError(500)).toBeInstanceOf(Error);
  });
});

describe('Given handleError', () => {
  describe('When called with an ApiError', () => {
    it('Then it should return a JSON response with status, message, and empty errors', async () => {
      const res = handleError(new ApiError(429));
      expect(res.status).toBe(429);
      expect(await res.json()).toEqual({ status: 429, message: 'Too Many Requests', errors: [] });
    });

    it('Then it should include field errors when present', async () => {
      const errors = [{ field: 'email', message: 'Required' }];
      const res = handleError(new ApiError(422, 'Validation failed', errors));
      expect(await res.json()).toEqual({ status: 422, message: 'Validation failed', errors });
    });
  });

  describe('When called with a non-ApiError', () => {
    it('Then it should return 500 with empty errors', async () => {
      const res = handleError(new Error('random'));
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ status: 500, message: 'Internal Server Error', errors: [] });
    });

    it('Then it should handle non-Error values', async () => {
      const res = handleError('string error');
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ status: 500, message: 'Internal Server Error', errors: [] });
    });
  });
});
