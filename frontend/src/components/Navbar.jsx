import { NavLink, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Navbar = ({ onSubscribeClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-brand-bg/80 backdrop-blur-md border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="VAL3R11 Logo" className="w-8 h-8 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
          <span className="text-xl font-extrabold tracking-wider text-white">
            VAL<span className="text-brand-accent transition-all duration-300 group-hover:glow-text">3</span>R11
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-textMuted">
          <NavLink to="/" className={({ isActive }) => `transition-colors hover:text-white relative py-1 ${isActive ? 'text-brand-accent' : ''}`}>
            {({ isActive }) => (
              <>
                Home
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-full"></span>}
              </>
            )}
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => `transition-colors hover:text-white relative py-1 ${isActive ? 'text-brand-accent' : ''}`}>
            {({ isActive }) => (
              <>
                Portfolio
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-full"></span>}
              </>
            )}
          </NavLink>
          <NavLink to="/newsfeed" className={({ isActive }) => `transition-colors hover:text-white relative py-1 ${isActive ? 'text-brand-accent' : ''}`}>
            {({ isActive }) => (
              <>
                Newsfeed
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-full"></span>}
              </>
            )}
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => `transition-colors hover:text-white relative py-1 ${isActive ? 'text-brand-accent' : ''}`}>
            {({ isActive }) => (
              <>
                Blog
                {isActive && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-full"></span>}
              </>
            )}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onSubscribeClick} className="relative group px-5 py-2.5 rounded-full bg-brand-accent text-black font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(46,229,107,0.4)]">
            Subscribe
          </button>
          <button className="md:hidden text-white p-2 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
