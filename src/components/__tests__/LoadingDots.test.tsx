import { render, screen } from '@testing-library/react';
import LoadingDots from '../LoadingDots';

test('コンポーネントがレンダリングされることを確認', () => {
  render(<LoadingDots />);
  const container = screen.getByTestId('loading-container');
  expect(container).toBeInTheDocument();
});

test('5つのドットが表示されることを確認', () => {
  const { container } = render(<LoadingDots />);
  const dots = container.getElementsByClassName('dot');
  expect(dots.length).toBe(5);
});
