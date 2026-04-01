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

abstract class EmailSender {
  abstract sendEmail(params: SendEmailParams): Promise<void>;
  abstract addSubscriber(params: AddSubscriberParams): Promise<void>;
}

class ResendEmailSender extends EmailSender {
  #client: Resend;

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
    if (error) throw new ApiError(502, 'Failed to send email');
  }

  async addSubscriber({ email }: AddSubscriberParams): Promise<void> {
    const { error } = await this.#client.contacts.create({
      audienceId: requireEnv('RESEND__AUDIENCE_ID'),
      email,
      unsubscribed: false
    });
    if (error) throw new ApiError(502, 'Failed to subscribe');
  }
}

let instance: EmailSender | null = null;

export const getEmailSender = (): EmailSender => {
  instance ??= new ResendEmailSender(requireEnv('RESEND__API_KEY'));
  return instance;
};
