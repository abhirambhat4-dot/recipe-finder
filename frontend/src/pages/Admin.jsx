import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes`);
                setRecipes(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecipes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`);
                setRecipes(recipes.filter(recipe => recipe._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header-row">
                <h2>Admin Dashboard</h2>
                <Link to="/admin/add" className="nav-box-btn" style={{ backgroundColor: '#28a745', color: '#fff' }}>
                    Add New Recipe
                </Link>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map(recipe => (
                        <tr key={recipe._id}>
                            <td>{recipe.name}</td>
                            <td>{recipe.category}</td>
                            <td>
                                <Link to={`/admin/edit/${recipe._id}`}>
                                    <button className="action-btn edit-btn">Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(recipe._id)} className="action-btn delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;