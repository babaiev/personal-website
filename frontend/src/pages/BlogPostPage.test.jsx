import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  fetchComments: vi.fn(),
  postComment: vi.fn()
}));

const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'This is the test content.',
  slug: 'test-slug',
  published_at: '2026-07-01T12:00:00Z',
  likes: 10,
  dislikes: 2,
  view_count: 100
};

describe('BlogPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    api.fetchBlogPost.mockResolvedValue(mockPost);
    api.fetchComments.mockResolvedValue([]);
  });

  const renderComponent = () => render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/blog/test-slug']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

  it('renders post content when fetched successfully', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('This is the test content.')).toBeInTheDocument();
    });
  });

  it('renders error state when post is not found', async () => {
    api.fetchBlogPost.mockResolvedValueOnce(null);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Blog post not found.')).toBeInTheDocument();
    });
  });

  it('handles liking and unliking a post', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Like 10/)).toBeInTheDocument();
    });

    const likeBtn = screen.getByRole('button', { name: /Like/ });
    
    fireEvent.click(likeBtn);
    await waitFor(() => {
      expect(api.likePost).toHaveBeenCalled();
      expect(screen.getByText(/Like 11/)).toBeInTheDocument();
    });

    fireEvent.click(likeBtn);
    await waitFor(() => {
      expect(api.unlikePost).toHaveBeenCalled();
      expect(screen.getByText(/Like 10/)).toBeInTheDocument();
    });
  });

  it('handles disliking and undisliking a post', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Dislike 2/)).toBeInTheDocument();
    });

    const dislikeBtn = screen.getByRole('button', { name: /Dislike/ });
    
    fireEvent.click(dislikeBtn);
    await waitFor(() => {
      expect(api.dislikePost).toHaveBeenCalled();
      expect(screen.getByText(/Dislike 3/)).toBeInTheDocument();
    });

    fireEvent.click(dislikeBtn);
    await waitFor(() => {
      expect(api.undislikePost).toHaveBeenCalled();
      expect(screen.getByText(/Dislike 2/)).toBeInTheDocument();
    });
  });

  it('switches from like to dislike', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText(/Like 10/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Like/ }));
    await waitFor(() => expect(screen.getByText(/Like 11/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Dislike/ }));
    await waitFor(() => {
      expect(screen.getByText(/Like 10/)).toBeInTheDocument();
      expect(screen.getByText(/Dislike 3/)).toBeInTheDocument();
    });
  });

  it('switches from dislike to like', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText(/Dislike 2/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Dislike/ }));
    await waitFor(() => expect(screen.getByText(/Dislike 3/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Like/ }));
    await waitFor(() => {
      expect(screen.getByText(/Dislike 2/)).toBeInTheDocument();
      expect(screen.getByText(/Like 11/)).toBeInTheDocument();
    });
  });

  it('validates empty comments', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('Test Post')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Submit Comment/ }));
    expect(screen.getByText('Name and comment are required.')).toBeInTheDocument();
  });

  it('submits a comment successfully with captcha', async () => {
    api.postComment.mockResolvedValue({ id: 1, name: 'Alice', content: 'Great post!', created_at: new Date().toISOString() });
    renderComponent();
    await waitFor(() => expect(screen.getByText('Test Post')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('What are your thoughts?'), { target: { value: 'Great post!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Comment/ }));
    
    // Captcha Step
    await waitFor(() => expect(screen.getByText(/Verify/)).toBeInTheDocument());
    
    // Force a wrong answer first
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '999' } });
    fireEvent.click(screen.getByRole('button', { name: /Verify/ }));
    await waitFor(() => expect(screen.getByText('Incorrect answer. Please try again.')).toBeInTheDocument());

    // Extract the math question. e.g., "5 + 3 = "
    const questionEl = screen.getByText(/\+/).textContent;
    const parts = questionEl.split('+');
    const num1 = parseInt(parts[0].trim());
    const num2 = parseInt(parts[1].split('=')[0].trim());
    
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: String(num1 + num2) } });
    fireEvent.click(screen.getByRole('button', { name: /Verify/ }));

    await waitFor(() => expect(screen.getByText('Comment posted successfully!')).toBeInTheDocument());
    expect(api.postComment).toHaveBeenCalledWith('test-slug', 'Alice', 'Great post!');
  });
  
  it('handles comment submission error', async () => {
    api.postComment.mockRejectedValue(new Error('Server error'));
    renderComponent();
    await waitFor(() => expect(screen.getByText('Test Post')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText('What are your thoughts?'), { target: { value: 'Bad post!' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Comment/ }));
    
    await waitFor(() => expect(screen.getByText(/Verify/)).toBeInTheDocument());
    const questionEl = screen.getByText(/\+/).textContent;
    const parts = questionEl.split('+');
    const num1 = parseInt(parts[0].trim());
    const num2 = parseInt(parts[1].split('=')[0].trim());
    
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: String(num1 + num2) } });
    fireEvent.click(screen.getByRole('button', { name: /Verify/ }));

    await waitFor(() => expect(screen.getByText('Server error')).toBeInTheDocument());
  });
});
