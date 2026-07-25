import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    category: 'Breakfast',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.value]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Recipe Title
          <input type="text" name="title" onChange={handleChange} required />
        </label>
        <label>
          Image URL
          <input type="text" name="image" onChange={handleChange} required />
        </label>
        <label>
          Ingredients (separated by commas)
          <textarea name="ingredients" onChange={handleChange} required />
        </label>
        <label>
          Instructions
          <textarea name="instructions" onChange={handleChange} required />
        </label>
        <label>
          Cooking Time (in minutes)
          <input type="number" name="cookingTime" onChange={handleChange} required />
        </label>
        <label>
          Category
          <select name="category" onChange={handleChange}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverages">Beverages</option>
          </select>
        </label>
        <button type="submit" className="btn-submit-form">
          Save Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;