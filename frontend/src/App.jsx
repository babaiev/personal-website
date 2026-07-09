import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubscribeModal from './components/SubscribeModal';
import LandingPage from './pages/LandingPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import NewsfeedPage from './pages/NewsfeedPage';
import './App.css';

function App() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between selection:bg-brand-accent selection:text-black">
          <Helmet>
            <meta name="version" content={import.meta.env.VITE_APP_VERSION} />
          </Helmet>
          <Navbar onSubscribeClick={() => setIsSubscribeOpen(true)} />
        <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12">
          <Routes>
            <Route path="/" element={<LandingPage onSubscribeClick={() => setIsSubscribeOpen(true)} />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/newsfeed" element={<NewsfeedPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </main>
        <Footer />
        <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;
