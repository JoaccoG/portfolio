import { renderHook, act, waitFor } from '@testing-library/react';
import { useNewsletterForm } from './useNewsletterForm';

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
  json: () => Promise.resolve({ status: 201, message: 'Subscribed', ...body })
});

const makeErrorResponse = (status: number, body: object) => ({
  ok: false,
  status,
  json: () => Promise.resolve({ status, ...body })
});

const makeAlreadySubscribedResponse = () => ({
  ok: false,
  status: 409,
  json: () => Promise.resolve({ status: 409, message: 'Email already subscribed.' })
});

describe('Given the useNewsletterForm hook', () => {
  describe('When initially mounted', () => {
    it('Then email should be empty', () => {
      const { result } = renderHook(() => useNewsletterForm());
      expect(result.current.email).toBe('');
    });

    it('Then error should be null', () => {
      const { result } = renderHook(() => useNewsletterForm());
      expect(result.current.error).toBeNull();
    });

    it('Then status should be idle', () => {
      const { result } = renderHook(() => useNewsletterForm());
      expect(result.current.status).toBe('idle');
    });

    it('Then serverError should be null', () => {
      const { result } = renderHook(() => useNewsletterForm());
      expect(result.current.serverError).toBeNull();
    });

    it('Then warning should be null', () => {
      const { result } = renderHook(() => useNewsletterForm());
      expect(result.current.warning).toBeNull();
    });

    it('Then successMessage should be null', () => {
      const { result } = renderHook(() => useNewsletterForm());
      expect(result.current.successMessage).toBeNull();
    });
  });

  describe('When handleChange is called', () => {
    it('Then it should update the email value', () => {
      const { result } = renderHook(() => useNewsletterForm());
      act(() => result.current.handleChange('test@example.com'));
      expect(result.current.email).toBe('test@example.com');
    });

    it('Then it should clear existing validation error', () => {
      const { result } = renderHook(() => useNewsletterForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.error).toBe('Email is required');

      act(() => result.current.handleChange('test@example.com'));
      expect(result.current.error).toBeNull();
    });

    it('Then it should clear serverError', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Server error' }));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.serverError).toBe('Server error');

      act(() => result.current.handleChange('new@example.com'));
      expect(result.current.serverError).toBeNull();
    });

    it('Then it should clear warning', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.warning).toBe('Email already subscribed.');

      act(() => result.current.handleChange('new@example.com'));
      expect(result.current.warning).toBeNull();
    });
  });

  describe('When handleSubmit is called with invalid email', () => {
    it('Then it should set required error when email is empty', () => {
      const { result } = renderHook(() => useNewsletterForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.error).toBe('Email is required');
    });

    it('Then it should set required error when email is whitespace only', () => {
      const { result } = renderHook(() => useNewsletterForm());
      act(() => result.current.handleChange('   '));
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.error).toBe('Email is required');
    });

    it('Then it should set format error for invalid email', () => {
      const { result } = renderHook(() => useNewsletterForm());
      act(() => result.current.handleChange('notanemail'));
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.error).toBe('Invalid email format');
    });

    it('Then it should not call fetch', () => {
      const { result } = renderHook(() => useNewsletterForm());
      act(() => {
        result.current.handleSubmit();
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('When handleSubmit is called while status is not idle', () => {
    it('Then it should ignore submit during success state', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('success');

      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('When handleSubmit succeeds', () => {
    it('Then status should become success', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.status).toBe('success');
    });

    it('Then successMessage should be set from the API response', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse({ message: 'Subscribed!' }));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.successMessage).toBe('Subscribed!');
    });

    it('Then email should be cleared', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.email).toBe('');
    });

    it('Then it should send a POST to /api/subscribers with the trimmed email', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('  test@example.com  '));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      });
    });

    it('Then status should NOT auto-reset to idle', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('success');

      act(() => vi.advanceTimersByTime(5000));
      expect(result.current.status).toBe('success');
      vi.useRealTimers();
    });
  });

  describe('When the API returns a 409 (already subscribed)', () => {
    it('Then it should set warning with the API message', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.warning).toBe('Email already subscribed.');
    });

    it('Then status should return to idle', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.status).toBe('idle');
    });

    it('Then it should not set serverError or error', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.serverError).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('Then it should fall back to a default warning when API message is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ status: 409, message: '' })
      });
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.warning).toBe('Email already subscribed.');
    });
  });

  describe('When handleSubmit receives a non-ok response with email field error', () => {
    it('Then it should set the email error from the API', async () => {
      mockFetch.mockResolvedValueOnce(
        makeErrorResponse(422, {
          message: 'Validation failed',
          errors: [{ field: 'email', message: 'Invalid email format' }]
        })
      );
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.error).toBe('Invalid email format');
      expect(result.current.status).toBe('error');
    });
  });

  describe('When handleSubmit receives a non-ok response without field errors', () => {
    it('Then it should set serverError with the response message', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Internal server error' }));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.serverError).toBe('Internal server error');
      expect(result.current.status).toBe('error');
    });

    it('Then it should fall back to a generic message when message is empty', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: '' }));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.serverError).toBe('Something went wrong. Try again.');
    });

    it('Then error status should reset to idle after 2s', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Error' }));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('error');

      act(() => vi.advanceTimersByTime(2000));
      expect(result.current.status).toBe('idle');
      vi.useRealTimers();
    });
  });

  describe('When the network request fails', () => {
    it('Then it should set a generic serverError', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.serverError).toBe('Something went wrong. Try again.');
      expect(result.current.status).toBe('error');
    });
  });

  describe('When the response json parsing fails', () => {
    it('Then it should fall back gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('JSON parse error'))
      });
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });
    });
  });

  describe('When reset is called', () => {
    it('Then it should clear all state back to initial values', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('success');
      expect(result.current.successMessage).toBeTruthy();

      act(() => result.current.reset());

      expect(result.current.email).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.status).toBe('idle');
      expect(result.current.serverError).toBeNull();
      expect(result.current.warning).toBeNull();
      expect(result.current.successMessage).toBeNull();
    });

    it('Then it should cancel the auto-reset timer', async () => {
      vi.useFakeTimers();
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Error' }));
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.status).toBe('error');

      act(() => result.current.reset());
      expect(result.current.status).toBe('idle');

      act(() => vi.advanceTimersByTime(2000));
      expect(result.current.status).toBe('idle');
      vi.useRealTimers();
    });

    it('Then it should clear warning state', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const { result } = renderHook(() => useNewsletterForm());

      act(() => result.current.handleChange('test@example.com'));
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(result.current.warning).toBeTruthy();

      act(() => result.current.reset());
      expect(result.current.warning).toBeNull();
    });
  });
});
