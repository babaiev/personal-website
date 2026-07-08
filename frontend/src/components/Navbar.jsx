import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSubscribeClick }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/"><span className="highlight">VAL3R11</span></Link>
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
        <li>
          <button className="subscribe-btn-nav" onClick={onSubscribeClick}>Subscribe</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
