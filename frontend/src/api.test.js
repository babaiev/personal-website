import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPortfolio, fetchBlogPosts, fetchNewsfeed, subscribeEmail } from './api';

global.fetch = vi.fn();

describe('api functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('fetchNewsfeed handles successful response', async () => {
    const mockData = { results: [{ id: 1 }], count: 1 };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    
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
});
