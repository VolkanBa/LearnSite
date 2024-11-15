const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Token:', token);
    
    if (!token) {
        return res.status(401).json({ error: 'Token fehlt' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Benutzerinformationen für spätere Nutzung
        next(); // Weiter zur nächsten Middleware oder Route
    } catch (err) {
        res.status(403).json({ error: 'Ungültiges Token' });
    }
};
module.exports = authMiddleware;
