import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  fetchPortfolio, fetchBlogPosts, fetchBlogPost, incrementPostView, 
  likePost, unlikePost, dislikePost, undislikePost,
  fetchComments, postComment, fetchNewsfeed, subscribeEmail 
} from './api';

global.fetch = vi.fn();

describe('api functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn(); // Suppress console.error in tests
  });

  it('fetchPortfolio handles successful response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });
    const result = await fetchPortfolio();
    expect(result).toEqual({ projects: [], experiences: [], skills: [] });
  });

  it('fetchPortfolio handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchPortfolio();
    expect(result).toEqual({ projects: [], experiences: [], skills: [] });
  });

  it('fetchBlogPosts handles successful response', async () => {
    const mockData = { results: [{ id: 1 }], count: 1 };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    const result = await fetchBlogPosts();
    expect(result).toEqual(mockData);
  });

  it('fetchBlogPosts handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchBlogPosts();
    expect(result).toEqual([]);
  });

  it('fetchBlogPost handles successful response', async () => {
    const mockData = { id: 1, title: 'Test Post' };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });
    const result = await fetchBlogPost('test-post');
    expect(result).toEqual(mockData);
  });

  it('fetchBlogPost handles errors', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    const result = await fetchBlogPost('test-post');
    expect(result).toBeNull();
  });

  it('incrementPostView works', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    await incrementPostView('test-post');
    expect(global.fetch).toHaveBeenCalledWith('/api/blog/posts/test-post/view/', { method: 'POST' });
  });

  it('incrementPostView handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Error'));
    await incrementPostView('test-post');
    expect(console.error).toHaveBeenCalled();
  });

  const reactionTests = [
    { fn: likePost, url: '/api/blog/posts/test/like/' },
    { fn: unlikePost, url: '/api/blog/posts/test/unlike/' },
    { fn: dislikePost, url: '/api/blog/posts/test/dislike/' },
    { fn: undislikePost, url: '/api/blog/posts/test/undislike/' }
  ];

  for (const { fn, url } of reactionTests) {
    it(`${fn.name} handles successful response`, async () => {
      const mockData = { likes: 1 };
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });
      const result = await fn('test');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(url, { method: 'POST' });
    });

    it(`${fn.name} handles errors`, async () => {
      global.fetch.mockRejectedValueOnce(new Error('Error'));
      const result = await fn('test');
      expect(result).toBeNull();
    });
  }

  it('fetchComments handles successful response', async () => {
    const mockData = [{ id: 1 }];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });
    const result = await fetchComments('test');
    expect(result).toEqual(mockData);
  });

  it('fetchComments handles errors', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    const result = await fetchComments('test');
    expect(result).toEqual([]);
  });

  it('postComment handles successful response', async () => {
    const mockData = { id: 1 };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });
    const result = await postComment('test', 'User', 'Content');
    expect(result).toEqual(mockData);
  });

  it('postComment handles errors', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'Error' }) });
    await expect(postComment('test', 'User', 'Content')).rejects.toThrow('Error');
  });

  it('postComment handles fetch errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(postComment('test', 'User', 'Content')).rejects.toThrow('Network error');
  });

  it('fetchNewsfeed handles successful response', async () => {
    const mockData = { results: [{ id: 1 }], count: 1 };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });
    const result = await fetchNewsfeed();
    expect(result).toEqual(mockData);
  });

  it('fetchNewsfeed handles errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchNewsfeed();
    expect(result).toEqual({ results: [], count: 0 });
  });

  it('subscribeEmail handles successful response', async () => {
    const mockData = { id: 1, email: 'test@test.com' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => mockData
    });
    const result = await subscribeEmail('test@test.com');
    expect(result).toEqual(mockData);
  });

  it('subscribeEmail handles API errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ email: ['This email is already subscribed.'] })
    });
    await expect(subscribeEmail('test@test.com')).rejects.toThrow('This email is already subscribed.');
  });

  it('subscribeEmail handles missing content type', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/html' }
    });
    await expect(subscribeEmail('test@test.com')).rejects.toThrow('Server returned an unexpected response');
  });
});
