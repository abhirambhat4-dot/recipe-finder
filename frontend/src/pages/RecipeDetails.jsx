import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`);
                setRecipe(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipeDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>Loading recipe details...</p>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="no-recipes">
                <h3>Recipe not found.</h3>
            </div>
        );
    }

    return (
        <div className="recipe-details-container">
            
            {/* Section 1: Main Info (Pic, Category, and Time) */}
            <div className="recipe-section recipe-main-info">
                <h2>{recipe.name}</h2>
                <img src={recipe.image} alt={recipe.name} />
                <p style={{ fontSize: '1.1rem', margin: '10px 0' }}>
                    <strong>Category:</strong> {recipe.category}
                </p>
                <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>
                    <strong>Cooking Time:</strong> {recipe.cookTime}
                </p>
            </div>

            {/* Section 2: Ingredients */}
            <div className="recipe-section" style={{ textAlign: 'center' }}>
                <div className="red-heading-box">Ingredients</div>
                <ul className="recipe-list">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>

            {/* Section 3: Preparation Steps */}
            <div className="recipe-section" style={{ textAlign: 'center' }}>
                <div className="red-heading-box">Preparation Steps</div>
                <ol className="recipe-list">
                    {recipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>

        </div>
    );
};

export default RecipeDetails;