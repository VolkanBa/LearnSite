import React, { useState, useEffect } from 'react';
import axios from '../api';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
    // Benutzerinformationen
    const [user, setUser] = useState(null); // Benutzerinformationen speichern
    const [classrooms, setClassrooms] = useState([]); // Liste der Klassenzimmer
    const [showCreateForm, setShowCreateForm] = useState(false); // Toggle für das Erstellungsformular
    const [newClassroomName, setNewClassroomName] = useState('Default'); // Name für das neue Klassenzimmer
    const [newClassroomDescription, setNewClassroomDescription] = useState('Default'); // Beschreibung des neuen Klassenzimmers
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(""); 
    const token = localStorage.getItem('authToken');

  

    
     // Klassenzimmer aus dem Backend abrufen
     const fetchClassrooms = async () => {
        try {
            console.log("Vor axios.get");
            const response = await axios.get('/classrooms',
                {
                    headers: { Authorization: `Bearer ${token}` }, // JWT-Token im Header hinzufügen
                }
            );
            console.log("repsonse.data: " + response.data);
            setClassrooms(response.data);
            
        } catch (error) {
            console.error('Fehler beim Abrufen der Klassenzimmer:', error);
            setErrorMessage('Fehler beim Abrufen der Klassenzimmer.');
        }
    };

    // Klassenzimmer beim Mounten abrufen
    useEffect(() => {
        fetchClassrooms();
    }, []);

    // Neues Klassenzimmer erstellen
    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            
           

            // Neues Klassenzimmer erstellen
            await axios.post('/classrooms/create', {
                name: newClassroomName,
                description: newClassroomDescription,
            },
            {
                headers: { Authorization: `Bearer ${token}` }, // JWT-Token im Header hinzufügen
            }

        )

        
            setSuccessMessage('Klassenzimmer erfolgreich erstellt!');
            setShowCreateForm(false); // Formular schließen
            fetchClassrooms(); // Aktualisiere die Klassenzimmerliste
        } catch (error) {
            console.error('Fehler beim Erstellen des Klassenzimmers:', error);
            setErrorMessage('Fehler beim Erstellen des Klassenzimmers.');
        }
    };


    return (
        <div className={styles.gridContainer}>
            <h1 className={styles.meineKlassenzimmer}>Meine Klassenzimmer</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <button onClick={() => setShowCreateForm(!showCreateForm)} className={styles.klassenzimmerErstellen}>
                {showCreateForm ? 'Formular schließen' : 'Klassenzimmer erstellen'}
            </button>

            {showCreateForm && (
                <form onSubmit={handleCreateClassroom}>
                    <input
                        type="text"
                        placeholder="Name des Klassenzimmers"
                        value={newClassroomName}
                        onChange={(e) => setNewClassroomName(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Beschreibung"
                        value={newClassroomDescription}
                        onChange={(e) => setNewClassroomDescription(e.target.value)}
                    ></textarea>
                    <button type="submit" className>Erstellen</button>
                </form>
            )}
                <div>
                {classrooms.length === 0 ? (
                    <p>Keine Klassenzimmer gefunden.</p>
                ) : (
                    classrooms.map((classroom) => (
                        <div key={classroom.id} className={styles.cardsStart}>
                            <div className={styles.classCard}>
                            <h2>{classroom.name}</h2>
                            <p>{classroom.description}</p>
                            </div>
                        </div>
                    ))
                )}
                </div>
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
