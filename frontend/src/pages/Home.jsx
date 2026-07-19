import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const recipesPerPage = 8; 

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
               let url = `${import.meta.env.VITE_API_URL}/api/recipes`;
                if (category) {
                    url = `${import.meta.env.VITE_API_URL}/api/recipes/category/${category}`;
                } else if (search) {
                    url = `${import.meta.env.VITE_API_URL}/api/recipes/search?name=${search}`;
                }
                const res = await axios.get(url);
                setRecipes(res.data);
                setCurrentPage(1); 
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
        
        const saved = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        setFavoriteIds(saved);
    }, [search, category]);

    const handleFavoriteToggle = () => {
        const saved = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        setFavoriteIds(saved);
        setShowFavoritesOnly(!showFavoritesOnly);
        setCurrentPage(1);
    };

    const parseCookTime = (timeStr) => {
        const num = parseInt(timeStr);
        if (isNaN(num)) return 0;
        if (timeStr.toLowerCase().includes('hr') || timeStr.toLowerCase().includes('hour')) {
            return num * 60;
        }
        return num;
    };

    const filteredRecipes = showFavoritesOnly 
        ? recipes.filter(recipe => favoriteIds.includes(recipe._id))
        : recipes;

    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'time-asc') return parseCookTime(a.cookTime) - parseCookTime(b.cookTime);
        if (sortBy === 'time-desc') return parseCookTime(b.cookTime) - parseCookTime(a.cookTime);
        return 0; 
    });

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = sortedRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
    const totalPages = Math.ceil(sortedRecipes.length / recipesPerPage);

    return (
        <div className="home-container">
            <SearchBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} />
            
            <div className="controls-row">
                <div>
                    <label htmlFor="sortSelect" style={{ fontWeight: 'bold' }}>Sort By: </label>
                    <select 
                        id="sortSelect"
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="">Default</option>
                        <option value="name-asc">Alphabetical (A-Z)</option>
                        <option value="name-desc">Alphabetical (Z-A)</option>
                        <option value="time-asc">Cooking Time (Low to High)</option>
                        <option value="time-desc">Cooking Time (High to Low)</option>
                    </select>
                </div>

                <label className="fav-toggle-label">
                    <input 
                        type="checkbox" 
                        checked={showFavoritesOnly} 
                        onChange={handleFavoriteToggle} 
                    />
                    Show My Favorites Only
                </label>

                <span className="recipe-counter">
                    Total Recipes Found: {sortedRecipes.length}
                </span>
            </div>

            <hr className="divider" />

            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p style={{ marginTop: '10px' }}>Fetching Delicious Content...</p>
                </div>
            ) : (
                <>
                    <div className="recipe-grid">
                        {currentRecipes.length > 0 ? (
                            currentRecipes.map(recipe => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))
                        ) : (
                            <div className="no-recipes">
                                <h3>No recipes found matching your criteria.</h3>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;