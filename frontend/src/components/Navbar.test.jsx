import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders navbar links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/VAL/i)).toBeInTheDocument();
    
    // Desktop links
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Portfolio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Newsfeed').length).toBeGreaterThan(0);
  });

  it('handles desktop subscribe click', () => {
    const mockSubscribe = vi.fn();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={mockSubscribe} />
      </MemoryRouter>
    );

    // Desktop subscribe button is usually the first one or visible
    const subscribeBtns = screen.getAllByText('Subscribe');
    fireEvent.click(subscribeBtns[0]);
    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile menu', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={() => {}} />
      </MemoryRouter>
    );

    // Get the menu toggle button (hamburger icon)
    // There are only two buttons in the standard view: Subscribe and Hamburger
    const buttons = screen.getAllByRole('button');
    const toggleBtn = buttons[1]; // second button is the toggle

    // Initially mobile menu is closed. In DOM, there should be 1 of each link (desktop)
    expect(screen.getAllByText('Home')).toHaveLength(1);

    // Open menu
    fireEvent.click(toggleBtn);
    // Now mobile links are visible
    expect(screen.getAllByText('Home')).toHaveLength(2);

    // Close menu by clicking toggle again
    fireEvent.click(toggleBtn);
    expect(screen.getAllByText('Home')).toHaveLength(1);
  });

  it('closes mobile menu on link click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={() => {}} />
      </MemoryRouter>
    );

    const toggleBtn = screen.getAllByRole('button')[1];
    fireEvent.click(toggleBtn); // Open menu
    
    expect(screen.getAllByText('Portfolio')).toHaveLength(2);
    
    // Click mobile portfolio link
    const mobileLink = screen.getAllByText('Portfolio')[1];
    fireEvent.click(mobileLink);

    // Menu should be closed
    expect(screen.getAllByText('Portfolio')).toHaveLength(1);
  });

  it('closes mobile menu on logo click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={() => {}} />
      </MemoryRouter>
    );

    const toggleBtn = screen.getAllByRole('button')[1];
    fireEvent.click(toggleBtn); // Open menu
    
    expect(screen.getAllByText('Blog')).toHaveLength(2);
    
    // Click logo link (it's inside an a tag)
    const logoLink = screen.getByRole('link', { name: /ValAndAI Logo/i });
    fireEvent.click(logoLink);

    // Menu should be closed
    expect(screen.getAllByText('Blog')).toHaveLength(1);
  });

  it('calls onSubscribeClick and closes mobile menu', () => {
    const mockSubscribe = vi.fn();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar onSubscribeClick={mockSubscribe} />
      </MemoryRouter>
    );

    const toggleBtn = screen.getAllByRole('button')[1];
    fireEvent.click(toggleBtn); // Open menu
    
    // Now there are 2 subscribe buttons
    const subscribeBtns = screen.getAllByText('Subscribe');
    expect(subscribeBtns).toHaveLength(2);
    
    // Click mobile subscribe button
    fireEvent.click(subscribeBtns[1]);

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    // Menu should be closed
    expect(screen.getAllByText('Subscribe')).toHaveLength(1);
  });
});
