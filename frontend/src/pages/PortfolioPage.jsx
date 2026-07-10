import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchPortfolio } from '../api';
import { Briefcase, Code, Terminal } from 'lucide-react';

const PortfolioPage = () => {
  const [data, setData] = useState({ projects: [], experiences: [], skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPortfolio();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-16 animate-fade-in max-w-6xl mx-auto w-full">
      <Helmet>
        <title>ValAndAI | Portfolio</title>
        <meta name="description" content="Explore the projects, experience, and skills of ValAndAI." />
      </Helmet>
      
      <header className="text-center max-w-3xl mx-auto space-y-4 pt-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">Portfolio</h1>
        <p className="text-brand-textMuted text-lg">Projects, Experience, and Skills</p>
      </header>

      {loading ? (
        <div className="flex justify-center mt-12">
          <div className="w-12 h-12 rounded-2xl border-4 border-brand-accent/20 border-t-brand-accent animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-24">
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
              <Briefcase className="w-8 h-8 text-brand-accent" />
              <h2 className="text-3xl font-bold text-white">Experience</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.experiences.length > 0 ? data.experiences.map((exp) => (
                <div key={exp.id} className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                  <p className="text-brand-accent font-semibold mb-2">{exp.company}</p>
                  <p className="text-sm font-medium text-brand-textMuted mb-6 bg-white/5 inline-block px-3 py-1 rounded-full">{exp.start_date} — {exp.end_date || 'Present'}</p>
                  <p className="text-brand-textMuted leading-relaxed">{exp.description}</p>
                </div>
              )) : (
                <div className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 text-brand-textMuted italic">
                  No experience data yet. Add some in the Django admin!
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
              <Code className="w-8 h-8 text-brand-accent" />
              <h2 className="text-3xl font-bold text-white">Projects</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.length > 0 ? data.projects.map((proj) => (
                <div key={proj.id} className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-6 flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
                  {proj.image_url && (
                    <div className="rounded-2xl overflow-hidden mb-6 h-48">
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">{proj.title}</h3>
                  <p className="text-brand-textMuted mb-6 flex-grow">{proj.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/[0.04]">
                    {proj.tech_stack.map(skill => (
                      <span key={skill.id} className="px-3 py-1 rounded-lg bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-wide">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="mt-6 w-full py-3 rounded-xl bg-white/5 text-white font-semibold text-center transition-all hover:bg-brand-accent hover:text-black">
                      View Project
                    </a>
                  )}
                </div>
              )) : (
                <div className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8 text-brand-textMuted italic">
                  No project data yet. Add some in the Django admin!
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8 pb-12">
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
              <Terminal className="w-8 h-8 text-brand-accent" />
              <h2 className="text-3xl font-bold text-white">Skills</h2>
            </div>
            
            <div className="bg-brand-card/60 backdrop-blur border-glow rounded-3xl p-8">
              <div className="flex flex-wrap gap-3">
                {data.skills.length > 0 ? data.skills.map((skill) => (
                  <span key={skill.id} className="px-4 py-2 rounded-xl bg-white/5 text-white font-medium hover:bg-brand-accent hover:text-black transition-colors cursor-default">
                    {skill.name}
                  </span>
                )) : (
                  <span className="text-brand-textMuted italic">No skills added yet.</span>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
