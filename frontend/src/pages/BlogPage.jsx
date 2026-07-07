const BlogPage = () => {
  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h1>My Blog</h1>
        <p>Thoughts, tutorials, and articles on software engineering.</p>
      </header>
      <div className="blog-grid">
        {/* Placeholder for API integration */}
        <article className="card blog-card">
          <div className="blog-meta">
            <span className="tag">Engineering</span>
            <span className="date">Jul 1, 2026</span>
          </div>
          <h2>Building Scalable Backends with Django</h2>
          <p>A deep dive into architecture patterns and performance optimizations when scaling Django applications...</p>
          <button className="read-more">Read Article</button>
        </article>
        <article className="card blog-card">
          <div className="blog-meta">
            <span className="tag">Frontend</span>
            <span className="date">Jun 20, 2026</span>
          </div>
          <h2>Why I chose React and Vite in 2026</h2>
          <p>The frontend ecosystem is always changing. Here is a breakdown of why this stack remains my go-to choice...</p>
          <button className="read-more">Read Article</button>
        </article>
      </div>
    </div>
  );
};

export default BlogPage;
