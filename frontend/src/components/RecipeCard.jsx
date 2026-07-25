import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite }) => {
  const recipeName = recipe.name || recipe.title || 'Untitled Recipe';
  const displayTime = recipe.cookingTime || recipe.cookTime || recipe.prepTime || '15 mins';

  return (
    <div className="recipe-card">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe._id);
        }} 
        className="card-heart-btn"
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <Link to={`/recipe/${recipe._id}`} className="card-link">
        <img 
          src={recipe.image || 'https://via.placeholder.com/300x150'} 
          alt={recipeName} 
          className="card-img" 
        />
        <div className="card-info">
          <h3 className="card-title">{recipeName}</h3>
          <p className="card-meta">📁 {recipe.category}</p>
          <p className="card-meta">⏱️ {displayTime}</p>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;