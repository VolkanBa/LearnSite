const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // Optional: Für Cross-Origin-Requests
app.use(express.json()); // Um JSON-Daten zu parsen
app.use(express.urlencoded({ extended: true })); // Für URL-codierte Daten

const authMiddleware = (req, res, next) => {


    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error('Kein Authorization-Header vorhanden');
        return res.status(401).json({ error: 'Kein Authorization-Header' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        console.error('Token fehlt im Authorization-Header');
        return res.status(401).json({ error: 'Token fehlt' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Fehler bei der Token-Überprüfung:', err);
            return res.status(401).json({ error: 'Ungültiges Token' });
        }

        req.user = decoded; // Benutzer-Daten speichern
        next();
    });
};

module.exports = authMiddleware;
