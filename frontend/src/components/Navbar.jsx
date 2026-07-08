import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSubscribeClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'at-top'}`}>
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}><span className="logo-orange">VAL</span><span className="highlight">3R11</span></Link>
      </div>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Portfolio
          </NavLink>
        </li>
        <li>
          <NavLink to="/newsfeed" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Newsfeed
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Blog
          </NavLink>
        </li>
        <li>
          <button className="subscribe-btn-nav" onClick={() => { onSubscribeClick(); closeMenu(); }}>Subscribe</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
