import { useState, useCallback, useEffect, useRef } from 'react';
import { track } from '@lib/analytics';

export type NewsletterStatus = 'idle' | 'sending' | 'success' | 'error';

const ERROR_RESET_MS = 2000;
const ALREADY_SUBSCRIBED_STATUS = 409;
const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

interface ApiResponse {
  status: number;
  message: string;
  errors?: { field: string; message: string }[];
}

const extractEmailError = (apiErrors: ApiResponse['errors']): string | null => {
  if (!apiErrors?.length) return null;

  return apiErrors.find((e) => e.field === 'email')?.message ?? null;
};

export const useNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<NewsletterStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (status === 'error') resetTimer.current = setTimeout(() => setStatus('idle'), ERROR_RESET_MS);

    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [status]);

  const handleChange = useCallback((value: string) => {
    setEmail(value);
    setError(null);
    setServerError(null);
    setWarning(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (status !== 'idle') return;

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Email is required');

      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Invalid email format');

      return;
    }

    setError(null);
    setServerError(null);
    setWarning(null);
    setStatus('sending');

    try {
      track('newsletter-subscribe-attempted', { email: trimmed });
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed })
      });

      if (res.status === ALREADY_SUBSCRIBED_STATUS) {
        const body: ApiResponse = await res.json().catch(() => ({ status: res.status, message: '' }));
        setWarning(body.message || 'Email already subscribed.');
        setStatus('idle');

        return;
      }

      if (!res.ok) {
        const body: ApiResponse = await res.json().catch(() => ({ status: res.status, message: '' }));
        const emailError = extractEmailError(body.errors);

        if (emailError) setError(emailError);
        else setServerError(body.message || 'Something went wrong. Try again.');

        setStatus('error');

        return;
      }

      const body: ApiResponse = await res.json().catch(() => ({ status: res.status, message: 'Subscribed!' }));
      setSuccessMessage(body.message);
      setStatus('success');
      setEmail('');
      track('newsletter-subscribed', { email: trimmed });
    } catch {
      setServerError('Something went wrong. Try again.');
      setStatus('error');
    }
  }, [email, status]);

  const reset = useCallback(() => {
    setEmail('');
    setError(null);
    setServerError(null);
    setWarning(null);
    setSuccessMessage(null);
    setStatus('idle');
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  return { email, error, status, serverError, warning, successMessage, handleChange, handleSubmit, reset };
};
