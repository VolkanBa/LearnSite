// Classroom-related routes
const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// GET /api/classrooms - gets all classrooms of the user
router.get('/', classroomController.getClassrooms);

router.post('/create', classroomController.createClassroom);
router.post('/:id/add-user', classroomController.addUserToClassroom);
router.get('/:id/users', classroomController.getClassroomUsers);
router.delete('/:classroomId/remove-user', classroomController.removeUserFromClassroom);

module.exports = router;