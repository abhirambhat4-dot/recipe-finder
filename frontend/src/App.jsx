import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import Admin from './pages/Admin';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const ADMIN_EMAIL = 'abhirambhat4@gmail.com';
  const isAdmin = user && user.email && user.email.toLowerCase() === ADMIN_EMAIL;

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={isAdmin ? <Admin /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin/add" 
          element={isAdmin ? <AddRecipe /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/admin/edit/:id" 
          element={isAdmin ? <EditRecipe /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;