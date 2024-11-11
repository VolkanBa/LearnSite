const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Registrierung
exports.register = (req, res) => {
  const { email, password, role } = req.body;
  User.create({ email, password, role }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Benutzer nicht gefunden!' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err });
      if (!isMatch) return res.status(401).json({ message: 'Falsches Passwort!' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  });
};

