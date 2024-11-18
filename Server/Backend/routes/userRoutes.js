const express = require('express');
const router = express.Router();
const app = express();
const { register, login } = require('../controllers/userController'); // Controller for registration and login

// register
router.post('/register', register);

// Login
router.post('/login', login);

// router.get('/user', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Token extrahieren
//   if (!token) {
//       return res.status(401).json({ error: 'Token fehlt' });
//   }

//   try {
//       // JWT-Token überprüfen
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       res.status(200).json({ id: decoded.id, email: 'beispiel@example.com', role: 'student' });
//   } catch (err) {
//       res.status(403).json({ error: 'Ungültiges Token' });
//   }
// });



app.get('/api/user', (req, res) => {
  console.log('Benutzerinformationen aus Token:', req.user);
  res.status(200).json({ message: 'Benutzer gefunden' });
});


module.exports = router;
