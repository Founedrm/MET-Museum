import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import AdvancedSearch from './pages/AdvancedSearch';
import ItemPage from './pages/ItemPage';
import Collection from './pages/Collection';

function App() {
    return (
        <BrowserRouter>
            <div>
                {/* Barre de navigation commune à toutes les pages */}
                <Navbar />

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/item/:id" element={<ItemPage />} />
                        <Route path="/collection" element={<Collection />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
