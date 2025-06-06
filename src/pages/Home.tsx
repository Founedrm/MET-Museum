import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchObjects, getObjectById } from '../api/metAPI';
import './Home.css';
import RechercheRapide from "./RechercheRapide.tsx";

interface Artwork {
    objectID: number;
    primaryImageSmall: string;
    primaryImage: string;
    title: string;
    artistDisplayName: string;
}

const Home: React.FC = () => {
    const [highlights, setHighlights] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHighlights = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await searchObjects({ isHighlight: true, q: 'painting' });
                const allIds: number[] = res.data.objectIDs || [];

                const artworksWithImage: Artwork[] = [];
                let index = 0;

                while (artworksWithImage.length < 12 && index < allIds.length) {
                    const batch = allIds.slice(index, index + 5); // charger par 5 pour limiter les appels
                    const responses = await Promise.allSettled(batch.map((id) => getObjectById(id)));

                    responses.forEach((r) => {
                        if (
                            r.status === 'fulfilled' &&
                            r.value?.data?.primaryImageSmall &&
                            r.value.data.primaryImageSmall.trim() !== ''
                        ) {
                            artworksWithImage.push(r.value.data);
                        }
                    });

                    index += 5;
                }

                setHighlights(artworksWithImage.slice(0, 12));
            } catch (err) {
                console.error(err);
                setError("Impossible de charger nos incourtounables.");
            } finally {
                setLoading(false);
            }
        };

        fetchHighlights();
    }, []);

    if (loading) return <p className="loading">Chargement des œuvres...</p>;
    if (error) return <p className="erreur">{error}</p>;

    const heroImage = '/hero.jpg';

    return (
        <div className="home-container">

            <section
                className="hero"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="hero-overlay">
                    <h1 className="hero-title">
                        Un voyage au cœur de l'art, de la culture et de l'émotion.
                    </h1>
                    <p className="hero-subtitle">
                        Explorez une collection unique d'œuvres issues des plus grandes époques artistiques.
                    </p>
                    <RechercheRapide />
                </div>
            </section>

            {/* Œuvres incontournables */}
            <section className="highlights section">
                <h2 className="section-title center">Nos incontournables</h2>
                <div className="grid">
                    {highlights.map((art) => (
                        <Link
                            key={art.objectID}
                            to={`/item/${art.objectID}`}
                            className="card highlight-card"
                        >
                            <img
                                src={art.primaryImageSmall || 'https://via.placeholder.com/150'}
                                alt={art.title}
                                className="card-img"
                            />
                            <div className="card-info">
                                <h3>{art.title}</h3>
                                <p>{art.artistDisplayName || 'Artiste inconnu'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3 className="footer-title">Museum</h3>
                            <p className="footer-desc">
                                Un outil pensé pour aider les chercheurs et curieux à explorer facilement les trésors des collections du MET.
                            </p>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-title">A propos</h4>
                            <ul className="footer-links">
                                <li>
                                    <Link to="#" className="footer-link">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="footer-link">
                                        A propos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="footer-link">
                                        Pour l'histoire
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-title">Entreprise</h4>
                            <ul className="footer-links">
                                <li>
                                    <Link to="#" className="footer-link">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="footer-link">
                                        Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="footer-link">
                                        Newsroom
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-title">Contact</h4>
                            <ul className="footer-links">
                                <li>
                                    <Link to="#" className="footer-link">
                                        Snapchat
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="footer-link">
                                        Instagram
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="footer-link">
                                        TikTok
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2025 Museum</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
