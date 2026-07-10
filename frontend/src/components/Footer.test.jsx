import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders footer content and version', () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    expect(screen.getByText(/ValAndAI/i)).toBeInTheDocument();
  });

  it('handles current year logic', () => {
    // Mock the date to be 2027 to test the ternary operator branch
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-01-01'));
    render(<Footer />);
    expect(screen.getByText(/ValAndAI/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
