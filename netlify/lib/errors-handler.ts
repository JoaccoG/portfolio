import { json } from './utils';

export interface FieldError {
  field: string;
  message: string;
}

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
  readonly errors: FieldError[];

  constructor(status: number, message?: string, errors: FieldError[] = []) {
    super(message ?? STATUS_MESSAGES[status] ?? 'Internal Server Error');
    this.status = status;
    this.errors = errors;
  }
}

export const handleError = (error: unknown): Response => {
  if (error instanceof ApiError) {
    return json({ message: error.message, errors: error.errors }, error.status);
  }

  return json({ message: 'Internal Server Error', errors: [] }, 500);
};
