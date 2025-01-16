const db = require('../config/db');

// Kategorie erstellen
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    const { classroomId } = req.params;
    const userId = req.user.id;

    try {
        const [roleCheck] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userId]
        );

        if (!roleCheck.length || roleCheck[0].role !== 'creator') {
            return res.status(403).json({ error: 'Nur der Creator kann Kategorien erstellen.' });
        }

        const [result] = await db.query(
            'INSERT INTO categories (name, description, classroom_id) VALUES (?, ?, ?)',
            [name, description, classroomId]
        );

        const newCategoryId = result.insertId; // Neue Kategorie-ID speichern

        res.status(201).json({
            id: newCategoryId,
            name,
            description,
            files: [], // Immer ein leeres Array zurückgeben
        });
    } catch (error) {
        console.error('Fehler beim Erstellen der Kategorie:', error);
        res.status(500).json({ error: 'Interner Fehler' });
    }
};


// Alle Kategorien abrufen
exports.getCategories = async (req, res) => {
    const { classroomId } = req.params;

    try {
        const [categories] = await db.query(
            'SELECT * FROM categories WHERE classroom_id = ?',
            [classroomId]
        );

        res.status(200).json(categories);
    } catch (error) {
        console.error('Fehler beim Abrufen der Kategorien:', error);
        res.status(500).json({ error: 'Interner Fehler' });
    }
};

// Beschreibung einer Kategorie aktualisieren
exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { description } = req.body;
    const userId = req.user.id;

    try {
        const [roleCheck] = await db.query(
            'SELECT c.id FROM categories c JOIN classrooms cl ON c.classroom_id = cl.id JOIN classroom_users cu ON cl.id = cu.classroom_id WHERE c.id = ? AND cu.user_id = ? AND cu.role = ?',
            [categoryId, userId, 'creator']
        );

        if (!roleCheck.length) {
            return res.status(403).json({ error: 'Nur der Creator kann Kategorien aktualisieren.' });
        }

        await db.query(
            'UPDATE categories SET description = ? WHERE id = ?',
            [description, categoryId]
        );

        res.status(200).json({ message: 'Kategorie erfolgreich aktualisiert.' });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Kategorie:', error);
        res.status(500).json({ error: 'Interner Fehler' });
    }
};
