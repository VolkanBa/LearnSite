const db = require('../config/db');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Für Dateisystemoperationen
const multer = require('multer');

const app = express();

app.use(cors()); // Optional: Für Cross-Origin-Requests
app.use(express.json()); // Um JSON-Daten zu parsen
app.use(express.urlencoded({ extended: true })); // Für URL-codierte Daten


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const classroomFolder = `uploads/classrooms/${req.params.classroomId}`;
        if (!fs.existsSync(classroomFolder)) {
            fs.mkdirSync(classroomFolder, { recursive: true }); // Verzeichnis erstellen
        }
        cb(null, classroomFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Zeitstempel für einzigartige Dateinamen
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Nur PDF-Dateien sind erlaubt.'));
        }
        cb(null, true);
    }
});

exports.uploadFile = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error("Multer-Fehler:", err);
            return res.status(400).json({ error: err.message });
        }

        try {
            console.log("Eingehende Datei:", req.file);
            const { classroomId } = req.params;
            const { originalname, mimetype, path } = req.file;

            // Dateiinfo in die Datenbank schreiben
            const [result] = await db.query(
                'INSERT INTO files (name, type, path, classroom_id, user_id) VALUES (?, ?, ?, ?, ?)',
                [originalname, mimetype, path, classroomId, req.user.id]
            );

            console.log("Datei erfolgreich hochgeladen:", result);
            res.status(200).json({ message: "Datei erfolgreich hochgeladen!", fileId: result.insertId });
        } catch (error) {
            console.error("Datenbank-Fehler:", error);
            res.status(500).json({ error: "Fehler beim Hochladen der Datei." });
        }
    });
};

// create classroom
exports.createClassroom = async (req, res) => {
    console.log('Request Body:', req.body); // Debugging für req.body
    console.log('Request User:', req.user); // Debugging für req.user
    const { name, description } = req.body;
    const userId = req.user.id; // Authentifizierter Benutzer
    try {
        // Klassenzimmer in die Datenbank einfügen
        const [result] = await db.query(
            'INSERT INTO classrooms (name, description, creator_id) VALUES (?, ?, ?)',
            [name, description, userId]
        );

        const classroomId = result.insertId;

        // Den Ersteller direkt in die classroom_users-Tabelle einfügen
        await db.query(
            'INSERT INTO classroom_users (classroom_id, user_id, role) VALUES (?, ?, ?)',
            [classroomId, userId, 'creator']
        );

        res.status(201).json({ message: 'Klassenzimmer erfolgreich erstellt!', classroomId: result.insertId });
    } catch (error) {
        console.error('Fehler beim Erstellen des Klassenzimmers:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Klassenzimmers.' });
    }
};

exports.deleteUserFromClassroom = async (req, res) => {
    const { classroomId } = req.params; // ID des Klassenzimmers aus der Route
    const userId = req.user.id; // ID des authentifizierten Benutzers (aus der Middleware)

    try {
        // Prüfen, ob der Benutzer Mitglied des Klassenzimmers ist
        const [membership] = await db.query(
            'SELECT * FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userId]
        );

        if (membership.length === 0) {
            return res.status(404).json({ error: 'Benutzer ist kein Mitglied dieses Klassenzimmers.' });
        }

        // Benutzer aus dem Klassenzimmer entfernen
        await db.query(
            'DELETE FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userId]
        );

        res.status(200).json({ message: 'Benutzer erfolgreich aus dem Klassenzimmer entfernt.' });
    } catch (error) {
        console.error('Fehler beim Entfernen des Benutzers aus dem Klassenzimmer:', error);
        res.status(500).json({ error: 'Fehler beim Entfernen aus dem Klassenzimmer.' });
    }
};


exports.getClassrooms = async (req, res) => {
    const userId = req.user.id;
    console.log("Hier req.user.id: " + req.user.id);

    try {
        // Klassenzimmer des Benutzers abrufen
        const [classrooms] = await db.query(
            `SELECT c.id, c.name, c.description, cu.role 
             FROM classrooms c
             JOIN classroom_users cu ON c.id = cu.classroom_id
             WHERE cu.user_id = ?`,
            [userId]
        );

        res.status(200).json(classrooms);
    } catch (error) {
        console.error('Fehler beim Abrufen der Klassenzimmer:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Klassenzimmer.' });
    }
};

// add user to classroom
exports.addUserToClassroom = async (req, res) => {
    const { userId, role } = req.body;
    const classroomId = req.params.id;
    const requestingUserId = req.user.id;

    try {
        // ask if user is the creator
        const [creatorCheck] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, requestingUserId]
        );

        if (!creatorCheck.length || creatorCheck[0].role !== 'creator') {
            return res.status(403).json({ error: 'Nur der Ersteller kann Benutzer hinzufügen.' });
        }

        // add user
        await db.query(
            'INSERT INTO classroom_users (classroom_id, user_id, role) VALUES (?, ?, ?)',
            [classroomId, userId, role]
        );

        res.status(201).json({ message: 'Benutzer erfolgreich hinzugefügt!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Hinzufügen des Benutzers' });
    }
};

// userlist of classroom
exports.getClassroomUsers = async (req, res) => {
    const classroomId = req.params.id;

    try {
        const [users] = await db.query(
            `SELECT u.id, u.email, cu.role 
             FROM classroom_users cu 
             JOIN users u ON cu.user_id = u.id 
             WHERE cu.classroom_id = ?`,
            [classroomId]
        );

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
    }
};

// delete user from classroom
exports.removeUserFromClassroom = async (req, res) => {
    const { classroomId } = req.params;
    const userId = req.user.id; // ID des authentifizierten Benutzers

    try {
        // deletes user from class
        const [result] = await db.query(
            'DELETE FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Benutzer oder Klasse nicht gefunden. UserID: ${userId}, classroomId: ${classroomId}` });
        }

        res.status(200).json({ message: 'Benutzer erfolgreich aus der Klasse entfernt' });
    } catch (error) {
        console.error('Fehler beim Entfernen des Benutzers aus der Klasse:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};


exports.getClassroomData = async (req, res) => {
    const { id } = req.params;

    try {
        const [messages] = await db.query('SELECT * FROM messages WHERE classroom_id = ?', [id]);
        const [files] = await db.query('SELECT * FROM files WHERE classroom_id = ?', [id]);
        res.status(200).json({ messages, files });
    } catch (error) {
        console.error('Fehler beim Abrufen der Klassenzimmer-Daten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Klassenzimmer-Daten.' });
    }
};

// send messages
exports.sendMessage = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    try {
        const [result] = await db.query(
            'INSERT INTO messages (classroom_id, user_id, content) VALUES (?, ?, ?)',
            [id, userId, message]
        );
        res.status(201).json({ id: result.insertId, content: message });
    } catch (error) {
        console.error('Fehler beim Senden der Nachricht:', error);
        res.status(500).json({ error: 'Fehler beim Senden der Nachricht.' });
    }
};


exports.uploadFile = async (req, res) => {
    console.log('Eingehende Datei:', req.file);
    console.log('Classroom ID:', req.params.classroomId); // Debugging der Classroom-ID

    if (!req.file) {
        return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
    }

    try {
        const classroomId = req.params.classroomId;
        const userId = req.user.id;

        // Datenbankeintrag erstellen
        await db.query(
            'INSERT INTO files (name, type, path, classroom_id, user_id) VALUES (?, ?, ?, ?, ?)',
            [req.file.originalname, req.file.mimetype, req.file.path, classroomId, userId]
        );

        res.status(200).json({ message: 'Datei erfolgreich hochgeladen.' });
    } catch (error) {
        console.error('Fehler beim Hochladen der Datei:', error);
        res.status(500).json({ error: 'Fehler beim Hochladen der Datei.' });
    }
};



exports.getFiles = async (req, res) => {
    const { classroomId } = req.params;

    try {
        // Dateien aus der Datenbank abrufen
        const [files] = await db.query(
            'SELECT id, name FROM files WHERE classroom_id = ?',
            [classroomId]
        );

        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'Keine Dateien gefunden.' });
        }

        res.status(200).json(files);
    } catch (error) {
        console.error('Fehler beim Abrufen der Dateien:', error);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
};

exports.getFileData = async (req, res) => {
    const { fileId } = req.params;

    try {
        // Datei-Details aus der Datenbank abrufen
        const [files] = await db.query('SELECT name, path, type FROM files WHERE id = ?', [fileId]);

        if (files.length === 0) {
            return res.status(404).json({ error: 'Datei nicht gefunden.' });
        }

        const file = files[0];
        const absolutePath = path.resolve(file.path); // Absoluter Pfad zur Datei

        console.log('Liefere Datei aus:', absolutePath);

        // Datei vom Server senden
        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
        res.sendFile(absolutePath);
    } catch (error) {
        console.error('Fehler beim Abrufen der Datei:', error);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
};

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    const { classroomId } = req.params;

    try {
        // Kategorie in der Datenbank erstellen
        const [result] = await db.query(
            'INSERT INTO categories (name, description, classroom_id) VALUES (?, ?, ?)',
            [name, description, classroomId]
        );

        // Neue Kategorie-ID abrufen
        const newCategoryId = result.insertId; // `insertId` gibt die ID der neu erstellten Zeile zurück

        // Antwort an den Client senden
        res.status(201).json({ id: newCategoryId, name, description });
    } catch (error) {
        console.error('Fehler beim Erstellen der Kategorie:', error);

        // Fehler an den Client senden (nur einmal!)
        res.status(500).json({ error: 'Fehler beim Erstellen der Kategorie' });
    }
};

exports.checkUserRole = async (req, res) => {
    const { classroomId } = req.params;
    const userId = req.user.id;

    try {
        const [result] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'Benutzerrolle nicht gefunden' });
        }

        res.status(200).json({ role: result[0].role });
    } catch (error) {
        console.error('Fehler beim Überprüfen der Rolle:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};