import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Terminal, Code, Cpu, Home, Briefcase, Trees } from 'lucide-react';

// ----------------------------------------------------------------------
// Matrix Scramble Text Effect Component
// ----------------------------------------------------------------------
const MatrixText = ({ text, isAiView, as: Component = 'span', className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '01#[]{}<>/\\!@$%^&*';

  useEffect(() => {
    if (isAiView) {
      let frame = 0;
      const totalFrames = Math.min(40, text.length * 1.5); 
      const length = text.length;
      
      const interval = setInterval(() => {
        let currentStr = '';
        for (let i = 0; i < length; i++) {
          const threshold = (i / length) * totalFrames;
          if (frame >= threshold) {
            currentStr += text[i];
          } else if (text[i] === ' ' || text[i] === '\n') {
            currentStr += text[i];
          } else {
            currentStr += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(currentStr);
        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayText(text); 
        }
        frame++;
      }, 25);
      return () => clearInterval(interval);
    } else {
      // Human Mode: Fast Typewriter Effect
      let i = 0;
      setDisplayText('');
      const interval = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
        }
      }, 15); // Adjust speed here
      return () => clearInterval(interval);
    }
  }, [text, isAiView]);

  return <Component className={className}>{displayText}</Component>;
};

const LandingPage = ({ onSubscribeClick }) => {
  const [isAiView, setIsAiView] = useState(false);

  // Inject global cursor style when AI mode is active
  useEffect(() => {
    if (isAiView) {
      document.body.style.cursor = 'crosshair';
      const style = document.createElement('style');
      style.id = 'ai-cursor-style';
      style.innerHTML = `* { cursor: crosshair !important; }`;
      document.head.appendChild(style);
      
      return () => {
        document.body.style.cursor = 'default';
        const injectedStyle = document.getElementById('ai-cursor-style');
        if (injectedStyle) injectedStyle.remove();
      };
    }
  }, [isAiView]);

  // Content Data
  const content = {
    hero: {
      human: {
        title: "Hello, I'm Val",
        body: "By day, I manage release cycles and clear out backlogs, but by night, I turn into an automation maniac. I write Google Apps Script, connect home devices into a single network, and try to automate my life before it automates me."
      },
      ai: {
        title: ">_ System Log: Subject 'Valerii' initialized.",
        body: "Carbon-based lifeform. Specialization: Project Management. Management efficiency for crisis situations and production rollbacks — 98%. Actively utilizes my computational power for API parsing and script writing. Requires regular coffee consumption to maintain uptime."
      }
    },
    cards: [
      {
        id: 'work',
        humanLetter: 'P',
        aiLetter: '[E]',
        humanTitle: "Project Management",
        humanDesc: "Keeping my finger on the pulse of SCM releases, smoothing out rough edges between teams, and making sure production doesn't go down (and if it does, I get it back up fast).",
        aiTitle: "Execution Threads",
        aiDesc: "Workflow monitoring and optimization. Subject delegates routine tasks to me while engaging in high-level troubleshooting.",
        iconHuman: <Briefcase size={20} className="text-emerald-400" />,
        iconAi: <Terminal size={20} className="text-green-500" />
      },
      {
        id: 'home',
        humanLetter: 'S',
        aiLetter: '<H>',
        humanTitle: "Home Automations",
        humanDesc: "I hate doing things manually twice. Tied my EcoFlow, Ajax smart sockets, and routers into a single, uninterrupted organism.",
        aiTitle: "Hardware Integration",
        aiDesc: "Smart home telemetry analysis. Detected increased subject interest in DIN rails and power grid status monitoring. Network infrastructure: stable.",
        iconHuman: <Home size={20} className="text-emerald-400" />,
        iconAi: <Cpu size={20} className="text-green-500" />
      },
      {
        id: 'life',
        humanLetter: 'L',
        aiLetter: '{O}',
        humanTitle: "Bucha Life",
        humanDesc: "Landscaping my dacha, fighting for the perfect lawn, watching psychological thrillers, and trying to explain to my daughters why dad is sitting in the terminal again.",
        aiTitle: "Offline Activities",
        aiDesc: "Subject periodically leaves the Wi-Fi coverage zone for soil-based operations (Project 'Lawn'). Detected high loyalty to Yorgos Lanthimos' cinematography.",
        iconHuman: <Trees size={20} className="text-emerald-400" />,
        iconAi: <Code size={20} className="text-green-500" />
      }
    ]
  };

  return (
    <div className={`w-full flex flex-col items-center animate-fade-in ${isAiView ? 'font-mono' : ''}`}>
      <Helmet>
        <title>ValAndAI | Home</title>
        <meta name="description" content="Project Management by day, Home Automations by night." />
      </Helmet>

      {/* Main Content Wrapper */}
      <div className="flex-1 w-full max-w-3xl px-6 flex flex-col items-center mt-8 md:mt-12 pb-24">
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium transition-colors ${!isAiView ? 'text-emerald-400' : 'text-zinc-600'}`}>
            Human Mode
          </span>
          
          <button 
            onClick={() => setIsAiView(!isAiView)}
            className={`w-14 h-7 rounded-full p-1 flex items-center transition-colors duration-300 ${
              isAiView ? 'bg-zinc-800 border border-green-500/50' : 'bg-zinc-800 border border-zinc-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
              isAiView ? 'translate-x-7 shadow-[0_0_8px_#22c55e]' : 'translate-x-0'
            }`} />
          </button>
          
          <span className={`text-sm font-medium transition-colors ${isAiView ? 'text-green-500 uppercase tracking-widest' : 'text-zinc-500'}`}>
            AI View
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center flex flex-col items-center w-full">
          <div className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase mb-8 border flex items-center gap-2 ${
            isAiView 
            ? 'border-green-500/50 text-green-500 bg-green-500/5' 
            : 'border-zinc-700/50 text-emerald-400 bg-zinc-800/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isAiView ? 'bg-green-500 animate-pulse' : 'bg-emerald-400'}`}></span>
            Interactive Dev Hub
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight min-h-[120px] md:min-h-[80px] flex items-center justify-center w-full">
            {isAiView ? (
              <MatrixText 
                text={content.hero.ai.title} 
                isAiView={isAiView} 
                className="text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.2)]"
              />
            ) : (
              <span className="text-white">
                Hello, I'm <span className="text-emerald-400">Val</span>
              </span>
            )}
          </h1>

          <div className={`text-lg md:text-xl leading-relaxed max-w-2xl min-h-[120px] ${isAiView ? 'text-green-500/80 text-base md:text-lg' : 'text-zinc-400'}`}>
            <MatrixText 
              text={isAiView ? content.hero.ai.body : content.hero.human.body} 
              isAiView={isAiView} 
            />
          </div>
        </div>

        {/* Grid Sections (Vertical Stack mirroring reference image) */}
        <div className="w-full mt-12 flex flex-col gap-5">
          {content.cards.map((card, idx) => (
            <div 
              key={card.id} 
              className={`w-full rounded-2xl p-6 transition-all duration-500 flex flex-col md:flex-row gap-6 items-start md:items-center border ${
                isAiView 
                ? 'bg-black border-green-900/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                : 'bg-brand-card border-brand-accent/10'
              }`}
            >
              {/* Card Icon/Letter Box */}
              <div className={`shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold transition-colors duration-500 ${
                isAiView
                ? 'bg-green-950/30 border border-green-500/30 text-green-500'
                : 'bg-brand-bg/50 border border-brand-accent/20 text-brand-accent'
              }`}>
                {isAiView ? card.aiLetter : card.humanLetter}
              </div>

              {/* Card Text Content */}
              <div className="flex-1 space-y-2 w-full">
                <h3 className={`text-xl font-semibold tracking-tight transition-colors duration-500 ${isAiView ? 'text-green-400' : 'text-zinc-200'}`}>
                  <MatrixText 
                    text={isAiView ? card.aiTitle : card.humanTitle} 
                    isAiView={isAiView} 
                  />
                </h3>
                <p className={`text-sm leading-relaxed transition-colors duration-500 ${isAiView ? 'text-green-600/80' : 'text-zinc-400'}`}>
                  <MatrixText 
                    text={isAiView ? card.aiDesc : card.humanDesc} 
                    isAiView={isAiView} 
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Subscribe Button */}
        <div className="text-center pt-16">
          <button onClick={onSubscribeClick} className={`px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 hover:scale-105 ${
            isAiView
            ? 'bg-transparent border border-green-500 text-green-500 hover:bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)] uppercase'
            : 'bg-gradient-to-r from-brand-accent to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(46,229,107,0.3)]'
          }`}>
            {isAiView ? '>_ INITIALIZE_SUBSCRIPTION()' : 'Subscribe to Newsletter'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
