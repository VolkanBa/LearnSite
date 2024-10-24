const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// Registrierung und Login Endpunkte
router.post('/register', register);
router.post('/login', login);

module.exports = router;
