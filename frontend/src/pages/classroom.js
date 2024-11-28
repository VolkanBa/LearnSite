import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // Zugriff auf die Classroom-ID aus der URL
import axios from '../api';
import { ClassroomContext } from './context.js';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';


const Classroom = () => {
    const { classroomData } = useContext(ClassroomContext); 
    const { classroomId } = useParams(); // ID des Klassenzimmers aus der URL
    const [messages, setMessages] = useState([]); // Chat-Nachrichten
    const [newMessage, setNewMessage] = useState(''); // Neue Nachricht
    const [files, setFiles] = useState([]); // Dateien im Klassenzimmer
    const token = localStorage.getItem('authToken'); // Authentifizierungs-Token

    // Dateien abrufen
    const fetchFiles = async () => {
        try {
            const response = await axios.get(`/classrooms/${classroomId}/files`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFiles(response.data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Dateien:', error);
        }
    };

    // Dateien hochladen
    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return; // Überprüfung, ob eine Datei ausgewählt wurde

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `/classrooms/${classroomId}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Neue Datei zur Liste hinzufügen
            setFiles((prevFiles) => [...prevFiles, response.data]);
        } catch (error) {
            console.error('Fehler beim Hochladen der Datei:', error);
        }
    };

    // Klassenzimmer-Daten beim ersten Rendern abrufen
    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                const response = await axios.get(`/classrooms/${classroomId}/data`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(response.data.messages); // Nachrichten setzen
            } catch (error) {
                console.error('Fehler beim Abrufen der Klassenzimmer-Daten:', error);
            }
        };

        fetchClassroomData();
        fetchFiles();
    }, [classroomId, token]);

    return (
        <div>
            <h1>Klassenzimmer: {classroomData?.name || 'Unbekannt'}</h1>

            <div>
                <h2>Dateien</h2>
                <input type="file" onChange={handleUploadFile} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {files.map((file) => (
                        <div key={file.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                            {file.type.startsWith('image') ? (
                                <img
                                    src={`/uploads/${file.path}`}
                                    alt={file.name}
                                    style={{ maxWidth: '300px', height: 'auto' }}
                                />
                            ) : file.type === 'application/pdf' ? (
                                <embed
    src={`/uploads/${file.path}`}
    type="application/pdf"
    width="100%"
    height="600px" // Höhe anpassen, je nach gewünschtem Layout
    style={{ border: '1px solid #ccc', margin: '10px 0' }}
/>
                            ) : (
                                <a href={`/uploads/${file.path}`} target="_blank" rel="noopener noreferrer">
                                    {file.name}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Classroom;
