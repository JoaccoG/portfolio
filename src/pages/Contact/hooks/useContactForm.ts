import { useState, useCallback, useEffect, useRef } from 'react';
import { track } from '@lib/analytics';

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export interface ContactFields {
  email: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const INITIAL_FIELDS: ContactFields = { email: '', subject: '', message: '' };
const STATUS_RESET_MS = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (fields: ContactFields): FieldErrors => {
  const errors: FieldErrors = {};

  const email = fields.email.trim();
  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Invalid email format';

  if (!fields.message.trim()) errors.message = 'Message is required';

  return errors;
};

const hasErrors = (errors: FieldErrors): boolean => Object.keys(errors).length > 0;

interface ApiResponse {
  status: number;
  message: string;
  errors?: { field: string; message: string }[];
}

const mapFieldErrors = (apiErrors: ApiResponse['errors']): FieldErrors => {
  if (!apiErrors?.length) return {};

  return apiErrors.reduce<FieldErrors>((acc, { field, message }) => {
    if (field in INITIAL_FIELDS) acc[field as keyof ContactFields] = message;

    return acc;
  }, {});
};

export const useContactForm = () => {
  const [fields, setFields] = useState<ContactFields>(INITIAL_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      resetTimer.current = setTimeout(() => setStatus('idle'), STATUS_RESET_MS);
    }

    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [status]);

  const handleChange = useCallback((field: keyof ContactFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];

      return next;
    });
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (status !== 'idle') return;

    track('contact-attempted', {
      fields: JSON.stringify({
        email: fields.email.trim() || 'empty',
        subject: fields.subject.trim() || 'empty',
        message: fields.message.trim() || 'empty'
      })
    });

    const fieldErrors = validate(fields);
    if (hasErrors(fieldErrors)) {
      setErrors(fieldErrors);

      return;
    }

    setErrors({});
    setServerError(null);
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fields.email.trim(),
          ...(fields.subject.trim() && { subject: fields.subject.trim() }),
          message: fields.message.trim()
        })
      });

      if (!res.ok) {
        const body: ApiResponse = await res.json().catch(() => ({ status: res.status, message: '' }));
        const mapped = mapFieldErrors(body.errors);

        if (hasErrors(mapped)) setErrors(mapped);
        else setServerError(body.message || 'Something went wrong. Try again.');

        setStatus('error');
        track('contact-failed', { error: JSON.stringify({ status: body.status, message: body.message }) });

        return;
      }

      const body: ApiResponse = await res.json().catch(() => ({ status: res.status, message: 'Message sent!' }));
      setSuccessMessage(body.message);
      setStatus('success');
      setFields(INITIAL_FIELDS);
      track('contact-succeeded', { email: fields.email.trim() });
    } catch {
      setServerError('Something went wrong. Try again.');
      setStatus('error');
    }
  }, [fields, status]);

  return { fields, errors, status, serverError, successMessage, handleChange, handleSubmit };
};
