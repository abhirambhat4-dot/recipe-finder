import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

const Home = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert', 'Beverages'];

  useEffect(() => {
    fetch('https://recipe-finder-backend-m8q2.onrender.com/api/recipes')
      .then((res) => res.json())
      .then((data) => {
        setRecipes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user && user.email) {
      fetch(`https://recipe-finder-backend-m8q2.onrender.com/api/users/${user.email}/favorites`)
        .then((res) => res.json())
        .then((data) => setFavorites(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err));
    } else {
      setFavorites([]);
    }
  }, [user]);

  const handleToggleFavorite = async (recipeId) => {
    if (!user) {
      alert('Please log in to save recipes to your favorites!');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://recipe-finder-backend-m8q2.onrender.com/api/users/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, recipeId }),
      });
      const updatedFavs = await response.json();
      setFavorites(updatedFavs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExploreClick = (e) => {
    e.preventDefault();
    setShowFavoritesOnly(false);
    document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFavoritesClick = () => {
    if (!user) {
      alert('Please log in to view your favorites!');
      navigate('/login');
      return;
    }
    
    setShowFavoritesOnly(true);
    
    setTimeout(() => {
      document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredRecipes = recipes
    .filter((recipe) => {
      const titleText = recipe.name || recipe.title || '';
      const matchesSearch = titleText.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
      const matchesFavorite = showFavoritesOnly ? favorites.includes(recipe._id) : true;
      return matchesSearch && matchesCategory && matchesFavorite;
    })
    .sort((a, b) => {
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      const timeA = parseInt(a.cookingTime || a.cookTime || a.prepTime || 0);
      const timeB = parseInt(b.cookingTime || b.cookTime || b.prepTime || 0);

      if (sortBy === 'TimeAsc') return timeA - timeB;
      if (sortBy === 'TimeDesc') return timeB - timeA;
      if (sortBy === 'NameAsc') return nameA.localeCompare(nameB);
      return 0;
    });

  const featuredRecipe = recipes.find(r => (r.name || r.title || '').toLowerCase().includes('pizza')) || recipes[0];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>Loading Recipes...</div>;
  }

  return (
    <div className="home-container">
      {/* Hero Header Section */}
      <div className="hero-section">
        <h1 className="hero-title">Your Favourite Recipes, Just a Search Away</h1>
        <p className="hero-slogan">
          Craving something specific? Skip the blogs and get straight to the cooking. Type the name of any dish to instantly unlock clear, easy-to-follow instructions and ingredient lists.
        </p>
        <div className="hero-actions">
          <button onClick={handleExploreClick} className="btn-explore">Explore Recipes ↓</button>
          <button className="btn-favorites" onClick={handleFavoritesClick}>
            ♡ Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="stats-card">
        <div className="stat-item">
          <div className="stat-number">{recipes.length}+</div>
          <div className="stat-label">Curated Recipes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">7</div>
          <div className="stat-label">Meal Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Chef Verified</div>
        </div>
      </div>

      {/* Category Pills Header */}
      <div className="section-title">Browse By Category</div>
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'All' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Featured Recipe Banner (Pizza) */}
      {featuredRecipe && (
        <div className="featured-card">
          <img src={featuredRecipe.image} alt={featuredRecipe.name || featuredRecipe.title} className="featured-img" />
          <div className="featured-content">
            <span className="featured-tag">MOST FAVORITED RECIPE</span>
            <span className="section-title" style={{ marginBottom: '5px' }}>{featuredRecipe.category}</span>
            <h2 className="featured-title">{featuredRecipe.name || featuredRecipe.title}</h2>
            <p className="featured-desc">{featuredRecipe.description || 'Classic crispy crust topped with fresh mozzarella, tomato sauce, and basil leaves.'}</p>
            <div className="featured-meta">⏱️ {featuredRecipe.cookingTime || featuredRecipe.cookTime || featuredRecipe.prepTime || '20 mins'}</div>
            <Link to={`/recipe/${featuredRecipe._id}`} className="btn-explore" style={{ width: 'fit-content' }}>
              View Featured Recipe →
            </Link>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="controls-row" id="recipes-grid">
        <input
          type="text"
          placeholder="Search by recipe title or ingredient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="Default">Sort: Newest</option>
          <option value="TimeAsc">Sort: Time (Low to High)</option>
          <option value="TimeDesc">Sort: Time (High to Low)</option>
          <option value="NameAsc">Sort: Name (A-Z)</option>
        </select>
      </div>

      {/* Recipes Cards Grid */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            isFavorite={favorites.includes(recipe._id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;