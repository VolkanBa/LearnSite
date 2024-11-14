const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Kein Token bereitgestellt' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifiziere das Token mit deinem Geheimnis
        req.user = { id: decoded.id }; // Setze die Benutzer-ID in req.user
        next();
    } catch (error) {
        console.error('Ungültiges Token:', error);
        res.status(403).json({ error: 'Ungültiges Token' });
    }
};

module.exports = authMiddleware;
