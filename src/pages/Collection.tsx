// src/pages/Collection.tsx
import React, { useEffect, useState } from 'react';
import { getDepartments, searchObjects, getObjectById } from '../api/metAPI';
import { ChevronDown, Filter, Heart, Maximize, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Collection.css';

interface Artwork {
    objectID: number;
    primaryImageSmall: string;
    title: string;
    artistDisplayName: string;
    medium: string;
    objectDate: string;
    tags: string[];
}

const Collection: React.FC = () => {
    const [query, setQuery] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [departments, setDepartments] = useState<{ departmentId: number; displayName: string }[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    const [results, setResults] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDepartments()
            .then(res => setDepartments(res.data.departments))
            .catch(() => setDepartments([]));

        (async () => {
            try {
                const searchRes = await searchObjects({ q: 'art' });
                const allIds: number[] = searchRes.data.objectIDs?.slice(0, 100) || [];
                const sliceIds = allIds.slice(0, 50);

                const responses = await Promise.allSettled(sliceIds.map(id => getObjectById(id)));

                const dateSet = new Set<string>();
                const tagSet = new Set<string>();

                (responses as PromiseFulfilledResult<any>[]).forEach(r => {
                    if (r.status === 'fulfilled') {
                        const data = r.value.data;
                        if (data.objectDate && data.objectDate.trim() !== '') {
                            dateSet.add(data.objectDate);
                        }
                        if (Array.isArray(data.tags)) {
                            data.tags.forEach((t: any) => {
                                if (t.term && typeof t.term === 'string') {
                                    tagSet.add(t.term);
                                }
                            });
                        }
                    }
                });

                setDates(Array.from(dateSet).sort());
                setTags(Array.from(tagSet).sort());
            } catch {
                setDates([]);
                setTags([]);
            }
        })();
    }, []);

    const toggleDate = (d: string) => {
        setSelectedDates(prev => {
            const copy = new Set(prev);
            copy.has(d) ? copy.delete(d) : copy.add(d);
            return copy;
        });
    };

    const toggleTag = (t: string) => {
        setSelectedTags(prev => {
            const copy = new Set(prev);
            copy.has(t) ? copy.delete(t) : copy.add(t);
            return copy;
        });
    };

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        setResults([]);
        try {
            const params: any = {};
            if (query) params.q = query;
            if (departmentId) params.departmentId = departmentId;

            if (!params.q && !params.departmentId) {
                params.q = 'art';
            }

            const res = await searchObjects(params);
            const ids: number[] = res.data.objectIDs?.slice(0, 50) || [];

            const responses = await Promise.allSettled(ids.map(id => getObjectById(id)));

            let artworks: Artwork[] = (responses as PromiseFulfilledResult<any>[]).filter(r => r.status === 'fulfilled' && r.value.data)
                .map((r: any) => {
                    const data = r.value.data;
                    return {
                        objectID: data.objectID,
                        primaryImageSmall: data.primaryImageSmall,
                        title: data.title,
                        artistDisplayName: data.artistDisplayName,
                        medium: data.medium,
                        objectDate: data.objectDate,
                        tags: Array.isArray(data.tags) ? data.tags.map((t: any) => t.term) : [],
                    };
                });

            if (selectedDates.size > 0) {
                artworks = artworks.filter(art => selectedDates.has(art.objectDate));
            }

            if (selectedTags.size > 0) {
                artworks = artworks.filter(art =>
                    art.tags.some(tag => selectedTags.has(tag))
                );
            }

            setResults(artworks);
        } catch {
            setError('Erreur lors de la recherche.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchResults();
    };

    return (
        <div className="collection-container">
            <div className="collection-breadcrumb">
                <Link to="/" className="breadcrumb-link">Museum</Link>
                <span className="separator">/</span>
                <span>All</span>
            </div>

            <h1 className="collection-title">Résultats pour "{query || 'art'}"</h1>

            <div className="collection-layout">
                <aside className="collection-sidebar">

                    <div className="filter-section">
                        <div className="filter-header">
                            <h3 className="filter-title">DEPARTMENT</h3>
                            <ChevronDown className="icon" />
                        </div>
                        <div className="filter-options">
                            <select
                                value={departmentId}
                                onChange={e => setDepartmentId(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.departmentId} value={String(dept.departmentId)}>
                                        {dept.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="filter-header">
                            <h3 className="filter-title">DATE</h3>
                            <ChevronDown className="icon" />
                        </div>
                        <div className="filter-options">
                            {dates.map(d => (
                                <label key={d} className="filter-label">
                                    <input
                                        type="checkbox"
                                        className="filter-input"
                                        checked={selectedDates.has(d)}
                                        onChange={() => toggleDate(d)}
                                    />
                                    <span className="filter-text">{d}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="filter-header">
                            <h3 className="filter-title">TAGS</h3>
                            <ChevronDown className="icon" />
                        </div>
                        <div className="filter-options">
                            {tags.map(t => (
                                <label key={t} className="filter-label">
                                    <input
                                        type="checkbox"
                                        className="filter-input"
                                        checked={selectedTags.has(t)}
                                        onChange={() => toggleTag(t)}
                                    />
                                    <span className="filter-text">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="collection-main">
                    <form onSubmit={handleSearch} className="collection-searchbar">
                        <input
                            type="text"
                            placeholder="Rechercher une oeuvre"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>

                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!loading && results.length === 0 && <p>No results found.</p>}

                    <div className="collection-grid">
                        {results.map(art => (
                            <Link
                                key={art.objectID}
                                to={`/item/${art.objectID}`}
                                className="artwork-card"
                            >
                                <div className="artwork-image-wrapper">
                                    <img
                                        src={art.primaryImageSmall || 'https://via.placeholder.com/300'}
                                        alt={art.title}
                                        className="artwork-image"
                                    />
                                    <div className="artwork-actions">
                                        <button className="action-btn" onClick={e => e.preventDefault()}>
                                            <Heart className="icon" />
                                        </button>
                                        <button className="action-btn" onClick={e => e.preventDefault()}>
                                            <Maximize className="icon" />
                                        </button>
                                        <button className="action-btn" onClick={e => e.preventDefault()}>
                                            <ShoppingBag className="icon" />
                                        </button>
                                    </div>
                                </div>
                                <div className="artwork-info">
                                    <span className="artwork-price">€{art.objectID}</span>
                                    <h3>{art.title}</h3>
                                    <p>{art.artistDisplayName || 'Unknown Artist'}</p>
                                    <p className="filter-text"><em>Medium:</em> {art.medium}</p>
                                    <p className="filter-text"><em>Date:</em> {art.objectDate}</p>
                                    <p className="filter-text"><em>Tags:</em> {art.tags.join(', ')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Collection;
