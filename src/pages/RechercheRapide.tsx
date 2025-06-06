import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchObjects, getObjectById } from '../api/metAPI';
import './RechercheRapide.css';

interface ResultItem {
    objectID: number;
    title: string;
    artistDisplayName: string;
    primaryImageSmall: string;
}

const RechercheRapide: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const res = await searchObjects({ q: query });
                const ids = res.data.objectIDs?.slice(0, 10) || [];

                const responses = await Promise.allSettled(ids.map(id => getObjectById(id)));

                const validResults: ResultItem[] = responses
                    .filter(r => r.status === 'fulfilled' && r.value.data)
                    .map((r: any) => ({
                        objectID: r.value.data.objectID,
                        title: r.value.data.title,
                        artistDisplayName: r.value.data.artistDisplayName || 'Artiste inconnu',
                        primaryImageSmall: r.value.data.primaryImageSmall || '',
                    }));

                setResults(validResults);
                if (validResults.length === 0) setError('Aucun résultat.');
            } catch {
                setError("Erreur de recherche.");
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(() => fetchResults(), 400); // délai anti-spam

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className="recherche-rapide-wrapper">
            <input
                type="text"
                placeholder="Recherche rapide..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="recherche-rapide-input"
            />

            {(loading || results.length > 0 || error) && (
                <ul className="recherche-rapide-results">
                    {loading && <li className="search-status">Chargement...</li>}
                    {error && <li className="search-status">{error}</li>}
                    {!loading && !error && results.map(item => (
                        <li
                            key={item.objectID}
                            className="search-result-item"
                            onClick={() => navigate(`/item/${item.objectID}`)}
                        >
                            <img
                                src={item.primaryImageSmall || 'https://via.placeholder.com/50'}
                                alt={item.title}
                            />
                            <div>
                                <strong>{item.title}</strong>
                                <p>{item.artistDisplayName}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RechercheRapide;
