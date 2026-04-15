const mockSend = vi.fn();
const mockCreate = vi.fn();
const mockGet = vi.fn();

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend };
    contacts = { create: mockCreate, get: mockGet };
  }
}));

beforeEach(() => {
  vi.stubEnv('RESEND__API_KEY', 'test-key');
  vi.stubEnv('EMAILS__FROM', 'Test <test@example.com>');
  vi.stubEnv('EMAILS__RECIPIENT', 'recipient@example.com');
  vi.stubEnv('RESEND__AUDIENCE_ID', 'test-audience-id');
  mockSend.mockReset();
  mockCreate.mockReset();
  mockGet.mockReset();
  mockGet.mockResolvedValue({ data: null, error: { name: 'not_found', message: 'Not found', statusCode: 404 } });
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
    mockSend.mockResolvedValueOnce({ error: { name: 'application_error', message: 'Send failed', statusCode: 500 } });
    const sender = await importSender();

    await expect(sender.sendEmail({ replyTo: 'u@e.com', subject: 'Hi', message: 'Msg' })).rejects.toMatchObject({
      status: 502,
      message: 'Failed to send email'
    });
  });

  it('Then it should throw ApiError(429) with time-until-reset when daily quota is exceeded', async () => {
    mockSend.mockResolvedValueOnce({
      error: { name: 'daily_quota_exceeded', message: 'Daily quota exceeded', statusCode: 429 }
    });
    const sender = await importSender();

    await expect(sender.sendEmail({ replyTo: 'u@e.com', subject: 'Hi', message: 'Msg' })).rejects.toMatchObject({
      status: 429,
      message: expect.stringMatching(/^Daily usage reached, please try again in .+/)
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

  it('Then it should check if the contact already exists before creating', async () => {
    mockCreate.mockResolvedValueOnce({ data: { id: 'contact-id' }, error: null });
    const sender = await importSender();

    await sender.addSubscriber({ email: 'user@example.com' });

    expect(mockGet).toHaveBeenCalledWith({ audienceId: 'test-audience-id', email: 'user@example.com' });
    expect(mockGet.mock.invocationCallOrder[0]).toBeLessThan(mockCreate.mock.invocationCallOrder[0]);
  });

  it('Then it should throw ApiError(409) when the contact already exists', async () => {
    mockGet.mockResolvedValueOnce({
      data: { id: 'existing-id', email: 'u@e.com', created_at: '2026-01-01', unsubscribed: false },
      error: null
    });
    const sender = await importSender();

    await expect(sender.addSubscriber({ email: 'u@e.com' })).rejects.toMatchObject({
      status: 409,
      message: 'Email already subscribed.'
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('Then it should throw ApiError(502) when Resend returns an error', async () => {
    mockCreate.mockResolvedValueOnce({
      error: { name: 'application_error', message: 'Create failed', statusCode: 500 }
    });
    const sender = await importSender();

    await expect(sender.addSubscriber({ email: 'u@e.com' })).rejects.toMatchObject({
      status: 502,
      message: 'Failed to subscribe'
    });
  });

  it('Then it should throw ApiError(429) with time-until-reset when daily quota is exceeded', async () => {
    mockCreate.mockResolvedValueOnce({
      error: { name: 'daily_quota_exceeded', message: 'Daily quota exceeded', statusCode: 429 }
    });
    const sender = await importSender();

    await expect(sender.addSubscriber({ email: 'u@e.com' })).rejects.toMatchObject({
      status: 429,
      message: expect.stringMatching(/^Daily usage reached, please try again in .+/)
    });
  });
});

describe('Given getTimeUntilDailyReset', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('Then it should return hours and minutes until next midnight UTC', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-01T15:22:00Z'));
    const { getTimeUntilDailyReset } = await import('./emails-sender');
    expect(getTimeUntilDailyReset()).toBe('8 hours and 38 minutes');
  });

  it('Then it should return only minutes when less than an hour remains', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-01T23:30:00Z'));
    const { getTimeUntilDailyReset } = await import('./emails-sender');
    expect(getTimeUntilDailyReset()).toBe('30 minutes');
  });

  it('Then it should return only hours when minutes are exactly zero', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-01T22:00:00Z'));
    const { getTimeUntilDailyReset } = await import('./emails-sender');
    expect(getTimeUntilDailyReset()).toBe('2 hours');
  });
});
