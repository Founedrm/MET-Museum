// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // le CSS spécifique à la nav

const Navbar: React.FC = () => {
    return (
        <header className="navbar">
            <nav className="nav-left">
                <Link to="/" className="nav-link">Home</Link>
            </nav>

            <div className="logo">Museum</div>

            <div className="nav-right">
                <Link to="/collection" className="nav-link">Collection</Link>
                {/* Ajoute ici tous les liens que tu veux voir partout */}
            </div>
        </header>
    );
};

export default Navbar;
