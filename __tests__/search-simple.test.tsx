import { render, screen, waitFor, act } from '@testing-library/react';
import SearchPage from '../app/search/page';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../app/components/UserAuth', () => ({
  __esModule: true,
  default: () => <div data-testid="user-auth">UserAuth</div>,
}));

jest.mock('../app/components/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

jest.mock('../app/components/MangaCard', () => ({
  __esModule: true,
  default: ({ manga }: { manga: { title?: { en?: string } } }) => (
    <div data-testid="manga-card">{manga.title?.en || 'Manga Title'}</div>
  ),
}));

global.fetch = jest.fn();

describe('Search Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(),
      toString: () => '',
    });
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ member: [], totalItems: 0 }),
    });
  });

  it('renders search elements', async () => {
    await act(async () => {
      render(<SearchPage />);
    });

    expect(screen.getByPlaceholderText('Search titles...')).toBeInTheDocument();
    expect(screen.getByTestId('user-auth')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('has search input', async () => {
    await act(async () => {
      render(<SearchPage />);
    });

    const searchInput = screen.getByPlaceholderText('Search titles...');
    expect(searchInput).toBeInTheDocument();
  });

  it('fetches data on load', async () => {
    await act(async () => {
      render(<SearchPage />);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
