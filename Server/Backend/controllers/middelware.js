const authMiddleware = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken; // Token aus dem Cookie abrufen

    if (!refreshToken) {
        return res.status(401).json({ error: 'Kein Token vorhanden' });
    }

    try {
        // Überprüfen, ob der Refresh Token in der Datenbank existiert
        const [user] = await db.query('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
        if (!user.length) {
            return res.status(403).json({ error: 'Ungültiger Token' });
        }

        // Benutzerdaten dem Request hinzufügen
        req.user = { id: user[0].id, email: user[0].email, role: user[0].role };
        next(); // Weiter zur nächsten Middleware oder Route
    } catch (error) {
        console.error('Fehler beim Authentifizieren:', error);
        res.status(500).json({ error: 'Serverfehler beim Authentifizieren' });
    }
};


module.exports = authMiddleware;
