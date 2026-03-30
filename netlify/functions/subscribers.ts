import type { Config } from '@netlify/functions';
import { withApi } from '@api/middlewares/composer';
import { parseBody, subscriberSchema } from '@api/lib/schemas';
import { getEmailSender } from '@api/lib/emails-sender';
import { json } from '@api/lib/utils';

export const config: Config = {
  path: '/api/subscribers',
  method: 'POST',
  rateLimit: { windowLimit: 3, windowSize: 60, aggregateBy: ['ip'] }
};

export default withApi(async (req) => {
  const { email } = await parseBody(req, subscriberSchema);

  const sender = getEmailSender();
  await sender.addSubscriber({ email });

  return json({ success: true }, 201);
});
