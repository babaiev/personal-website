const LandingPage = () => {
  return (
    <div className="page-container fade-in">
      <header className="hero" style={{ paddingBottom: '2rem' }}>
        <h1 className="hero-title">Hello, I'm <span className="highlight">VAL3R11</span></h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <div className="card" style={{ textAlign: 'left', maxWidth: '600px', width: '100%', padding: '2rem 3rem' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>VAL</strong> — Virtual Autonomous Leader.</li>
              <li style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>3</strong> — 3rd generation (because the first two burned out while cleaning the backlog manually).</li>
              <li style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-primary)' }}>R</strong> — Remote only.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>11</strong> — One-to-One with AI.</li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
