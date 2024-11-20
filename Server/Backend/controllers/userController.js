require('dotenv').config();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

// Secrets aus der .env-Datei
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;





// Registrierung
// exports.register = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//       // Passwort hashen
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Benutzer speichern
//       await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);

//       // Erfolgreiche Antwort senden
//       res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
//   } catch (error) {
//       console.error('Fehler bei der Registrierung:', error);
//       res.status(500).json({ error: 'Fehler bei der Registrierung' });
//   }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Benutzer aus der Datenbank abrufen
//         const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//         if (!user.length) {
//             return res.status(404).json({ error: 'Benutzer nicht gefunden' });
//         }

//         // Passwort überprüfen
//         const isMatch = await bcrypt.compare(password, user[0].password);
//         if (!isMatch) {
//             return res.status(401).json({ error: 'Falsches Passwort' });
//         }

//         // Einzigartiges Refresh Token generieren
//         const refreshToken = uuidv4();

//         // Refresh Token in der Datenbank speichern
//         await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user[0].id]);

//         // Refresh Token als HTTP-only Cookie setzen
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', // Nur HTTPS in Produktion
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
//         });

//         res.status(200).json({ message: 'Erfolgreich eingeloggt' });
//     } catch (error) {
//         console.error('Fehler beim Login:', error);
//         res.status(500).json({ error: 'Serverfehler beim Login' });
//     }
// };

// exports.logout = async (req, res) => {
//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//         return res.status(400).json({ error: 'Kein Token vorhanden' });
//     }

//     try {
//         // Token in der Datenbank entfernen
//         await db.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);

//         // Cookie löschen
//         res.clearCookie('refreshToken');

//         res.status(200).json({ message: 'Erfolgreich ausgeloggt' });
//     } catch (error) {
//         console.error('Fehler beim Logout:', error);
//         res.status(500).json({ error: 'Serverfehler beim Logout' });
//     }
// };




exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await User.findByEmail(email);
        if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Login' });
    }
};

// Registrierung
exports.register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'Benutzer registriert', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler bei der Registrierung' });
    }
};

// Refresh-Token
exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'Nicht authentifiziert' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.status(200).json({ token: newToken });
    } catch (err) {
        res.status(403).json({ error: 'Ungültiger Refresh-Token' });
    }
};



exports.getProfile = (req, res) => {
    const user = req.user; // Benutzerinfo aus dem Token
    if (!user) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.status(200).json({
        id: user.id,
        email: user.email, // Du kannst dies erweitern, wenn weitere Infos im Token sind
        role: user.role, // Falls im Token vorhanden
    });
};