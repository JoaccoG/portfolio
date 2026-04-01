import type { Context } from '@netlify/functions';
import { withErrorHandler } from './withErrorHandler';

export type Handler = (req: Request, context: Context) => Promise<Response>;

export const withApi = (handler: Handler): Handler => {
  return withErrorHandler(handler);
};
