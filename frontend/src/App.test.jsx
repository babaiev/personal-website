import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the landing page title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Valerii Babaiev/i);
    expect(titleElement).toBeInTheDocument();
  });
});
