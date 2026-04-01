const mockSend = vi.fn();
const mockCreate = vi.fn();

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
    contacts = { create: mockCreate };
  }
}));

beforeEach(() => {
  vi.stubEnv('RESEND__API_KEY', 'test-key');
  vi.stubEnv('EMAILS__FROM', 'Test <test@example.com>');
  vi.stubEnv('EMAILS__RECIPIENT', 'recipient@example.com');
  vi.stubEnv('RESEND__AUDIENCE_ID', 'test-audience-id');
  mockSend.mockReset();
  mockCreate.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const importSender = async () => {
  const { getEmailSender } = await import('./emails-sender');
  return getEmailSender();
};

describe('Given getEmailSender', () => {
  it('Then it should return an EmailSender instance', async () => {
    const sender = await importSender();
    expect(sender).toBeDefined();
    expect(typeof sender.sendEmail).toBe('function');
    expect(typeof sender.addSubscriber).toBe('function');
  });

  it('Then it should return the same instance on subsequent calls (singleton)', async () => {
    const { getEmailSender } = await import('./emails-sender');
    const first = getEmailSender();
    const second = getEmailSender();
    expect(first).toBe(second);
  });

  it('Then it should throw ApiError(500) when RESEND__API_KEY is missing', async () => {
    vi.stubEnv('RESEND__API_KEY', '');
    await expect(importSender()).rejects.toMatchObject({ status: 500, message: 'Server configuration error' });
  });
});

describe('Given sendEmail', () => {
  it('Then it should call Resend emails.send with correct params', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'email-id' }, error: null });
    const sender = await importSender();

    await sender.sendEmail({ replyTo: 'user@example.com', subject: 'Hello', message: 'Hi' });

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Test <test@example.com>',
      to: 'recipient@example.com',
      replyTo: 'user@example.com',
      subject: 'Hello',
      text: 'Hi'
    });
  });

  it('Then it should throw ApiError(502) when Resend returns an error', async () => {
    mockSend.mockResolvedValueOnce({ error: { message: 'Send failed' } });
    const sender = await importSender();

    await expect(sender.sendEmail({ replyTo: 'u@e.com', subject: 'Hi', message: 'Msg' })).rejects.toMatchObject({
      status: 502,
      message: 'Failed to send email'
    });
  });
});

describe('Given addSubscriber', () => {
  it('Then it should call Resend contacts.create with correct params', async () => {
    mockCreate.mockResolvedValueOnce({ data: { id: 'contact-id' }, error: null });
    const sender = await importSender();

    await sender.addSubscriber({ email: 'user@example.com' });

    expect(mockCreate).toHaveBeenCalledWith({
      audienceId: 'test-audience-id',
      email: 'user@example.com',
      unsubscribed: false
    });
  });

  it('Then it should throw ApiError(502) when Resend returns an error', async () => {
    mockCreate.mockResolvedValueOnce({ error: { message: 'Create failed' } });
    const sender = await importSender();

    await expect(sender.addSubscriber({ email: 'u@e.com' })).rejects.toMatchObject({
      status: 502,
      message: 'Failed to subscribe'
    });
  });
});
