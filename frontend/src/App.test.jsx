import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the landing page title', () => {
    render(<App />);
    const titleElements = screen.getAllByText(/ValAndAI/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });
});
