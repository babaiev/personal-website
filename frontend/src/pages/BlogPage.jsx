import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchBlogPosts } from '../api';
import { Eye, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

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
    <div className="space-y-12 animate-fade-in">
      <Helmet>
        <title>VAL3R11 | Blog</title>
        <meta name="description" content="Thoughts, tutorials, and articles on software engineering by VAL3R11." />
      </Helmet>
      
      <header className="text-center max-w-3xl mx-auto space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">My Blog</h1>
        <p className="text-brand-textMuted text-lg">Thoughts, tutorials, and articles on software engineering.</p>
      </header>
      
      {loading ? (
        <div className="text-center text-brand-textMuted mt-8">Loading posts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.length > 0 ? posts.map((post) => {
            const reaction = localStorage.getItem(`reaction_${post.slug}`);
            return (
              <article 
                key={post.id} 
                className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-pointer group" 
                onClick={() => window.location.hash = `#/blog/${post.slug}`}
              >
                {post.cover_image && (
                  <div className="rounded-2xl overflow-hidden mb-6 h-48">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="text-brand-accent">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3 text-brand-textMuted">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.view_count || 0}</span>
                    <span className={`flex items-center gap-1 ${reaction === 'like' ? 'text-brand-accent font-bold' : ''}`}><ThumbsUp className="w-3.5 h-3.5" /> {post.likes || 0}</span>
                    <span className={`flex items-center gap-1 ${reaction === 'dislike' ? 'text-red-500 font-bold' : ''}`}><ThumbsDown className="w-3.5 h-3.5" /> {post.dislikes || 0}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.comment_count || 0}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors line-clamp-2">{post.title}</h2>
                <p className="text-brand-textMuted text-sm line-clamp-3 mb-6 flex-grow">{post.content.substring(0, 150)}...</p>
                <div className="text-brand-accent font-bold text-sm uppercase tracking-wider mt-auto inline-flex items-center gap-2">
                  Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </article>
            );
          }) : (
            <>
              {/* Fallback Mock Data */}
              <article className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 group">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="px-3 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent">Engineering</span>
                  <span className="text-brand-textMuted">Jul 1, 2026</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">Building Scalable Backends with Django</h2>
                <p className="text-brand-textMuted text-sm mb-6 flex-grow">A deep dive into architecture patterns and performance optimizations when scaling Django applications...</p>
                <button className="py-3 px-6 rounded-2xl bg-brand-accent/10 text-brand-accent font-bold transition-all duration-300 hover:bg-brand-accent hover:text-black">Read Article</button>
              </article>
              <article className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 group">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="px-3 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent">Frontend</span>
                  <span className="text-brand-textMuted">Jun 20, 2026</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">Why I chose React and Vite in 2026</h2>
                <p className="text-brand-textMuted text-sm mb-6 flex-grow">The frontend ecosystem is always changing. Here is a breakdown of why this stack remains my go-to choice...</p>
                <button className="py-3 px-6 rounded-2xl bg-brand-accent/10 text-brand-accent font-bold transition-all duration-300 hover:bg-brand-accent hover:text-black">Read Article</button>
              </article>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
