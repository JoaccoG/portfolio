import { ApiError } from './errors-handler';

export const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new ApiError(500, 'Server configuration error');
  return value;
};

export const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify({ status, ...body }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
