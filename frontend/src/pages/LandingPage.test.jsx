import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders landing page content in human mode initially', () => {
    render(
      <HelmetProvider>
        <LandingPage onSubscribeClick={() => {}} />
      </HelmetProvider>
    );
    expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
    expect(screen.getByText('Val')).toBeInTheDocument();
    
    // Fast forward to complete the typewriter effect
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
  });

  it('toggles AI mode and renders matrix text', () => {
    render(
      <HelmetProvider>
        <LandingPage onSubscribeClick={() => {}} />
      </HelmetProvider>
    );
    
    // Toggle switch
    const toggleBtn = screen.getAllByRole('button')[0]; // The toggle is the first button usually, but let's be safe. Wait, it doesn't have a label.
    // Let's find it by some unique class or just click the first button
    fireEvent.click(toggleBtn);
    
    // After toggle, AI text should start rendering
    act(() => {
      vi.runAllTimers();
    });
    
    // Check for AI specific content
    expect(screen.getByText(/>_ System Log: Subject 'Valerii' initialized./i)).toBeInTheDocument();
    
    // Toggle back to Human mode
    fireEvent.click(toggleBtn);
    act(() => {
      vi.runAllTimers();
    });
    
    expect(screen.getByText(/Hello, I'm/i)).toBeInTheDocument();
  });

  it('calls onSubscribeClick when subscribe button is clicked', () => {
    const mockClick = vi.fn();
    render(
      <HelmetProvider>
        <LandingPage onSubscribeClick={mockClick} />
      </HelmetProvider>
    );
    
    // Wait for text to finish typing so button is available properly
    act(() => {
      vi.runAllTimers();
    });
    
    const btn = screen.getByText(/Subscribe to Newsletter/i);
    fireEvent.click(btn);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
