import { render, screen, fireEvent } from '@testing-library/react';
import { CONTACT } from '@constants/content';
import { Contact } from './Contact';

const mockHandleChange = vi.fn();
const mockHandleSubmit = vi.fn();
let mockServerError: string | null = null;
let mockSuccessMessage: string | null = null;
let mockStatus = 'idle';

vi.mock('./hooks/useContactForm', () => ({
  useContactForm: () => ({
    fields: { email: '', subject: '', message: '' },
    errors: {},
    get status() {
      return mockStatus;
    },
    get serverError() {
      return mockServerError;
    },
    get successMessage() {
      return mockSuccessMessage;
    },
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit
  })
}));

vi.mock('gsap', () => ({
  default: { timeline: vi.fn(() => ({ fromTo: vi.fn().mockReturnThis() })) }
}));

vi.mock('@gsap/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');

  return { useGSAP: (cb: () => void) => useEffect(() => cb(), []) };
});

vi.mock('@components/Section/Section', async () => {
  const { forwardRef } = await vi.importActual<typeof import('react')>('react');

  return {
    Section: forwardRef<HTMLElement, { children: React.ReactNode; id?: string }>(({ children, id }, ref) => (
      <section ref={ref} id={id}>
        {children}
      </section>
    ))
  };
});

vi.mock('./components/FloatingField', () => ({
  FloatingField: ({ label, onChange }: { label: string; onChange: (v: string) => void }) => (
    <input data-testid={`field-${label}`} onChange={(e) => onChange(e.target.value)} />
  )
}));

vi.mock('./components/SubmitButton', () => ({
  SubmitButton: ({ status }: { status: string }) => (
    <button type="submit" data-testid="submit-button" data-status={status}>
      submit
    </button>
  )
}));

describe('Given the Contact page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServerError = null;
    mockSuccessMessage = null;
    mockStatus = 'idle';
  });

  describe('When rendered', () => {
    it('Then it should render a section with id "contact"', () => {
      render(<Contact />);
      expect(document.getElementById('contact')).toBeInTheDocument();
    });

    it('Then it should render the title', () => {
      render(<Contact />);
      expect(screen.getByText(CONTACT.title)).toBeInTheDocument();
    });

    it('Then it should render the subtitle', () => {
      render(<Contact />);
      expect(screen.getByText(CONTACT.subtitle)).toBeInTheDocument();
    });

    it('Then it should render all three form fields', () => {
      render(<Contact />);
      expect(screen.getByTestId(`field-${CONTACT.fields.email}`)).toBeInTheDocument();
      expect(screen.getByTestId(`field-${CONTACT.fields.subject}`)).toBeInTheDocument();
      expect(screen.getByTestId(`field-${CONTACT.fields.message}`)).toBeInTheDocument();
    });

    it('Then it should render the submit button', () => {
      render(<Contact />);
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  describe('When the form is submitted', () => {
    it('Then it should call handleSubmit', () => {
      render(<Contact />);
      fireEvent.submit(document.querySelector('form')!);
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('When a field value changes', () => {
    it('Then it should call handleChange for the email field', () => {
      render(<Contact />);
      fireEvent.change(screen.getByTestId(`field-${CONTACT.fields.email}`), {
        target: { value: 'test@example.com' }
      });
      expect(mockHandleChange).toHaveBeenCalledWith('email', 'test@example.com');
    });

    it('Then it should call handleChange for the subject field', () => {
      render(<Contact />);
      fireEvent.change(screen.getByTestId(`field-${CONTACT.fields.subject}`), {
        target: { value: 'Hello' }
      });
      expect(mockHandleChange).toHaveBeenCalledWith('subject', 'Hello');
    });

    it('Then it should call handleChange for the message field', () => {
      render(<Contact />);
      fireEvent.change(screen.getByTestId(`field-${CONTACT.fields.message}`), {
        target: { value: 'World' }
      });
      expect(mockHandleChange).toHaveBeenCalledWith('message', 'World');
    });
  });

  describe('When there is a server error', () => {
    it('Then it should render the error message', () => {
      mockServerError = 'Something went wrong, please try again.';
      render(<Contact />);
      expect(screen.getByText('Something went wrong, please try again.')).toBeInTheDocument();
    });
  });

  describe('When the form submission succeeds', () => {
    it('Then it should render the success message', () => {
      mockStatus = 'success';
      mockSuccessMessage = 'Message sent!';
      render(<Contact />);
      expect(screen.getByText('Message sent!')).toBeInTheDocument();
    });
  });
});
