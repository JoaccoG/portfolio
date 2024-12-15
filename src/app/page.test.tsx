import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Given a Home page', (): void => {
  test('It should render the page', (): void => {
    render(<Home />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});
