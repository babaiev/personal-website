import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchBlogPost, incrementPostView, likePost, unlikePost, dislikePost, undislikePost } from '../api';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [viewed, setViewed] = useState(false);
  const [reaction, setReaction] = useState(null); // 'like', 'dislike', or null

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const result = await fetchBlogPost(slug);
      if (result) {
        setPost(result);
        setLocalLikes(result.likes || 0);
        setLocalDislikes(result.dislikes || 0);
        
        // Load existing reaction from local storage
        const savedReaction = localStorage.getItem(`reaction_${slug}`);
        if (savedReaction) {
          setReaction(savedReaction);
        }

        if (!viewed) {
          incrementPostView(slug);
          setViewed(true);
        }
      } else {
        setError("Blog post not found.");
      }
      setLoading(false);
    };
    loadPost();
  }, [slug, viewed]);

  const handleLike = async () => {
    if (reaction === 'like') {
      // Remove like
      setReaction(null);
      setLocalLikes(prev => prev - 1);
      localStorage.removeItem(`reaction_${slug}`);
      await unlikePost(slug);
    } else {
      // Add like
      setReaction('like');
      setLocalLikes(prev => prev + 1);
      localStorage.setItem(`reaction_${slug}`, 'like');
      if (reaction === 'dislike') {
        setLocalDislikes(prev => prev - 1);
        await undislikePost(slug);
      }
      await likePost(slug);
    }
  };

  const handleDislike = async () => {
    if (reaction === 'dislike') {
      // Remove dislike
      setReaction(null);
      setLocalDislikes(prev => prev - 1);
      localStorage.removeItem(`reaction_${slug}`);
      await undislikePost(slug);
    } else {
      // Add dislike
      setReaction('dislike');
      setLocalDislikes(prev => prev + 1);
      localStorage.setItem(`reaction_${slug}`, 'dislike');
      if (reaction === 'like') {
        setLocalLikes(prev => prev - 1);
        await unlikePost(slug);
      }
      await dislikePost(slug);
    }
  };

  if (loading) {
    return (
      <div className="page-container fade-in">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading article...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-container fade-in">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>{error || "Post not found"}</h2>
          <Link to="/blog" style={{ color: 'var(--accent-color)' }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <Helmet>
        <title>VAL3R11 | {post.title}</title>
        <meta name="description" content={post.content.substring(0, 150)} />
      </Helmet>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>← Back to Blog</Link>
      </div>

      <article className="card" style={{ padding: '2rem' }}>
        <div className="blog-meta" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span className="date">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
          <span style={{ color: 'var(--text-secondary)' }}>👁 {(post.view_count || 0) + (viewed ? 1 : 0)} views</span>
        </div>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{post.title}</h1>
        
        {post.cover_image && (
          <img 
            src={post.cover_image} 
            alt={post.title} 
            style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem' }} 
          />
        )}
        
        <div style={{ lineHeight: '1.8', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleLike} 
            style={{ 
              background: reaction === 'like' ? 'var(--accent-color)' : 'var(--card-bg)', 
              border: '1px solid ' + (reaction === 'like' ? 'var(--accent-color)' : 'var(--border-color)'), 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              color: reaction === 'like' ? '#08110c' : 'var(--text-primary)', 
              fontWeight: reaction === 'like' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👍 Like ({localLikes})
          </button>
          <button 
            onClick={handleDislike} 
            style={{ 
              background: reaction === 'dislike' ? '#ff4d4f' : 'var(--card-bg)', 
              border: '1px solid ' + (reaction === 'dislike' ? '#ff4d4f' : 'var(--border-color)'), 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              color: reaction === 'dislike' ? '#fff' : 'var(--text-primary)',
              fontWeight: reaction === 'dislike' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👎 Dislike ({localDislikes})
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
