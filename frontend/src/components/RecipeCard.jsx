import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        setIsFavorite(savedFavorites.includes(recipe._id));
    }, [recipe._id]);

    const toggleFavorite = (e) => {
        e.stopPropagation(); 
        let savedFavorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        
        if (savedFavorites.includes(recipe._id)) {
            savedFavorites = savedFavorites.filter(id => id !== recipe._id);
            setIsFavorite(false);
        } else {
            savedFavorites.push(recipe._id);
            setIsFavorite(true);
        }
        
        localStorage.setItem('recipeFavorites', JSON.stringify(savedFavorites));
    };

    return (
        <div className="recipe-card">
            <div className="card-fav-badge">
                <input 
                    type="checkbox" 
                    id={`fav-${recipe._id}`}
                    checked={isFavorite}
                    onChange={toggleFavorite}
                />
                <label htmlFor={`fav-${recipe._id}`}>Favorite</label>
            </div>

            <Link to={`/recipe/${recipe._id}`} className="card-link">
                <img 
                    src={recipe.image} 
                    alt={recipe.name} 
                    className="card-img" 
                />
                <div className="card-info">
                    <h3 className="card-title">{recipe.name}</h3>
                    <p className="card-meta">📁 {recipe.category}</p>
                    <p className="card-meta">⏱️ {recipe.cookTime}</p>
                </div>
            </Link>
        </div>
    );
};

export default RecipeCard;