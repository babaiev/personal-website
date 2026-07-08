import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2026;
  const yearDisplay = currentYear > startYear ? `${startYear} - ${currentYear}` : startYear;

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {yearDisplay} <span className="highlight">VAL3R11</span>. All rights reserved.</p>
        <p className="footer-version">v{import.meta.env.VITE_APP_VERSION}</p>
      </div>
    </footer>
  );
};

export default Footer;
