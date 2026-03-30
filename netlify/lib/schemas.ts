import type { InferOutput, BaseSchema, BaseIssue } from 'valibot';
import { object, pipe, string, trim, email, minLength, maxLength, safeParse, flatten } from 'valibot';
import { ApiError } from '@api/lib/errors-handler';

export const parseBody = async <TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  req: Request,
  schema: TSchema
): Promise<InferOutput<TSchema>> => {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError(400, 'Invalid JSON body');
  }

  const result = safeParse(schema, raw);
  if (!result.success) {
    const flat = flatten(result.issues);
    throw new ApiError(422, 'Validation failed', flat.nested as Record<string, string[]>);
  }

  return result.output;
};

export type ContactInput = InferOutput<typeof contactSchema>;
export const contactSchema = object({
  email: pipe(string(), trim(), email('Invalid email format')),
  subject: pipe(string(), trim(), minLength(1, 'Required'), maxLength(200, 'Subject too long')),
  message: pipe(string(), trim(), minLength(1, 'Required'), maxLength(5000, 'Message too long'))
});

export type SubscriberInput = InferOutput<typeof subscriberSchema>;
export const subscriberSchema = object({
  email: pipe(string(), trim(), email('Invalid email format'))
});
