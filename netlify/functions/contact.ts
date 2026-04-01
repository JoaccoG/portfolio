import type { Config } from '@netlify/functions';
import { withApi } from '../middlewares/composer';
import { parseBody, contactSchema } from '../lib/schemas';
import { getEmailSender } from '../lib/emails-sender';
import { json } from '../lib/utils';

export const config: Config = {
  path: '/api/contact',
  method: 'POST',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip'] }
};

export default withApi(async (req) => {
  const { subject, message, email } = await parseBody(req, contactSchema);

  const sender = getEmailSender();
  await sender.sendEmail({ subject: subject || 'Portfolio Contact Email', message, replyTo: email });

  return json({ message: 'Message sent' }, 201);
});
