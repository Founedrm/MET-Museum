import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getObjectById } from '../api/metAPI';

const ItemPage = () => {
    const { id } = useParams();
    const [object, setObject] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            setError("ID invalide.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await getObjectById(parsedId);
                if (!res.data || !res.data.objectID) {
                    setError("Objet introuvable.");
                } else {
                    setObject(res.data);
                }
            } catch (err) {
                console.error(err);
                setError("Erreur de chargement.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!object) return null;

    return (
        <div style={styles.container}>
            <h2>{object.title}</h2>
            <img
                src={object.primaryImage || 'https://via.placeholder.com/400x400'}
                alt={object.title}
                style={styles.image}
            />
            <div style={styles.info}>
                <p><strong>Artiste :</strong> {object.artistDisplayName || 'Inconnu'}</p>
                <p><strong>Période :</strong> {object.period || 'Non spécifiée'}</p>
                <p><strong>Date :</strong> {object.objectDate || 'Non spécifiée'}</p>
                <p><strong>Département :</strong> {object.department}</p>
                <p><strong>Culture :</strong> {object.culture || 'Non spécifiée'}</p>
                <p><strong>Dimensions :</strong> {object.dimensions}</p>
                <p><strong>Médium :</strong> {object.medium}</p>
                <p><strong>Type :</strong> {object.objectName}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '6px',
        marginBottom: '20px',
    },
    info: {
        fontSize: '16px',
        lineHeight: '1.6',
    },
};

export default ItemPage;
