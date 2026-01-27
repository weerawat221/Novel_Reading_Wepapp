import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NovelsPage } from './pages/NovelsPage';
import { NovelDetailPage } from './pages/NovelDetailPage';
import { NovelsByCategoryPage } from './pages/NovelsByCategoryPage';
import { ChapterReadingPage } from './pages/ChapterReadingPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthorPage } from './pages/AuthorPage';
import { AuthorChapterPage } from './pages/AuthorChapterPage';
import { AdminPage } from './pages/AdminPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ReadingHistoryPage } from './pages/ReadingHistoryPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<NovelsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/novels" element={<NovelsPage />} />
          <Route path="/novel/:id" element={<NovelDetailPage />} />
          <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterReadingPage />} />
          <Route path="/category/:categoryId" element={<NovelsByCategoryPage />} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/reading-history" element={<PrivateRoute><ReadingHistoryPage /></PrivateRoute>} />
          <Route 
            path="/profile" 
            element={<PrivateRoute><ProfilePage /></PrivateRoute>} 
          />
          <Route 
            path="/author" 
            element={<PrivateRoute requiredRole="Author"><AuthorPage /></PrivateRoute>} 
          />
          <Route 
            path="/author/chapters/:novelId" 
            element={<PrivateRoute requiredRole="Author"><AuthorChapterPage /></PrivateRoute>} 
          />
          <Route 
            path="/admin" 
            element={<PrivateRoute requiredRole="Admin"><AdminPage /></PrivateRoute>} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
