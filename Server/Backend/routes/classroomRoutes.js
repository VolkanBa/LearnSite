// Classroom-related routes
const express = require('express');
const router = express.Router();
const { createClassroom, getClassrooms, removeUserFromClassroom} = require('../controllers/classroomController.js');
const authMiddleware = require('../controllers/middelware.js');
const { getClassroomData, sendMessage, uploadFile } = require('../controllers/classroomController.js');

// GET /api/classrooms - gets all classrooms of the user
// Route zum Erstellen eines Klassenzimmers
router.post('/create', authMiddleware, createClassroom);

// Route zum Abrufen der Klassenzimmer
router.get('/', authMiddleware, getClassrooms);

// Route zum Entfernen eines Benutzers aus einem Klassenzimmer
router.delete('/:classroomId/remove', authMiddleware, removeUserFromClassroom);

// Klassenzimmer-Daten
router.get('/:id/data', authMiddleware, getClassroomData); 
// Nachrichten
router.post('/:id/messages', authMiddleware, sendMessage); 
// Dateien hochladen
router.post('/:id/upload', authMiddleware, uploadFile); 


module.exports = router;