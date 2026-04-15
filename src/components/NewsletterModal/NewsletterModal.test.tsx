import userEvent from '@testing-library/user-event';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterModal } from './NewsletterModal';

const mockFetch = vi.fn();

vi.mock('@hooks/useBreakpoint', () => ({
  useBreakpoint: () => ({
    breakpoint: 'base',
    resolve: vi.fn((_input: unknown, fallback?: unknown) => fallback ?? {})
  })
}));

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const makeOkResponse = () => ({
  ok: true,
  json: () => Promise.resolve({ status: 201, message: 'Subscribed' })
});

const makeErrorResponse = (status: number, body: object) => ({
  ok: false,
  status,
  json: () => Promise.resolve({ status, ...body })
});

const makeAlreadySubscribedResponse = () => ({
  ok: false,
  status: 409,
  json: () => Promise.resolve({ status: 409, message: 'Email already subscribed.' })
});

describe('Given the NewsletterModal component', () => {
  describe('When closed', () => {
    it('Then it should not render the dialog', () => {
      render(<NewsletterModal isOpen={false} onClose={vi.fn()} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('When open', () => {
    it('Then it should render the title and subtitle', () => {
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByText('Blog Coming Soon')).toBeInTheDocument();
      expect(screen.getByText(/working on my blog/)).toBeInTheDocument();
    });

    it('Then it should render the email input', () => {
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('Then it should render the subscribe button', () => {
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });
  });

  describe('When submitting with an empty email', () => {
    it('Then it should show a validation error', async () => {
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      await user.click(screen.getByRole('button', { name: /subscribe/i }));
      expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
    });
  });

  describe('When submitting a valid email successfully', () => {
    it('Then it should show the success view with the content constant message', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/Email subscribed!/)).toBeInTheDocument();
      });
    });

    it('Then the subscribe form should no longer be visible', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
      });
    });

    it('Then the Done button should be visible', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
      });
    });

    it('Then clicking Done should call onClose', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<NewsletterModal isOpen={true} onClose={onClose} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /done/i }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('When hovering the subscribe button', () => {
    it('Then it should update the button style on hover and revert on leave', async () => {
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);
      const button = screen.getByRole('button', { name: /subscribe/i });

      await user.hover(button);
      expect(button.style.borderColor).toBe('var(--color-primary)');

      await user.unhover(button);
      expect(button.style.borderColor).toBe('rgba(242, 235, 227, 0.15)');
    });
  });

  describe('When hovering the Done button in the success view', () => {
    it('Then it should update the button style on hover and revert on leave', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
      });

      const doneButton = screen.getByRole('button', { name: /done/i });
      await user.hover(doneButton);
      expect(doneButton.style.borderColor).toBe('var(--color-primary)');

      await user.unhover(doneButton);
      expect(doneButton.style.borderColor).toBe('rgba(242, 235, 227, 0.15)');
    });
  });

  describe('When the API returns a 409 (already subscribed)', () => {
    it('Then it should display the warning message', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Email already subscribed.');
      });
    });

    it('Then the form should remain visible', async () => {
      mockFetch.mockResolvedValueOnce(makeAlreadySubscribedResponse());
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });
  });

  describe('When the API returns a server error', () => {
    it('Then it should display the server error message', async () => {
      mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { message: 'Rate limit exceeded' }));
      const user = userEvent.setup();
      render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Rate limit exceeded');
      });
    });
  });

  describe('When the modal is reopened after being closed', () => {
    it('Then the form should be reset to its initial state', () => {
      const { rerender } = render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });

      rerender(<NewsletterModal isOpen={false} onClose={vi.fn()} />);
      rerender(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByLabelText('Email')).toHaveValue('');
    });

    it('Then the success view should be cleared', async () => {
      mockFetch.mockResolvedValueOnce(makeOkResponse());
      const user = userEvent.setup();
      const { rerender } = render(<NewsletterModal isOpen={true} onClose={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      await act(async () => {
        rerender(<NewsletterModal isOpen={false} onClose={vi.fn()} />);
      });
      await act(async () => {
        rerender(<NewsletterModal isOpen={true} onClose={vi.fn()} />);
      });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });
});
