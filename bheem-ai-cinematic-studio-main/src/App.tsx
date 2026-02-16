import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useBlinkAuth } from '@blinkdotnew/react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import Navbar from './components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated, isLoading } = useBlinkAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/editor/:id?" 
              element={isAuthenticated ? <ProjectEditor /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
