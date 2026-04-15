import { Resend } from 'resend';
import { requireEnv } from './utils';
import { ApiError } from './errors-handler';

interface SendEmailParams {
  replyTo: string;
  subject: string;
  message: string;
}

interface AddSubscriberParams {
  email: string;
}

interface ResendError {
  name: string;
  statusCode: number | null;
  message: string;
}

const DAILY_QUOTA_ERROR = 'daily_quota_exceeded';

export const getTimeUntilDailyReset = (): string => {
  const now = new Date();
  const nextMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const totalMinutes = Math.ceil((nextMidnightUTC.getTime() - now.getTime()) / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;
  return `${hours} hours and ${minutes} minutes`;
};

const throwIfResendError = (error: ResendError | null, fallbackMessage: string): void => {
  if (!error) return;

  if (error.name === DAILY_QUOTA_ERROR)
    throw new ApiError(429, `Daily usage reached, please try again in ${getTimeUntilDailyReset()}`);

  throw new ApiError(502, fallbackMessage);
};

abstract class EmailSender {
  abstract sendEmail(params: SendEmailParams): Promise<void>;
  abstract addSubscriber(params: AddSubscriberParams): Promise<void>;
}

class ResendEmailSender extends EmailSender {
  readonly #client: Resend;

  constructor(apiKey: string) {
    super();
    this.#client = new Resend(apiKey);
  }

  async sendEmail({ replyTo, subject, message }: SendEmailParams): Promise<void> {
    const { error } = await this.#client.emails.send({
      from: requireEnv('EMAILS__FROM'),
      to: requireEnv('EMAILS__RECIPIENT'),
      replyTo,
      subject,
      text: message
    });
    throwIfResendError(error, 'Failed to send email');
  }

  async addSubscriber({ email }: AddSubscriberParams): Promise<void> {
    const audienceId = requireEnv('RESEND__AUDIENCE_ID');

    const { data: existing, error: getError } = await this.#client.contacts.get({ audienceId, email });
    if (getError && getError.name !== 'not_found') throwIfResendError(getError, 'Failed to check subscription status');
    if (existing) throw new ApiError(409, 'Email already subscribed.');

    const { error } = await this.#client.contacts.create({
      audienceId,
      email,
      unsubscribed: false
    });
    throwIfResendError(error, 'Failed to subscribe');
  }
}

let instance: EmailSender | null = null;

export const getEmailSender = (): EmailSender => {
  instance ??= new ResendEmailSender(requireEnv('RESEND__API_KEY'));
  return instance;
};
