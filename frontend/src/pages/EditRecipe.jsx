import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    category: 'Breakfast',
  });

  useEffect(() => {
    fetch(`https://recipe-finder-backend-m8q2.onrender.com/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.name || data.title || '',
          image: data.image || '',
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join(', ')
            : data.ingredients || '',
          instructions: Array.isArray(data.instructions)
            ? data.instructions.join('\n')
            : data.instructions || '',
          cookingTime: data.cookingTime || data.cookTime || data.prepTime || '',
          category: data.category || 'Breakfast',
        });
      })
      .catch((err) => console.error('Error fetching recipe:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`https://recipe-finder-backend-m8q2.onrender.com/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.title, // Save under both name and title for compatibility
        }),
      });
      navigate('/admin');
    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Recipe Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Image URL
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ingredients (separated by commas)
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Instructions
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Cooking Time (in minutes)
          <input
            type="text"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverages">Beverages</option>
          </select>
        </label>

        <button type="submit" className="btn-submit-form">
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;