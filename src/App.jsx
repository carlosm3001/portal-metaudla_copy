import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProyectoDetalle from './pages/ProyectoDetalle';
import Nosotros from './pages/Nosotros';
import Foro from './pages/Foro';
import NewThread from './pages/forum/NewThread';
import ThreadPage from './pages/forum/ThreadPage';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import NewBlogPost from './pages/NewBlogPost';
import EditBlogPost from './pages/EditBlogPost'; // Import EditBlogPost
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import NewNews from './pages/NewNews';
import RequestProject from './pages/RequestProject';

// Auth
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Smooth scroll effect with Lenis
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { isLoggedIn, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProyectoDetalle />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="foro" element={<Foro />} />
        <Route path="foro/hilo/:id" element={<ThreadPage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogPostDetail />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsDetail />} />
        
        {/* Auth Routes that should only be accessible when logged out */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="projects/new" element={
          <ProtectedRoute><NewProject /></ProtectedRoute>
        } />
        <Route path="foro/nuevo" element={
          <ProtectedRoute><NewThread /></ProtectedRoute>
        } />
        <Route path="blog/new" element={
          <ProtectedRoute><NewBlogPost /></ProtectedRoute>
        } />
        <Route path="blog/:id/edit" element={
          <ProtectedRoute><EditBlogPost /></ProtectedRoute>
        } />
        <Route path="news/new" element={
          <ProtectedRoute><NewNews /></ProtectedRoute>
        } />
        <Route path="request-project" element={
          <ProtectedRoute><RequestProject /></ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute>
            <Admin isLoggedIn={isLoggedIn} userRole={userRole} />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;