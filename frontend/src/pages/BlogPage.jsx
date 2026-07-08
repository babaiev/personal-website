import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchBlogPosts } from '../api';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchBlogPosts();
      setPosts(result);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="page-container fade-in">
      <Helmet>
        <title>VAL3R11 | Blog</title>
        <meta name="description" content="Thoughts, tutorials, and articles on software engineering by VAL3R11." />
      </Helmet>
      <header className="page-header">
        <h1>My Blog</h1>
        <p>Thoughts, tutorials, and articles on software engineering.</p>
      </header>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading posts...</div>
      ) : (
        <div className="blog-grid">
          {posts.length > 0 ? posts.map((post) => {
            const reaction = localStorage.getItem(`reaction_${post.slug}`);
            return (
              <article 
                key={post.id} 
                className="card blog-card" 
                onClick={() => window.location.hash = `#/blog/${post.slug}`}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              >
                {post.cover_image && <img src={post.cover_image} alt={post.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />}
                <div className="blog-meta">
                  <span className="date">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                    <span>👁 {post.view_count || 0}</span>
                    <span style={{ color: reaction === 'like' ? 'var(--accent-color)' : 'inherit', fontWeight: reaction === 'like' ? 'bold' : 'normal' }}>👍 {post.likes || 0}</span>
                    <span style={{ color: reaction === 'dislike' ? '#ff4d4f' : 'inherit', fontWeight: reaction === 'dislike' ? 'bold' : 'normal' }}>👎 {post.dislikes || 0}</span>
                  </div>
                </div>
                <h2>{post.title}</h2>
                <p>{post.content.substring(0, 150)}...</p>
                <div style={{ marginTop: '1rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>Read Article →</div>
              </article>
            );
          }) : (
            <>
              {/* Fallback Mock Data */}
              <article className="card blog-card">
                <div className="blog-meta">
                  <span className="tag">Engineering</span>
                  <span className="date">Jul 1, 2026</span>
                </div>
                <h2>Building Scalable Backends with Django</h2>
                <p>A deep dive into architecture patterns and performance optimizations when scaling Django applications...</p>
                <button className="read-more" style={{ marginTop: '1rem', background: 'var(--accent-gradient)', border: 'none', padding: '0.5rem 1rem', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Read Article</button>
              </article>
              <article className="card blog-card">
                <div className="blog-meta">
                  <span className="tag">Frontend</span>
                  <span className="date">Jun 20, 2026</span>
                </div>
                <h2>Why I chose React and Vite in 2026</h2>
                <p>The frontend ecosystem is always changing. Here is a breakdown of why this stack remains my go-to choice...</p>
                <button className="read-more" style={{ marginTop: '1rem', background: 'var(--accent-gradient)', border: 'none', padding: '0.5rem 1rem', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Read Article</button>
              </article>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
