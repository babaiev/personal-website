import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import PortfolioPage from './PortfolioPage';
import * as api from '../api';

vi.mock('../api');

describe('PortfolioPage', () => {
  it('renders loading state initially', () => {
    api.fetchPortfolio.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <HelmetProvider>
        <PortfolioPage />
      </HelmetProvider>
    );
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders portfolio data when loaded', async () => {
    api.fetchPortfolio.mockResolvedValue({
      projects: [{ id: 1, title: 'Cool Project', description: 'Desc', tech_stack: [{ id: 1, name: 'React' }] }],
      experiences: [{ id: 1, role: 'Developer', company: 'Google', start_date: '2020-01-01', description: 'Desc' }],
      skills: [{ id: 1, name: 'React', category: 'Frontend' }]
    });

    render(
      <HelmetProvider>
        <PortfolioPage />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Cool Project')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getAllByText('React')[0]).toBeInTheDocument();
  });
});
