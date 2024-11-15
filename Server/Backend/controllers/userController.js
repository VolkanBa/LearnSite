require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db.js');


// Registrierung
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
      // Passwort hashen
      const hashedPassword = await bcrypt.hash(password, 10);

      // Benutzer speichern
      await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);

      // Erfolgreiche Antwort senden
      res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
  } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Prüfe, ob die E-Mail in der Datenbank existiert
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

      if (user.length === 0) {
          return res.status(404).json({ error: 'Benutzer nicht gefunden!' });
      }

      const userData = user[0]; // Der erste Benutzer aus der Abfrage

      // Vergleiche das eingegebene Passwort mit dem gehashten Passwort
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Falsches Passwort!' });
      }

      // Erstelle ein JWT-Token
      const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Erfolgreiche Antwort senden
      res.status(200).json({ message: 'Erfolgreich eingeloggt!', token });
  } catch (error) {
      console.error('Fehler beim Login:', error);
      res.status(500).json({ error: 'Fehler beim Login.' });
  }
};