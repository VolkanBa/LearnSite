const db = require('../config/db');

exports.removeUserFromClassroom = async (req, res) => {
    const { classroomId } = req.params; // ID des Klassenzimmers
    const { userIdToRemove } = req.body; // ID des Benutzers, der entfernt werden soll
    const requestingUserId = req.user.id; // Authentifizierter Benutzer (der die Anfrage stellt)

    try {
        // Berechtigungen des anfragenden Benutzers abrufen
        const [requestingUser] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, requestingUserId]
        );

        if (!requestingUser.length) {
            return res.status(403).json({ error: 'Du bist kein Mitglied dieses Klassenzimmers.' });
        }

        const requestingRole = requestingUser[0].role;

        // Berechtigungen prüfen: Kann der Benutzer andere entfernen?
        if (requestingRole !== 'creator' && requestingRole !== 'teacher') {
            return res.status(403).json({ error: 'Nur Lehrer oder der Creator können Benutzer entfernen.' });
        }

        // Rolle des Benutzers, der entfernt werden soll, abrufen
        const [userToRemove] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userIdToRemove]
        );

        if (!userToRemove.length) {
            return res.status(404).json({ error: 'Benutzer nicht im Klassenzimmer gefunden.' });
        }

        const roleToRemove = userToRemove[0].role;

        // Prüfen, ob der Benutzer entfernt werden darf
        if (requestingRole === 'teacher' && roleToRemove !== 'student') {
            return res.status(403).json({ error: 'Lehrer können nur Schüler entfernen.' });
        }

        if (requestingRole === 'creator' && userIdToRemove === requestingUserId) {
            return res.status(403).json({ error: 'Der Creator kann sich nicht selbst entfernen.' });
        }

        // Benutzer aus dem Klassenzimmer entfernen
        await db.query(
            'DELETE FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userIdToRemove]
        );

        res.status(200).json({ message: 'Benutzer erfolgreich entfernt.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Entfernen des Benutzers.' });
    }
};
