import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const ADMIN_EMAIL = 'abhirambhat4@gmail.com';

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="brand-logo">
        RECIPE FINDER
      </Link>

      <div className="navbar-right-menu">
        <Link to="/" className="nav-red-box-btn">
          HOME
        </Link>

        {user && user.email.toLowerCase() === ADMIN_EMAIL && (
          <Link to="/admin" className="nav-red-box-btn">
            Admin Dashboard
          </Link>
        )}

        {user ? (
          <button onClick={handleLogoutClick} className="nav-red-box-btn">
            Logout ({user.email.split('@')[0]})
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-red-box-btn">
              Log In
            </Link>
            <Link to="/signup" className="nav-red-box-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;