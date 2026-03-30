import { ApiError, handleError } from '@api/lib/errors-handler';

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

  it('Then it should store the errors object when provided', () => {
    const errors = { email: ['Invalid email format'] };
    const error = new ApiError(422, 'Validation failed', errors);
    expect(error.errors).toEqual(errors);
  });

  it('Then it should be an instance of Error', () => {
    expect(new ApiError(500)).toBeInstanceOf(Error);
  });
});

describe('Given handleError', () => {
  describe('When called with an ApiError', () => {
    it('Then it should return a JSON response with the correct status and message', async () => {
      const res = handleError(new ApiError(422, 'Validation failed'));
      expect(res.status).toBe(422);
      expect(await res.json()).toEqual({ message: 'Validation failed' });
    });

    it('Then it should include errors when present', async () => {
      const errors = { email: ['Required'] };
      const res = handleError(new ApiError(422, 'Validation failed', errors));
      expect(await res.json()).toEqual({ message: 'Validation failed', errors });
    });
  });

  describe('When called with a non-ApiError', () => {
    it('Then it should return 500 Internal Server Error', async () => {
      const res = handleError(new Error('random'));
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ message: 'Internal Server Error' });
    });

    it('Then it should handle non-Error values', async () => {
      const res = handleError('string error');
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ message: 'Internal Server Error' });
    });
  });
});
