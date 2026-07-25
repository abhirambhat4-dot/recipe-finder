const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log(err));

// --- RECIPE SCHEMA & ROUTES ---
const recipeSchema = new mongoose.Schema({}, { strict: false });
const Recipe = mongoose.model('Recipe', recipeSchema);

// FETCH ALL
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

// FETCH SINGLE BY ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe details' });
  }
});

// UPDATE RECIPE (PUT)
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

// DELETE RECIPE
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

// --- FAVORITES ROUTES ---
app.get('/api/users/:email/favorites', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

app.post('/api/users/favorites/toggle', async (req, res) => {
  try {
    const { email, recipeId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.favorites.indexOf(recipeId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorite' });
  }
});

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Email must end with @gmail.com' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));