import { handleError } from '@api/lib/errors-handler';
import type { Handler } from '@api/middlewares/composer';

export const withErrorHandler =
  (handler: Handler): Handler =>
  async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleError(error);
    }
  };
