import React, { useState, useEffect } from 'react';
import axios from '../api';
import '../styles/dashboard.module.css';

const Dashboard = () => {
    // Benutzerinformationen
    const [user, setUser] = useState(null); // Benutzerinformationen speichern
    const [classrooms, setClassrooms] = useState([]); // Liste der Klassenzimmer
    const [showCreateForm, setShowCreateForm] = useState(false); // Toggle für das Erstellungsformular
    const [newClassroomName, setNewClassroomName] = useState(''); // Name für das neue Klassenzimmer
    const [newClassroomDescription, setNewClassroomDescription] = useState(''); // Beschreibung des neuen Klassenzimmers
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState("");

    // User Information
    // useEffect(() => {
    //             const fetchProfile = async () => {
    //                 const token = localStorage.getItem('authToken');
    //                 console.log('Gesendetes Token:', token);
    //                 try {
    //                     const response = await axios.get('/users/profile', {
    //                         headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                            
    //                     });
    //                     console.log('API Antwort:', response.data);
    //                     setUser(response.data);
    //                     console.log('Benutzerprofil:', response.data);
                        
    //                 } catch (err) {
    //                     console.error(err);
    //                     window.location.href = '/login';
    //                 }
    //             };
           
    //             fetchProfile();
    //         }, []);

    // Klassenzimmer aus dem Backend abrufen
    useEffect(() => {
        if (user) {
            fetchClassrooms();
        }
    }, [user]);

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get('/api/classrooms');
            setClassrooms(response.data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Klassenzimmer:', error);
            setErrorMessage('Fehler beim Abrufen der Klassenzimmer.');
        }
    };

    // Neues Klassenzimmer erstellen
    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await axios.post('/api/classrooms/create', {
                name: newClassroomName,
                description: newClassroomDescription,
            });
            setSuccessMessage('Klassenzimmer erfolgreich erstellt!');
            setShowCreateForm(false); // Formular schließen
            fetchClassrooms(); // Klassenzimmerliste aktualisieren
        } catch (error) {
            console.error('Fehler beim Erstellen des Klassenzimmers:', error);
            setErrorMessage(error.response?.data?.error || 'Fehler beim Erstellen des Klassenzimmers.');
        }
    };

    // UI für das Erstellungsformular
    const renderCreateForm = () => (
        <div className="create-classroom-form">
            <form onSubmit={handleCreateClassroom}>
                <h2>Neues Klassenzimmer erstellen</h2>
                <input
                    type="text"
                    placeholder="Name des Klassenzimmers"
                    value={newClassroomName}
                    onChange={(e) => setNewClassroomName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Beschreibung des Klassenzimmers"
                    value={newClassroomDescription}
                    onChange={(e) => setNewClassroomDescription(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Erstellen</button>
                <button type="button" className="cancel-button" onClick={() => setShowCreateForm(false)}>
                    Abbrechen
                </button>
            </form>
        </div>
    );

    return (
        <div className="dashboard">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {user && <h1>Willkommen, {user.name}!</h1>}

            {classrooms.length === 0 && !showCreateForm ? (
                <div className="empty-state">
                    <h1>Classroom erstellen</h1>
                    <button onClick={() => setShowCreateForm(true)}>Jetzt erstellen</button>
                </div>
            ) : (
                <>
                    <div className="header">
                        <h1>Meine Klassenzimmer</h1>
                        <button className="add-button" onClick={() => setShowCreateForm(true)}>+</button>
                    </div>
                    <div className="classroom-grid">
                        {classrooms.map((classroom) => (
                            <div key={classroom.id} className="classroom-card">
                                <h2>{classroom.name}</h2>
                                <p>{classroom.description}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {showCreateForm && renderCreateForm()}
        </div>
    );
};

export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import axios from '../api';

// const Dashboard = () => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             const token = localStorage.getItem('authToken');
//             console.log('Gesendetes Token:', token);
//             try {
//                 const response = await axios.get('/users/profile', {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                    
//                 });
//                 console.log('API Antwort:', response.data);
//                 setUser(response.data);
//                 console.log('Benutzerprofil:', response.data);
                
//             } catch (err) {
//                 console.error(err);
//                 window.location.href = '/login';
//             }
//         };
   
//         fetchProfile();
//     }, []);

//     if (!user) return <p>Lade...</p>;

//     return <h1>Willkommen, {user.email}</h1>;
// };

// export default Dashboard;
