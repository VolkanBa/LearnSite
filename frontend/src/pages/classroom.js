import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // access for the classroom ID out of the URL
import axios from '../api';
import { ClassroomContext } from './context.js';
import { classroomName } from './dashboard.js';
const Classroom = () => {
    const { classroomData } = useContext(ClassroomContext);
    const { classroomId } = useParams(); // gets classroom ID out of URL
    const [messages, setMessages] = useState([]); //chat messages
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState([]); // for files uploaded


    useEffect(() => {
        // Fetch classroom data (e.g. messages)
        const fetchClassroomData = async () => {
            try {
                const response = await axios.get(`/classrooms/${classroomId}/data`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                });
                setMessages(response.data.messages);
                setFiles(response.data.files);
            } catch (error) {
                console.error('Fehler beim Abrufen der Klassenzimmer-Daten:', error);
            }
        };

        fetchClassroomData();
    }, [classroomId]);

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(
                `/classrooms/${classroomId}/messages`,
                { 
                    message: newMessage
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                }
            );
            setMessages([...messages, response.data]); // updates the messages
            setNewMessage(''); // empties the message field
        } catch (error) {
            console.error('Fehler beim Senden der Nachricht:', error);
        }
    };

    const handleUploadFile = async (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const response = await axios.post(`/classrooms/${classroomId}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFiles([...files, response.data]); // adds new File
        } catch (error) {
            console.error('Fehler beim Hochladen der Datei:', error);
        }
    };

    return (
        <div>
            {console.log()}
            <h1>Klassenzimmer {}</h1>

            <div>
                <h2>Chat</h2>
                <div>
                    {messages.map((msg, index) => (
                        <p key={index}>{msg.content}</p>
                    ))}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Senden</button>
            </div>

            <div>
                <h2>Dateien</h2>
                <input type="file" onChange={handleUploadFile} />
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Classroom;
