import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Classroom = () => {
    const { classroomId } = useParams();
    const [categories, setCategories] = useState([]);
    const [role, setRole] = useState(null); // Rolle des Nutzers
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Prüfen der Rolle
    useEffect(() => {
        const checkRole = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/classrooms/${classroomId}/role`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRole(response.data.role); // Rolle wird gesetzt (creator oder user)
            } catch (error) {
                console.error('Fehler beim Überprüfen der Rolle:', error);
                setError('Fehler beim Überprüfen der Rolle');
            }
        };

        checkRole();
    }, [classroomId]);

    // Kategorien abrufen
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/classrooms/${classroomId}/categories`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
    
                const categoriesWithFiles = await Promise.all(
                    response.data.map(async (category) => {
                        const filesResponse = await axios.get(
                            `http://localhost:5000/api/classrooms/${classroomId}/categories/${category.id}/files`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
                        return { ...category, files: filesResponse.data };
                    })
                );
    
                setCategories(categoriesWithFiles);
            } catch (error) {
                console.error('Fehler beim Abrufen der Kategorien:', error);
                setError('Fehler beim Abrufen der Kategorien');
            } finally {
                setLoading(false); // Ladeanzeige beenden
            }
        };
    
        fetchCategories();
    }, [classroomId]);
    

    // Neue Kategorie hinzufügen
    const handleAddCategory = async () => {
        const token = localStorage.getItem('authToken');
        if (!newCategoryName || !newCategoryDescription) {
            setError('Bitte alle Felder ausfüllen.');
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/classrooms/${classroomId}/categories`,
                { name: newCategoryName, description: newCategoryDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Neue Kategorie mit einem leeren files-Array hinzufügen
            const newCategory = { ...response.data, files: [] };
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            setNewCategoryDescription('');
            setError(''); // Fehler zurücksetzen
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Kategorie:', error);
            setError('Fehler beim Hinzufügen der Kategorie');
        }
    };
    
    // Datei hochladen
    const handleFileUpload = async (file, categoryId) => {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/classrooms/${classroomId}/categories/${categoryId}/files`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Datei hochgeladen:', response.data);
        } catch (error) {
            console.error('Fehler beim Hochladen der Datei:', error);
        }
    };

    return (
        <div>
            <h1>Lernpfad im Classroom</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Lädt...</p>
            ) : (
                <div>
                    {categories.map((category) => (
                        <div key={category.id} className="category">
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <div>
                                {category.files && category.files.length > 0 ? (
                                    <ul>
                                        {category.files.map((file) => (
                                            <li key={file.id}>
                                           <a
                                                href={`http://localhost:5000/api/classrooms/${classroomId}/files/${file.id}?token=${localStorage.getItem('authToken')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {file.name}
                                            </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Keine Dateien vorhanden</p>
                                )}
                            </div>
                            {role === 'creator' && (
                                <div>
                                    <h4>Datei hochladen</h4>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e.target.files[0], category.id)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    {role === 'creator' && (
                        <div>
                            <h3>Neue Kategorie hinzufügen</h3>
                            <input
                                type="text"
                                placeholder="Name der Kategorie"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <textarea
                                placeholder="Beschreibung der Kategorie"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                            />
                            <button onClick={handleAddCategory}>Kategorie hinzufügen</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Classroom;
