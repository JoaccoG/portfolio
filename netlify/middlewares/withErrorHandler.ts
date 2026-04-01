import { ApiError } from '../lib/errors-handler';
import { json } from '../lib/utils';
import type { Handler } from './composer';

export const withErrorHandler =
  (handler: Handler): Handler =>
  async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ApiError) return json({ message: error.message, errors: error.errors }, error.status);

      return json({ message: 'Internal Server Error', errors: [] }, 500);
    }
  };
