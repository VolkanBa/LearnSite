import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Importiere useParams
import axios from 'axios';

const FileUpload = () => {
    const { classroomId } = useParams(); // classroomId direkt aus der URL holen
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const token = localStorage.getItem('authToken'); 
    console.log("HIEHRIHER  " + token);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!classroomId) {
            console.error("Keine Classroom-ID gefunden!");
            return;
        }
    
        console.log("Ausgewählte Datei:", selectedFile);
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        try {
            const response = await axios.post(
                `http://localhost:5000/api/classrooms/${classroomId}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // Authentifizierungs-Header setzen
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                        console.log("Upload-Fortschritt:", progress);
                    }
                }
            );
            console.log("API-Antwort:", response.data);
            fetchFiles(); // Dateien neu abrufen
        } catch (error) {
            console.error("Upload-Fehler:", error);
        }
    };
    
    const fetchFiles = useCallback(async () => {
        if (!classroomId) {
            console.error("Keine Classroom-ID gefunden!");
            return;
        }
    
        const token = localStorage.getItem('authToken'); // Token aus LocalStorage abrufen
        if (!token) {
            console.error("Kein Authentifizierungs-Token gefunden!");
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/files`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Authentifizierungs-Header hinzufügen
                }
            });
            console.log("Dateien vom Server:", response.data);
            setFiles(response.data);
        } catch (error) {
            console.error("Fehler beim Abrufen der Dateien:", error);
        }
    }, [classroomId]);
    
    useEffect(() => {
        fetchFiles();
    }, [classroomId, fetchFiles]);
    

    return (
        <div>
            <h2>Datei-Upload</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Hochladen</button>
            {uploadProgress > 0 && <p>Fortschritt: {uploadProgress}%</p>}
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        <a href={`/api/classrooms/${classroomId}/files/${file.id}`} target="_blank" rel="noreferrer">
                            {file.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileUpload;
