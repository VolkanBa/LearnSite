import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileUploadAndViewer = ({ categoryId, isCreator }) => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const fetchFiles = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`http://localhost:5000/api/categories/${categoryId}/files`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Dateien:', error);
            }
        };

        fetchFiles();
    }, [categoryId]);

    const handleFileUpload = async () => {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post(`http://localhost:5000/api/categories/${categoryId}/files`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });
            setSelectedFile(null);
            setUploadProgress(0);
        } catch (error) {
            console.error('Fehler beim Hochladen der Datei:', error);
        }
    };

    return (
        <div>
            <h4>Dateien in dieser Kategorie</h4>
            {isCreator && (
                <div>
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <button onClick={handleFileUpload}>Hochladen</button>
                    {uploadProgress > 0 && <p>Fortschritt: {uploadProgress}%</p>}
                </div>
            )}
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        <a href={`http://localhost:5000/${file.path}`} target="_blank" rel="noopener noreferrer">
                            {file.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileUploadAndViewer;
