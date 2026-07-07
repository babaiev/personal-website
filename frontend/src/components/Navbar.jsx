import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MySpace</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/newsfeed" className={location.pathname === '/newsfeed' ? 'active' : ''}>AI News</Link>
        </li>
        <li>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
