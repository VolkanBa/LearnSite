// Classroom-related routes
const express = require('express');
const router = express.Router();
const { createClassroom, getClassrooms, deleteUserFromClassroom } = require('../controllers/classroomController.js');
const authMiddleware = require('../controllers/middelware.js');

// GET /api/classrooms - gets all classrooms of the user
// Route zum Erstellen eines Klassenzimmers
router.post('/create', authMiddleware, createClassroom);

// Route zum Abrufen der Klassenzimmer
router.get('/', authMiddleware, getClassrooms);

// Route zum Entfernen eines Benutzers aus einem Klassenzimmer
router.delete('/classrooms/:classroomId/leave', authMiddleware, deleteUserFromClassroom);


module.exports = router;