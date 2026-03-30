import type { Context } from '@netlify/functions';
import { withErrorHandler } from '@api/middlewares/withErrorHandler';

export type Handler = (req: Request, context: Context) => Promise<Response>;

export const withApi = (handler: Handler): Handler => {
  return withErrorHandler(handler);
};
