import { render, screen, waitFor, act } from '@testing-library/react';
import Home from '../app/page';

// Mock components
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

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

global.fetch = jest.fn();
process.env.NEXT_PUBLIC_BACKEND_URL_API = 'http://localhost:8080/api';

const mockManga = [
  {
    id: '1',
    title: { en: 'Test Manga' },
    description: { en: 'Test Description' },
    status: 'ongoing',
    contentRating: 'safe',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ member: mockManga, totalItems: 1 }),
    });
  });

  it('renders main elements', async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText('MangaDex')).toBeInTheDocument();
    expect(screen.getByTestId('user-auth')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('has navigation links', async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('fetches manga data', async () => {
    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
