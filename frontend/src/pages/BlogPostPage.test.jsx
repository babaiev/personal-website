import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogPostPage from './BlogPostPage';
import { HelmetProvider } from 'react-helmet-async';
import * as api from '../api';

vi.mock('../api', () => ({
  fetchBlogPost: vi.fn(),
  incrementPostView: vi.fn(),
  likePost: vi.fn(),
  unlikePost: vi.fn(),
  dislikePost: vi.fn(),
  undislikePost: vi.fn(),
  fetchComments: vi.fn(() => Promise.resolve([])),
  postComment: vi.fn()
}));

describe('BlogPostPage', () => {
  it('renders post content when fetched successfully', async () => {
    const mockPost = {
      id: 1,
      title: 'Test Post',
      content: 'This is the test content.',
      slug: 'test-slug',
      published_at: '2026-07-01T12:00:00Z'
    };
    
    api.fetchBlogPost.mockResolvedValue(mockPost);
    
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/blog/test-slug']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('This is the test content.')).toBeInTheDocument();
    });
  });

  it('renders error state when post is not found', async () => {
    api.fetchBlogPost.mockResolvedValue(null);
    
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/blog/invalid-slug']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Blog post not found.')).toBeInTheDocument();
      expect(document.body).toBeInTheDocument();
    });
  });
});
