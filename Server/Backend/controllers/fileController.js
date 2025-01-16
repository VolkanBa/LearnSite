const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Datei hochladen
exports.uploadFileToCategory = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
    }

    const { categoryId } = req.params;
    const userId = req.user.id;

    try {
        // Classroom ID ermitteln
        const [category] = await db.query(
            'SELECT classroom_id FROM categories WHERE id = ?',
            [categoryId]
        );

        if (!category.length) {
            return res.status(404).json({ error: 'Kategorie nicht gefunden.' });
        }

        const classroomId = category[0].classroom_id;

        // Datei in die Datenbank einfügen
        await db.query(
            'INSERT INTO files (name, type, path, category_id, user_id, classroom_id) VALUES (?, ?, ?, ?, ?, ?)',
            [
                req.file.originalname,
                req.file.mimetype,
                req.file.path,
                categoryId,
                userId,
                classroomId, // Hier wird classroom_id hinzugefügt
            ]
        );

        res.status(200).json({ message: 'Datei erfolgreich hochgeladen.' });
    } catch (error) {
        console.error('Fehler beim Hochladen der Datei:', error);
        res.status(500).json({ error: 'Interner Fehler' });
    }
};



// Dateien in Kategorie abrufen
exports.getFilesInCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Dateien aus der Datenbank abrufen
        const [files] = await db.query(
            'SELECT id, name, path FROM files WHERE category_id = ?',
            [categoryId]
        );

        res.status(200).json(files);
    } catch (error) {
        console.error('Fehler beim Abrufen der Dateien:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};


exports.getFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        // Datei aus der Datenbank abrufen
        const [fileData] = await db.query(
            'SELECT name, path FROM files WHERE id = ?',
            [fileId]
        );

        if (!fileData.length) {
            return res.status(404).json({ error: 'Datei nicht gefunden.' });
        }

        const file = fileData[0];
        const filePath = path.resolve(file.path);

        // Datei-Download bereitstellen
        res.download(filePath, file.name, (err) => {
            if (err) {
                console.error('Fehler beim Bereitstellen der Datei:', err);
                res.status(500).json({ error: 'Fehler beim Bereitstellen der Datei.' });
            }
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Datei:', error);
        res.status(500).json({ error: 'Interner Fehler' });
    }
};

exports.downloadFile = async (req, res) => {
    const { fileId } = req.params;
    const token = req.query.token;

    try {
        if (!token) {
            return res.status(401).json({ error: 'Kein Authorization-Token' });
        }

        // Token validieren
        jwt.verify(token, process.env.JWT_SECRET);

        // Datei abrufen
        const [file] = await db.query('SELECT name, path FROM files WHERE id = ?', [fileId]);

        if (!file.length) {
            return res.status(404).json({ error: 'Datei nicht gefunden.' });
        }

        const filePath = path.resolve(file[0].path);

        // Datei zurückgeben
        res.download(filePath, file[0].name, (err) => {
            if (err) {
                console.error('Fehler beim Datei-Download:', err);
                res.status(500).json({ error: 'Fehler beim Datei-Download.' });
            }
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Datei:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};