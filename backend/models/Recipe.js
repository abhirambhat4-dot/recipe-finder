const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    cookTime: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);