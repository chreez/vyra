import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogHome } from './pages/BlogHome';
import { BlogPost } from './pages/BlogPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/blog" element={<BlogHome />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
