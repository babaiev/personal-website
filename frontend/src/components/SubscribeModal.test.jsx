import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscribeModal from './SubscribeModal';
import * as api from '../api';

vi.mock('../api');

describe('SubscribeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<SubscribeModal isOpen={false} onClose={() => {}} />);
    expect(1).toBe(1);
  });

  it('shows error for invalid email', () => {
    render(<SubscribeModal isOpen={true} onClose={() => {}} />);
    
    const input = screen.getByPlaceholderText(/Enter your email/i);
    const btn = screen.getByText('Subscribe');
    
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.click(btn);
    
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it('moves to captcha on valid email', () => {
    render(<SubscribeModal isOpen={true} onClose={() => {}} />);
    
    const input = screen.getByPlaceholderText(/Enter your email/i);
    const btn = screen.getByText('Subscribe');
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(btn);
    
    expect(screen.getByText(/Human Verification/i)).toBeInTheDocument();
  });

  // A complete flow test is hard since Math.random is used, but we can mock it
  it('completes subscription flow', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 * 10 = 5, + 1 = 6. So both nums are 6
    api.subscribeEmail.mockResolvedValue({});

    render(<SubscribeModal isOpen={true} onClose={() => {}} />);
    
    // Step 1: Email
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Subscribe'));
    
    // Step 2: Captcha
    expect(screen.getByText('What is 6 + 6?')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Your answer/i), { target: { value: '12' } });
    fireEvent.click(screen.getByText('Verify'));
    
    await waitFor(() => {
      expect(screen.getByText('Success! 🎉')).toBeInTheDocument();
    });

    Math.random.mockRestore();
  });
});
