import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { BlogHome } from './pages/BlogHome';
import { BlogPost } from './pages/BlogPost';
import { About } from './pages/About';
import { ArticleReviewUnified } from './pages/ArticleReviewUnified';
import { Footer } from './components/Footer';

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BlogHome />} />
          <Route path="/blog" element={<BlogHome />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/review/:slug" element={<ArticleReviewUnified />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
