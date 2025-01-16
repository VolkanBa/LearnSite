// Classroom-related routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClassroom, getClassrooms, removeUserFromClassroom, uploadFile, getFiles, getFileData} = require('../controllers/classroomController.js');
const authMiddleware = require('../controllers/middelware.js');
const upload = require('../controllers/uploadMiddleware.js')
const { getClassroomData, sendMessage } = require('../controllers/classroomController.js');
const { createCategory, getCategories, updateCategory } = require('../controllers/categoryController');
const { uploadFileToCategory, getFilesInCategory, getFile, downloadFile } = require('../controllers/fileController');
const {checkUserRole} = require('../controllers/classroomController.js')



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

router.post('/:classroomId/upload', authMiddleware, upload.single('file'), uploadFile);

// Route zum Abrufen von Dateien
router.get('/:classroomId/files', authMiddleware, getFiles);

// Route zum Abrufen einer spezifischen Datei
router.get('/:classroomId/files/:fileId', authMiddleware, getFileData);
router.get('/:classroomId/files/:fileId', authMiddleware, getFile);

// Kategorien-Endpunkte
router.post('/:classroomId/categories', authMiddleware, createCategory);
router.get('/:classroomId/categories', authMiddleware, getCategories);
router.patch('/:classroomId/categories/:categoryId', authMiddleware, updateCategory);

// Dateien in Kategorien
router.post('/:classroomId/categories/:categoryId/files', authMiddleware, upload.single('file'), uploadFileToCategory);
router.get('/:classroomId/categories/:categoryId/files', authMiddleware, getFilesInCategory);
router.get('/:classroomId/role', authMiddleware, checkUserRole);
router.get('/:classroomId/files/:fileId', authMiddleware, downloadFile);

module.exports = router;