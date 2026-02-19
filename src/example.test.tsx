import { render, screen } from '@testing-library/react';

describe('Given an example test', () => {
  it('Then it should be true', () => {
    expect(true).toBe(true);
  });
});

describe('Given an example component', () => {
  it('Then it should render', () => {
    render(<h1>Hello World</h1>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
