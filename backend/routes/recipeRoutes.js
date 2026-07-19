const express = require('express');
const router = express.Router();
const {
    addRecipe,
    getAllRecipes,
    getRecipeById,
    searchRecipes,
    getRecipesByCategory,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipeController');

router.post('/', addRecipe);
router.get('/', getAllRecipes);
router.get('/search', searchRecipes);
router.get('/category/:category', getRecipesByCategory);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;