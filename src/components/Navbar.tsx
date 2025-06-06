import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <header className="navbar">
            <nav className="nav-left">
                <Link to="/" className="nav-link">Home</Link>
            </nav>

            <div className="logo">Museum</div>

            <div className="nav-right">
                <Link to="/collection" className="nav-link">Collection</Link>
            </div>
        </header>
    );
};

export default Navbar;
