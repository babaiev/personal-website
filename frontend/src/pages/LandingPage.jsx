import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const contentData = {
  corporate: {
    val: { title: "Virtual Autonomous Leader", desc: "Managing complex projects, operations, and technical structures at EPAM & beyond." },
    3: { title: "3rd generation iteration", desc: "Because the first two iterations burned out while performing manual backlog cleaning operations." },
    r: { title: "Remote operations only", desc: "Operating continuously across clouds, systems, and workspaces from any coordinates." },
    11: { title: "One-to-One pairing ratio with AI", desc: "Harnessing advanced intelligence workflows for accelerated design, writing, and coding." }
  },
  honest: {
    val: { title: "Virtual Assistant's Local", desc: "Just a guy from Bucha trying to automate his life before it automates him." },
    3: { title: "3mployee", desc: "Corporate cog by day, mad scientist with Google Apps Script by night." },
    r: { title: "Responsible for", desc: "Taking the blame when the sprint fails or the API key expires." },
    11: { title: "1nventing 1mpediments", desc: "Because if the process is too smooth, are we even doing Agile right?" }
  }
};

const LandingPage = ({ onSubscribeClick }) => {
  const [isHonestMode, setIsHonestMode] = useState(false);
  const mode = isHonestMode ? 'honest' : 'corporate';
  const data = contentData[mode];

  return (
    <div className="space-y-12 animate-fade-in">
      <Helmet>
        <title>VAL3R11 | Home</title>
        <meta name="description" content="Virtual Autonomous Leader. 3rd generation. Remote only. One-to-One with AI." />
      </Helmet>

      <div className="text-center max-w-3xl mx-auto space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
          Interactive Dev Hub
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
          Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-emerald-400 drop-shadow-[0_0_15px_rgba(46,229,107,0.15)]">VAL3R11</span>
        </h1>
        <p className="text-brand-textMuted text-lg md:text-xl leading-relaxed">
          A tech automation hub, software engineering blog, and personal playground crafted with high-level AI collaboration.
        </p>
      </div>

      {/* THE TOGGLE */}
      <div className="flex items-center justify-center gap-4 py-4">
        <span className={`text-sm transition-colors ${!isHonestMode ? 'font-bold text-brand-accent' : 'font-medium text-brand-textMuted'}`}>Corporate Mode</span>
        <button 
          onClick={() => setIsHonestMode(!isHonestMode)} 
          className="relative w-14 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none border border-white/[0.05]"
        >
          <span className={`absolute left-1 top-1 w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${isHonestMode ? 'translate-x-7 bg-brand-accent' : 'bg-white'}`}></span>
        </button>
        <span className={`text-sm transition-colors ${isHonestMode ? 'font-bold text-brand-accent' : 'font-medium text-brand-textMuted'}`}>Honest Mode</span>
      </div>

      {/* Decoding Name Grid */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 gap-4 relative">
        <div className="bg-brand-card/60 backdrop-blur border-glow rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent flex-shrink-0 text-lg">VAL</div>
          <div className="pt-1 transition-all duration-300">
            <h4 className="text-white font-semibold text-lg mb-1">{data.val.title}</h4>
            <p className="text-brand-textMuted text-sm">{data.val.desc}</p>
          </div>
        </div>

        <div className="bg-brand-card/60 backdrop-blur border-glow rounded-2xl p-6 flex items-start gap-4 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent flex-shrink-0 text-lg">3</div>
          <div className="pt-1 transition-all duration-300">
            <h4 className="text-white font-semibold text-lg mb-1">{data['3'].title}</h4>
            <p className="text-brand-textMuted text-sm">{data['3'].desc}</p>
          </div>
        </div>

        <div className="bg-brand-card/60 backdrop-blur border-glow rounded-2xl p-6 flex items-start gap-4 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent flex-shrink-0 text-lg">R</div>
          <div className="pt-1 transition-all duration-300">
            <h4 className="text-white font-semibold text-lg mb-1">{data.r.title}</h4>
            <p className="text-brand-textMuted text-sm">{data.r.desc}</p>
          </div>
        </div>

        <div className="bg-brand-card/60 backdrop-blur border-glow rounded-2xl p-6 flex items-start gap-4 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent flex-shrink-0 text-lg">11</div>
          <div className="pt-1 transition-all duration-300">
            <h4 className="text-white font-semibold text-lg mb-1">{data['11'].title}</h4>
            <p className="text-brand-textMuted text-sm">{data['11'].desc}</p>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-6 pb-12">
        <button onClick={onSubscribeClick} className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-accent to-emerald-500 text-black font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(46,229,107,0.3)]">
          Subscribe to Newsletter
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
