import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import Admin from './pages/Admin';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';

function App() {
    return (
        <Router>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/add" element={<AddRecipe />} />
                    <Route path="/admin/edit/:id" element={<EditRecipe />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;