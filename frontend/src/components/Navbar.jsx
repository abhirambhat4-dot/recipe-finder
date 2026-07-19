import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar-container">
            <div>
                <Link to="/" className="nav-box-btn brand">
                    Recipe Finder
                </Link>
            </div>
            
            <div className="navbar-right-menu">
                <Link to="/" className="nav-box-btn">
                    Home
                </Link>
                <Link to="/admin" className="nav-box-btn">
                    Admin Dashboard
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;