const LandingPage = () => {
  return (
    <div className="page-container fade-in">
      <header className="hero">
        <h1 className="hero-title">Hello, I'm <span className="highlight">Valerii Babaiev</span></h1>
        <p className="hero-subtitle">Software Engineer, AI Enthusiast, and Creator</p>
      </header>
      <section className="about-section">
        <h2>About Me</h2>
        <p>Welcome to my personal working card. Here you can find my latest updates, AI explorations, and written articles.</p>
        <div className="card-grid">
          <div className="card">
            <h3>Projects</h3>
            <p>Building scalable systems and exploring the cutting edge of AI.</p>
          </div>
          <div className="card">
            <h3>Experience</h3>
            <p>Check out my resume and work history to see what I've been building.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
