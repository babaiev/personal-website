import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import NewsfeedPage from './NewsfeedPage';
import * as api from '../api';

vi.mock('../api');

describe('NewsfeedPage', () => {
  it('renders loading state initially', () => {
    api.fetchNewsfeed.mockReturnValue(new Promise(() => {})); 
    render(
      <HelmetProvider>
        <NewsfeedPage />
      </HelmetProvider>
    );
    
  });

  it('renders newsfeed items when loaded', async () => {
    api.fetchNewsfeed.mockResolvedValue({ results: [
      { id: 1, title: 'AI News', url: 'http://test.com', source: 'Twitter', published_at: '2023-01-01T00:00:00Z' }
    ], count: 1 });

    render(
      <HelmetProvider>
        <NewsfeedPage />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Feed/i)).toBeInTheDocument();
    expect(screen.getByText('AI News')).toBeInTheDocument();
  });
});
