import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchNewsfeed } from '../api';
import { Rss, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const NewsfeedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchNewsfeed(currentPage);
      setItems(data.results || []);
      setHasMore(!!data.next);
      setLoading(false);
    };
    loadData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasMore) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto w-full">
      <Helmet>
        <title>ValAndAI | AI Newsfeed</title>
        <meta name="description" content="Latest updates and curations from the AI world by ValAndAI." />
      </Helmet>
      
      <header className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-4">
          <Rss className="w-10 h-10 text-brand-accent" /> AI Newsfeed
        </h1>
        <p className="text-brand-textMuted text-lg">Latest updates and curations from the AI world.</p>
      </header>

      {loading ? (
        <div className="flex justify-center mt-12">
          <div className="w-12 h-12 rounded-2xl border-4 border-brand-accent/20 border-t-brand-accent animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6 pt-6">
          {items.length > 0 ? (
            <>
              {items.map((item) => (
                <div key={item.id} className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 flex flex-col md:flex-row gap-6 items-start">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-full md:w-48 h-32 object-cover rounded-xl border border-white/[0.04]" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-4">
                      <span className="px-3 py-1 rounded-lg bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-wide uppercase">{item.source_name}</span>
                      <span className="text-brand-textMuted text-sm font-medium">
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors flex items-center gap-2 group">
                        {item.title}
                        <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    </h3>
                    <p className="text-brand-textMuted leading-relaxed line-clamp-3">{item.summary}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center items-center gap-4 pt-8 pb-4">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <span className="text-brand-textMuted font-medium">Page {currentPage}</span>
                <button 
                  onClick={handleNextPage} 
                  disabled={!hasMore}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-brand-card/60 backdrop-blur rounded-3xl border border-white/[0.04]">
              <Rss className="w-12 h-12 text-brand-textMuted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No news found</h3>
              <p className="text-brand-textMuted">Check back later for the latest AI updates.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsfeedPage;
