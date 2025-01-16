import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = ({ classroomId, onCategoryAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            await axios.post(
                `http://localhost:5000/api/classrooms/${classroomId}/categories`,
                { name, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setName('');
            setDescription('');
            onCategoryAdded(); // Liste aktualisieren
        } catch (error) {
            console.error('Fehler beim Erstellen der Kategorie:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <h3>Neue Kategorie erstellen</h3>
            <input
                type="text"
                placeholder="Kategorie-Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Beschreibung"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <button type="submit">Erstellen</button>
        </form>
    );
};

export default CategoryForm;

