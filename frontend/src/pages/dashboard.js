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

    // Benutzerinformationen abrufen
    useEffect(() => {
     const fetchUser = async () => {
            try {
                // Benutzer-Daten mit dem Refresh-Token abrufen
                const response = await axios.get('/api/user');
                setUser(response.data); // Benutzerdaten setzen
            } catch (err) {
                console.error('Fehler beim Abrufen der Benutzerdaten:', err);
                setError('Nicht authentifiziert. Bitte logge dich ein.');
                setTimeout(() => {
      //              window.location.href = '/login'; // Zur Login-Seite weiterleiten
                }, 1000);
            }
        };

        fetchUser();
    }, []);

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
