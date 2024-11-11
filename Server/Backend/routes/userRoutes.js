const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController'); // Controller for registration and login

// register
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;
