import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('shows home quote app after initial loading', async () => {
  render(<App />);
  expect(screen.getByText(/読み込み中/i)).toBeInTheDocument();
  await waitFor(
    () => {
      expect(
        screen.getByRole('heading', { name: /ランダム名言/i })
      ).toBeInTheDocument();
    },
    { timeout: 2000 }
  );
});
