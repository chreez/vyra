import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { BlogHome } from './pages/BlogHome';
import { BlogPost } from './pages/BlogPost';
import { About } from './pages/About';
import { ArticleReviewUnified } from './pages/ArticleReviewUnified';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { EnergyLevelProvider } from './context/EnergyLevelContext';
import { EnergyLevelSplashB } from './components/EnergyLevelSplashB';
// Alternative: import { EnergyLevelSplashA } from './components/EnergyLevelSplashA';

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <EnergyLevelSplashB />
      {/* Alternative modal version: <EnergyLevelSplashA /> */}
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <EnergyLevelProvider>
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
    </EnergyLevelProvider>
  );
}

export default App;
