import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categoryAPI } from '../api/apiClient';
import { Icon } from './Icons';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Icon name="Book" />Novel Reading System
        </Link>
        <div className="navbar-menu">
          <Link to="/novels" className="nav-link">Novels</Link>
          
          <div className="category-dropdown-wrapper">
            <button 
              className="nav-link category-dropdown-btn"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              Categories <Icon name="Plus" />
            </button>
            {showCategoryDropdown && (
              <div className="category-dropdown-menu">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.CategoryID}
                      to={`/category/${category.CategoryID}`}
                      className="category-dropdown-item"
                      onClick={() => setShowCategoryDropdown(false)}
                    >
                      {category.CategoryName}
                    </Link>
                  ))
                ) : (
                  <div className="category-dropdown-item disabled">No categories</div>
                )}
              </div>
            )}
          </div>
          
          {user ? (
            <>
              {user.role === 'Admin' && <Link to="/admin" className="nav-link">Admin</Link>}
              {user.role === 'Author' && <Link to="/author" className="nav-link">Author</Link>}
              <Link to="/favorites" className="nav-link">Favorites</Link>
              <Link to="/reading-history" className="nav-link">Reading History</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
