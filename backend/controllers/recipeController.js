const Recipe = require('../models/Recipe');

exports.addRecipe = async (req, res) => {
    try {
        const { name, image, ingredients, steps, cookTime, category } = req.body;
        if (!name || !image || !ingredients || !steps || !cookTime || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newRecipe = new Recipe({ name, image, ingredients, steps, cookTime, category });
        await newRecipe.save();
        res.status(201).json({ message: "Recipe Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchRecipes = async (req, res) => {
    try {
        const { name } = req.query;
        const recipes = await Recipe.find({
            name: { $regex: name, $options: "i" }
        });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipesByCategory = async (req, res) => {
    try {
        const recipes = await Recipe.find({ category: req.params.category });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json({ message: "Recipe Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};