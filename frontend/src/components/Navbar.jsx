import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Link to="/">VAL<span className="highlight">3R11</span></Link>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '-5px', marginLeft: '2px' }}>v{import.meta.env.VITE_APP_VERSION}</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link>
        </li>
        <li>
          <Link to="/newsfeed" className={location.pathname === '/newsfeed' ? 'active' : ''}>Newsfeed</Link>
        </li>
        <li>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
