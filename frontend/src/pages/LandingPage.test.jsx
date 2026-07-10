import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders landing page content', () => {
    render(
      <HelmetProvider>
        <LandingPage onSubscribeClick={() => {}} />
      </HelmetProvider>
    );
    expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
    expect(screen.getByText('Val')).toBeInTheDocument();
  });

  it('calls onSubscribeClick when subscribe button is clicked', () => {
    const mockClick = vi.fn();
    render(
      <HelmetProvider>
        <LandingPage onSubscribeClick={mockClick} />
      </HelmetProvider>
    );
    
    const btn = screen.getByText(/Subscribe to Newsletter/i);
    fireEvent.click(btn);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
