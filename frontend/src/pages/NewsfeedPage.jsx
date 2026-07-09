import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchNewsfeed } from '../api';
import { Rss, ExternalLink } from 'lucide-react';

const NewsfeedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchNewsfeed();
      setItems(result);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto w-full">
      <Helmet>
        <title>VAL3R11 | AI Newsfeed</title>
        <meta name="description" content="Latest updates and curations from the AI world by VAL3R11." />
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
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-4">
                <span className="px-3 py-1 rounded-lg bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-wide uppercase">{item.source}</span>
                <span className="text-brand-textMuted text-sm font-medium">
                  {new Date(item.published_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors flex items-center gap-2 group">
                  {item.title}
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </h3>
              <p className="text-brand-textMuted leading-relaxed">{item.summary}</p>
            </div>
          )) : (
            <>
              {/* Fallback Mock Data */}
              <div className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-4">
                  <span className="px-3 py-1 rounded-lg bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-wide uppercase">TechCrunch</span>
                  <span className="text-brand-textMuted text-sm font-medium">Jul 7, 2026</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 hover:text-brand-accent transition-colors cursor-pointer flex items-center gap-2 group">
                  New Large Language Model Released
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-brand-textMuted leading-relaxed">Exploring the capabilities of the latest state-of-the-art models in reasoning and coding tasks.</p>
              </div>
              
              <div className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-4">
                  <span className="px-3 py-1 rounded-lg bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-wide uppercase">Twitter</span>
                  <span className="text-brand-textMuted text-sm font-medium">Jul 5, 2026</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 hover:text-brand-accent transition-colors cursor-pointer flex items-center gap-2 group">
                  Breakthroughs in AI Agents
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-brand-textMuted leading-relaxed">Agents are now capable of automating complex workflows autonomously.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsfeedPage;
