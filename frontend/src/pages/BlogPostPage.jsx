import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { fetchBlogPost, incrementPostView, likePost, unlikePost, dislikePost, undislikePost, fetchComments, postComment } from '../api';
import { Eye, ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [viewed, setViewed] = useState(false);
  const [reaction, setReaction] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentStep, setCommentStep] = useState('IDLE');
  const [commentError, setCommentError] = useState('');
  
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const result = await fetchBlogPost(slug);
      if (result) {
        setPost(result);
        setLocalLikes(result.likes || 0);
        setLocalDislikes(result.dislikes || 0);
        
        const savedReaction = localStorage.getItem(`reaction_${slug}`);
        if (savedReaction) {
          setReaction(savedReaction);
        }

        if (typeof window !== 'undefined' && window.localStorage) {
          const savedViewed = window.localStorage.getItem(`viewed_${slug}`);
          if (!savedViewed) {
            incrementPostView(slug);
            window.localStorage.setItem(`viewed_${slug}`, 'true');
            setViewed(true);
          } else {
            setViewed(true); // Always set to true if it was viewed before, so count shows +0 effectively if we don't want it to increment. Wait, if we set viewed to true, it adds 1 to view_count in UI. Let's keep it as is, but if they already viewed it, we don't add 1 locally.
            // Actually, if savedViewed is true, it means they already viewed it in a previous session, and the backend view_count already includes their view. 
            // So we don't need to add +1 locally.
            setViewed(false);
          }
        } else {
          incrementPostView(slug);
          setViewed(true);
        }

        const commentsData = await fetchComments(slug);
        setComments(commentsData);

      } else {
        setError("Blog post not found.");
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  const handleCommentSubmitClick = () => {
    if (!commentName.trim() || !commentText.trim()) {
      setCommentError('Name and comment are required.');
      return;
    }
    setCommentError('');
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCommentStep('CAPTCHA');
  };

  const handleCaptchaSubmit = async () => {
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setCommentError('Incorrect answer. Please try again.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
      return;
    }

    setCommentStep('LOADING');
    setCommentError('');
    try {
      const newComment = await postComment(slug, commentName, commentText);
      setComments([...comments, newComment]);
      setCommentStep('SUCCESS');
      setCommentName('');
      setCommentText('');
      setCaptchaAnswer('');
      setTimeout(() => setCommentStep('IDLE'), 3000);
    } catch (err) {
      setCommentStep('ERROR');
      setCommentError(err.message || 'Something went wrong.');
    }
  };

  const handleLike = async () => {
    if (reaction === 'like') {
      setReaction(null);
      setLocalLikes(prev => prev - 1);
      localStorage.removeItem(`reaction_${slug}`);
      await unlikePost(slug);
    } else {
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
      setReaction(null);
      setLocalDislikes(prev => prev - 1);
      localStorage.removeItem(`reaction_${slug}`);
      await undislikePost(slug);
    } else {
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
      <div className="space-y-12 animate-fade-in flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="w-14 h-14 rounded-2xl border-4 border-brand-accent/20 border-t-brand-accent animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6 animate-fade-in text-center pt-20">
        <h2 className="text-3xl font-bold text-white">{error || "Post not found"}</h2>
        <Link to="/blog" className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto w-full">
      <Helmet>
        <title>ValAndAI | {post.title}</title>
        <meta name="description" content={post.content.substring(0, 150)} />
      </Helmet>
      
      <div className="pt-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-brand-textMuted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      <article className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 md:p-12">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-8 border-b border-white/[0.04] pb-6">
          <span className="text-brand-accent">{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1 text-brand-textMuted"><Eye className="w-4 h-4" /> {(post.view_count || 0) + (viewed ? 1 : 0)} views</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-8">{post.title}</h1>
        
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-[0_0_30px_rgba(46,229,107,0.1)]">
            <img 
              src={post.cover_image} 
              alt={post.title} 
              className="w-full h-auto object-cover" 
            />
          </div>
        )}
        
        <div 
          className="prose prose-invert prose-lg max-w-none text-brand-textMuted prose-headings:text-white prose-a:text-brand-accent leading-relaxed ck-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-wrap gap-4">
          <button 
            onClick={handleLike} 
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${reaction === 'like' ? 'bg-brand-accent text-black shadow-[0_0_20px_rgba(46,229,107,0.4)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <ThumbsUp className="w-5 h-5" /> Like {localLikes}
          </button>
          <button 
            onClick={handleDislike} 
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${reaction === 'dislike' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            <ThumbsDown className="w-5 h-5" /> Dislike {localDislikes}
          </button>
        </div>
      </article>

      <section className="space-y-8 pt-8">
        <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
          <MessageSquare className="w-6 h-6 text-brand-accent" />
          <h2 className="text-2xl font-bold text-white">Comments ({comments.length})</h2>
        </div>
        
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-brand-bg/50 border border-white/[0.04] rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <strong className="text-white font-semibold">{comment.name}</strong>
                <span className="text-xs text-brand-textMuted">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-brand-textMuted text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-brand-textMuted italic text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>

        <div className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Leave a Comment</h3>
          
          {(commentStep === 'IDLE' || commentStep === 'ERROR') ? (
            <div className="space-y-5">
              {commentError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {commentError}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-textMuted pl-1">Name</label>
                <input 
                  type="text" 
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full bg-brand-bg border border-white/[0.08] focus:border-brand-accent/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-textMuted pl-1">Comment</label>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-brand-bg border border-white/[0.08] focus:border-brand-accent/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors min-h-[120px] resize-y"
                  placeholder="What are your thoughts?"
                  required
                />
              </div>
              <button 
                onClick={handleCommentSubmitClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-accent text-black font-bold transition-all duration-300 hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" /> Submit Comment
              </button>
            </div>
          ) : commentStep === 'CAPTCHA' ? (
            <div className="space-y-6">
              {commentError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {commentError}
                </div>
              )}
              <div className="flex items-center gap-3 text-brand-accent bg-brand-accent/10 p-4 rounded-xl border border-brand-accent/20">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">To prove you are human, please solve this math problem:</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-white tracking-widest">{num1} + {num2} = </span>
                <input 
                  type="number" 
                  value={captchaAnswer} 
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-24 bg-brand-bg border border-white/[0.08] focus:border-brand-accent/40 rounded-xl px-4 py-3 text-lg font-bold text-white text-center focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleCaptchaSubmit}
                  className="px-8 py-3 rounded-xl bg-brand-accent text-black font-bold transition-all duration-300 hover:scale-[1.02]"
                >
                  Verify
                </button>
                <button 
                  onClick={() => setCommentStep('IDLE')}
                  className="px-6 py-3 rounded-xl bg-white/5 text-white font-semibold transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : commentStep === 'LOADING' ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-xl border-4 border-brand-accent/20 border-t-brand-accent animate-spin"></div>
              <div className="text-brand-textMuted font-medium">Posting your comment...</div>
            </div>
          ) : commentStep === 'SUCCESS' ? (
            <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 glow-green">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-xl font-bold text-white">Comment posted successfully!</div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
