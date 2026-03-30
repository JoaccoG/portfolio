import type { Config } from '@netlify/functions';
import { withApi } from '@api/middlewares/composer';
import { parseBody, contactSchema } from '@api/lib/schemas';
import { getEmailSender } from '@api/lib/emails-sender';
import { json } from '@api/lib/utils';

export const config: Config = {
  path: '/api/contact',
  method: 'POST',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip'] }
};

export default withApi(async (req) => {
  const { subject, message, email } = await parseBody(req, contactSchema);

  const sender = getEmailSender();
  await sender.sendEmail({ subject, message, replyTo: email });

  return json({ success: true }, 201);
});
