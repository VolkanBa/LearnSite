import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from './Accordion';

const CategoryList = ({ classroomId, isCreator }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Kategorien:', error);
            }
        };

        fetchCategories();
    }, [classroomId]);

    return (
        <div>
            {categories.map((category) => (
                <Accordion key={category.id} title={category.name}>
                    <p>{category.description}</p>
                    <ul>
                        {category.files.map((file) => (
                            <li key={file.id}>
                                <a href={`http://localhost:5000/${file.path}`} target="_blank" rel="noopener noreferrer">
                                    {file.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {isCreator && <button style={{ marginTop: '10px' }}>Neue Datei hinzufügen</button>}
                </Accordion>
            ))}
        </div>
    );
};

export default CategoryList;
