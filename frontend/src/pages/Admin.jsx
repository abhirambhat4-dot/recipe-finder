import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all recipes from the backend
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('https://recipe-finder-backend-m8q2.onrender.com/api/recipes');
      const data = await response.json();
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  // Handle recipe deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await fetch(`https://recipe-finder-backend-m8q2.onrender.com/api/recipes/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRecipes(recipes.filter((recipe) => recipe._id !== id));
        } else {
          alert('Failed to delete recipe');
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  // Utility function to format cooking time without duplicate 'mins'
  const formatCookingTime = (time) => {
    if (!time) return '';
    // Removes any existing 'mins' or 'min' case-insensitively and trims spaces
    const cleanNumber = time.toString().replace(/mins?/gi, '').trim();
    return `${cleanNumber} mins`;
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading Admin Panel...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header-row">
        <h2>Admin Management</h2>
        <Link to="/admin/add" className="btn-add-recipe">
          + Add New Recipe
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Recipe Name</th>
            <th>Category</th>
            <th>Cooking Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe._id}>
              <td>{recipe.name || recipe.title}</td>
              <td>{recipe.category}</td>
              {/* Formatted cooking time to fix duplicate 'mins' */}
              <td>{formatCookingTime(recipe.cookingTime)}</td>
              <td>
                <Link to={`/admin/edit/${recipe._id}`} className="action-btn edit-btn">
                  Edit
                </Link>
                <button onClick={() => handleDelete(recipe._id)} className="action-btn delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;