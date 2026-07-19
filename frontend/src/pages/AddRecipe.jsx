import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddRecipe = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        ingredients: '',
        steps: '',
        cookTime: '',
        category: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const processedData = {
            ...formData,
            ingredients: formData.ingredients.split(',').map(i => i.trim()),
            steps: formData.steps.split(',').map(s => s.trim())
        };
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/recipes`, processedData);
            navigate('/admin');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="form-wrapper">
            <h2>Add New Recipe</h2>
            <form className="recipe-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Recipe Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
                <input 
                    type="text" 
                    placeholder="Image URL" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    required
                />
                <textarea 
                    placeholder="Ingredients (separated by commas)" 
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    required
                ></textarea>
                <textarea 
                    placeholder="Steps (separated by commas)" 
                    value={formData.steps}
                    onChange={(e) => setFormData({...formData, steps: e.target.value})}
                    required
                ></textarea>
                <input 
                    type="text" 
                    placeholder="Cook Time (e.g., 20 mins)" 
                    value={formData.cookTime}
                    onChange={(e) => setFormData({...formData, cookTime: e.target.value})}
                    required
                />
                <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverages">Beverages</option>
                </select>
                <button type="submit" className="nav-box-btn">Submit</button>
            </form>
        </div>
    );
};

export default AddRecipe;