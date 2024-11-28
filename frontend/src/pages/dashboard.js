import React, { useState, useEffect, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import styles from '../styles/dashboard.module.css';
import { ClassroomContext } from "./context";



const Dashboard = () => {
    // Benutzerinformationen
    const { setClassroomData } = useContext(ClassroomContext);
    const [user, setUser] = useState(null); // Benutzerinformationen speichern
    const [classrooms, setClassrooms] = useState([]); // Liste der Klassenzimmer
    const [showCreateForm, setShowCreateForm] = useState(false); // Toggle für das Erstellungsformular
    const [newClassroomName, setNewClassroomName] = useState('Default'); // Name für das neue Klassenzimmer
    const [newClassroomDescription, setNewClassroomDescription] = useState('Default'); // Beschreibung des neuen Klassenzimmers
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(""); 
    const token = localStorage.getItem('authToken');
    const [showDelete, setShowDelete] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [showDeleteStates, setShowDeleteStates] = useState({});
    const navigate = useNavigate();

    const toggleDeleteState = (id) => {
        setShowDeleteStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
  
    
    
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

    //opens a classroom
    const handleOpenClassroom = (classroom) => {
        setClassroomData({
            id: classroom.id,
            name: classroom.name,
            description: classroom.description,
        }); 
        navigate(`/classroom/${classroom.id}`); // Navigiere zur spezifischen Seite
    };


    //remove a User from a classroom
    const HandleRemoveUser = async (classroomId) => {
        try{
        const token = localStorage.getItem('authToken');
        await axios.delete(`/classrooms/${classroomId}/remove`,
        {headers: { Authorization: `Bearer ${token}` }
    });
    setClassrooms((prev)=> prev.filter((classroom) => classroomId !== classroom.id)
    );
    alert("Klasse wurde erfolgreich entfernt");
}
     catch(error){
        console.error("Fehler beim entfernen der Klasse: ", error);
    };

    setShowDeleteStates((prev) => ({
        ...prev,
        [classroomId]: false,
    }));

    fetchClassrooms();
   
}
   


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
                            <h2 >{classroom.name}</h2> 
                            <button className={styles.gruppeOeffnen}
                            onClick={() => handleOpenClassroom(classroom)}
                            >Gruppe öffnen
                            </button>
                            <p>{classroom.description}</p> 
                            <button className={styles.gruppeEntfernen}
                             onClick={() => HandleRemoveUser(classroom.id)}>
                                 {showDeleteStates[classroom.id] ? 'Abbrechen' : 'Klasse verlassen'}
                            </button>
                            
                            {showDeleteStates[classroom.id] &&  (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    HandleRemoveUser(classroom.id);
                    toggleDeleteState(classroom.id);
                }}>
            </form>
            )}              
                            </div>
                        </div>
                    ))
                )}
                </div>
        </div>
    );
};
export default Dashboard;