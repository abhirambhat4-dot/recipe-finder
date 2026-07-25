import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching recipe:', err);
        setLoading(false);
      });
  }, [id]);

  const toggleCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>Loading Recipe Details...</div>;
  }

  if (!recipe) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>Recipe Not Found</div>;
  }

  // Handle both array and string formats for ingredients/instructions
  const recipeName = recipe.name || recipe.title || 'Untitled Recipe';
  const displayTime = recipe.cookingTime || recipe.cookTime || recipe.prepTime || '15 mins';
  
  const rawIngredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients 
    : (recipe.ingredients || '').split(',').map(item => item.trim()).filter(Boolean);

  const rawInstructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : (recipe.instructions || '').split('\n').map(item => item.trim()).filter(Boolean);

  return (
    <div className="recipe-details-wrapper">
      {/* Back Button */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 15px auto', padding: '0 20px' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
          ← Back to All Recipes
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div className="detail-hero-banner" style={{ backgroundImage: `url(${recipe.image})` }}>
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <span className="detail-category-badge">{recipe.category || 'General'}</span>
            <h1 className="detail-recipe-title">{recipeName}</h1>
            <div className="detail-recipe-meta">
              <span>⏱️ Cook Time: <strong>{displayTime}</strong></span>
              <span>•</span>
              <span>🥗 Ingredients: <strong>{rawIngredients.length} Items</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (2 Columns) */}
      <div className="detail-main-content">
        {/* Left Column: Ingredients Checklist */}
        <div className="detail-column">
          <h2 className="detail-section-title">Ingredients</h2>
          <p className="detail-section-subtitle">Check items as you prepare:</p>

          <div className="ingredients-checklist">
            {rawIngredients.map((item, index) => (
              <label 
                key={index} 
                className={`ingredient-item ${checkedIngredients[index] ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={!!checkedIngredients[index]}
                  onChange={() => toggleCheck(index)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right Column: Cooking Steps */}
        <div className="detail-column">
          <h2 className="detail-section-title">Preparation Steps</h2>
          <p className="detail-section-subtitle">Follow these instructions carefully:</p>

          <div className="instructions-timeline">
            {rawInstructions.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;