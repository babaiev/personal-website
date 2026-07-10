const Footer = () => {
  return (
    <footer className="border-t border-white/[0.04] bg-brand-bg py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-textMuted text-center md:text-left">
        <div>© 2026 <span className="text-white font-semibold">ValAndAI</span>. All rights reserved.</div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span>Designed & automated via AI collaboration</span>
          <span className="px-2 py-1 rounded bg-white/5 font-mono text-[10px]">v{import.meta.env.VITE_APP_VERSION}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
