import { renderHook, act, waitFor } from '@testing-library/react';
import { useContactForm } from './useContactForm';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const makeOkResponse = (body = {}) => ({
  ok: true,
  json: () => Promise.resolve({ status: 200, message: 'Message sent!', ...body })
});

const makeErrorResponse = (status: number, body: object) => ({
  ok: false,
  json: () => Promise.resolve({ status, ...body })
});

describe('Given the useContactForm hook', () => {
  describe('When initially mounted', () => {
    it('Then fields should be empty', () => {
      const { result } = renderHook(() => useContactForm());
      expect(result.current.fields).toEqual({ email: '', subject: '', message: '' });
    });

    it('Then there should be no errors', () => {
      const { result } = renderHook(() => useContactForm());
      expect(result.current.errors).toEqual({});
    });

    it('Then status should be idle', () => {
      const { result } = renderHook(() => useContactForm());
      expect(result.current.status).toBe('idle');
    });

    it('Then serverError should be null', () => {
      const { result } = renderHook(() => useContactForm());
      expect(result.current.serverError).toBeNull();
    });
  });

  describe('When handleChange is called', () => {
    it('Then it should update the specified field', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });
      expect(result.current.fields.email).toBe('test@example.com');
    });

    it('Then it should clear the existing error for the changed field', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.errors.email).toBeDefined();

      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });
      expect(result.current.errors.email).toBeUndefined();
    });

    it('Then it should not affect errors for other fields', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.errors.email).toBeDefined();

      act(() => {
        result.current.handleChange('subject', 'hello');
      });
      expect(result.current.errors.email).toBeDefined();
    });

    it('Then it should clear serverError', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Server error' }));
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.serverError).toBe('Server error');

      act(() => {
        result.current.handleChange('email', 'new@example.com');
      });
      expect(result.current.serverError).toBeNull();
    });
  });

  describe('When handleSubmit is called with invalid fields', () => {
    it('Then it should set email required error when email is empty', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.errors.email).toBe('Email is required');
    });

    it('Then it should set invalid email error for a bad format', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleChange('email', 'notanemail');
      });
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.errors.email).toBe('Invalid email format');
    });

    it('Then it should set message required error when message is empty', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleChange('email', 'test@example.com');
      });
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.errors.message).toBe('Message is required');
    });

    it('Then it should not call fetch', () => {
      const { result } = renderHook(() => useContactForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('When handleSubmit is called while status is not idle', () => {
    it('Then it should ignore submit during success cooldown', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('success');

      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      vi.useRealTimers();
    });

    it('Then it should ignore submit during error cooldown', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Error' }));
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('error');

      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      vi.useRealTimers();
    });
  });

  describe('When handleSubmit succeeds', () => {
    it('Then status should become success', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello world');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.status).toBe('success');
    });

    it('Then successMessage should be set from the API response', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse({ message: 'Message sent!' }));
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello world');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.successMessage).toBe('Message sent!');
    });

    it('Then fields should be reset to empty', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello world');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.fields).toEqual({ email: '', subject: '', message: '' });
    });

    it('Then status should reset to idle after 2s', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('success');

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.status).toBe('idle');
      vi.useRealTimers();
    });
  });

  describe('When handleSubmit receives a non-ok response with field errors', () => {
    it('Then it should map the API field errors to form errors', async () => {
      mockFetch.mockResolvedValueOnce(
        makeErrorResponse(422, {
          message: 'Validation failed',
          errors: [{ field: 'email', message: 'Invalid email format' }]
        })
      );
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors.email).toBe('Invalid email format');
      expect(result.current.status).toBe('error');
    });
  });

  describe('When handleSubmit receives a non-ok response without field errors', () => {
    it('Then it should set serverError with the response message', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Internal server error' }));
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.serverError).toBe('Internal server error');
      expect(result.current.status).toBe('error');
    });

    it('Then status should reset to idle after 2s', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Error' }));
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('error');

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.status).toBe('idle');
      vi.useRealTimers();
    });
  });

  describe('When the network request fails', () => {
    it('Then it should set a generic serverError', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.serverError).toBe('Something went wrong. Try again.');
      expect(result.current.status).toBe('error');
    });
  });

  describe('When the response json parsing fails', () => {
    it('Then it should fall back to a generic message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.reject(new Error('JSON parse error'))
      });
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });
    });
  });

  describe('When the subject field has a value', () => {
    it('Then it should include subject in the fetch body', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('subject', 'My subject');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          body: JSON.stringify({ email: 'test@example.com', subject: 'My subject', message: 'Hello' })
        })
      );
    });
  });

  describe('When the API error contains an unknown field', () => {
    it('Then it should ignore unknown fields and not map them to form errors', async () => {
      mockFetch.mockResolvedValueOnce(
        makeErrorResponse(422, {
          message: 'Validation failed',
          errors: [
            { field: 'email', message: 'Invalid email format' },
            { field: 'unknownField', message: 'Some error' }
          ]
        })
      );
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Hello');
      });
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors.email).toBe('Invalid email format');
      expect(result.current.errors).not.toHaveProperty('unknownField');
    });
  });
});
