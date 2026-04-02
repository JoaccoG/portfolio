import type { InferOutput, BaseSchema, BaseIssue } from 'valibot';
import { object, pipe, optional, string, trim, email, minLength, maxLength, safeParse, flatten } from 'valibot';
import { ApiError, type FieldError } from './errors-handler';

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
    const errors: FieldError[] = Object.entries(flat.nested ?? {}).flatMap(([field, messages]) =>
      (messages ?? []).map((message) => ({ field, message }))
    );
    throw new ApiError(422, 'Validation failed', errors);
  }

  return result.output;
};

export type ContactInput = InferOutput<typeof contactSchema>;
export const contactSchema = object({
  email: pipe(string(), trim(), email('Invalid email format')),
  subject: optional(pipe(string(), trim(), maxLength(200, 'Maximum 200 characters')), 'Portfolio Contact Email'),
  message: pipe(string(), trim(), minLength(1, 'Required'), maxLength(5000, 'Maximum 5000 characters'))
});

export type SubscriberInput = InferOutput<typeof subscriberSchema>;
export const subscriberSchema = object({
  email: pipe(string(), trim(), email('Invalid email format'))
});
