import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;


const FileUploadAndViewer = () => {
    const {classroomId} = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [files, setFiles] = useState([]);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);

    // Dateien abrufen
    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/files`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Dateien:', error);
            }
        };

        fetchFiles();
    }, [classroomId]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Bitte wählen Sie eine Datei aus.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                `http://localhost:5000/api/classrooms/${classroomId}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    },
                }
            );
            setFiles([...files, response.data]);
            setUploadProgress(0);
            setSelectedFile(null);
        } catch (error) {
            console.error('Fehler beim Hochladen der Datei:', error);
        }
    };

    const handleFileClick = async (fileId) => {
        const token = localStorage.getItem('authToken');
    
        try {
            const response = await axios.get(
                `http://localhost:5000/api/classrooms/${classroomId}/files/${fileId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Token im Header senden
                    },
                    responseType: 'blob', // Datei als Blob abrufen
                }
            );
    
            // Blob-URL generieren und setzen
            const fileUrl = URL.createObjectURL(response.data);
            setSelectedFileUrl(fileUrl);
        } catch (error) {
            console.error('Fehler beim Abrufen der Datei:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Datei-Upload und Vorschau</h1>
            <div style={{ marginBottom: '20px' }}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                    Hochladen
                </button>
                {uploadProgress > 0 && <p>Upload-Fortschritt: {uploadProgress}%</p>}
            </div>

            <div>
                <h2>Hochgeladene Dateien</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {files.map((file) => (
                        <li key={file.id} style={{ marginBottom: '10px' }}>
                            <button
                                onClick={() => handleFileClick(file.id)}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {file.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                {selectedFileUrl && (
                    <div style={{ border: '1px solid black', width: '80%', height: '600px', margin: '20px auto' }}>
                        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
                            <Viewer fileUrl={selectedFileUrl} />
                        </Worker>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadAndViewer;
