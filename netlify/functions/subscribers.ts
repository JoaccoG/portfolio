import type { Config } from '@netlify/functions';
import { withApi } from '../middlewares/composer';
import { parseBody, subscriberSchema } from '../lib/schemas';
import { getEmailSender } from '../lib/emails-sender';
import { json } from '../lib/utils';

export const config: Config = {
  path: '/api/subscribers',
  method: 'POST',
  rateLimit: { windowLimit: 3, windowSize: 60, aggregateBy: ['ip'] }
};

export default withApi(async (req) => {
  const { email } = await parseBody(req, subscriberSchema);

  const sender = getEmailSender();
  await sender.addSubscriber({ email });

  return json({ message: 'Subscribed' }, 201);
});
