import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogHome } from './pages/BlogHome';
import { BlogPost } from './pages/BlogPost';
import { ArticleReviewUnified } from './pages/ArticleReviewUnified';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/review/:slug" element={<ArticleReviewUnified />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
