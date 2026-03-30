import { json } from '@api/lib/utils';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway'
};

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(status: number, message?: string, errors?: Record<string, string[]>) {
    super(message ?? STATUS_MESSAGES[status] ?? 'Internal Server Error');
    this.status = status;
    this.errors = errors;
  }
}

export const handleError = (error: unknown): Response => {
  if (error instanceof ApiError) {
    const body: Record<string, unknown> = { message: error.message };
    if (error.errors) body.errors = error.errors;
    return json(body, error.status);
  }

  return json({ message: 'Internal Server Error' }, 500);
};
