const db = require('../config/db');
const express = require('express');

// create classroom
exports.createClassroom = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id; // Authenticated user

    try {
        // create classroom
        const [result] = await db.query(
            'INSERT INTO classrooms (name, description, creator_id) VALUES (?, ?, ?)',
            [name, description, userId]
        );

        // Make user a creator
        await db.query(
            'INSERT INTO classroom_users (classroom_id, user_id, role) VALUES (?, ?, ?)',
            [result.insertId, userId, 'creator']
        );

        res.status(201).json({ message: 'Klassenzimmer erstellt!', classroomId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Klassenzimmers' });
    }
};


exports.getClassrooms = async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM classrooms WHERE creator_id = ?', [req.user.id]);
      res.status(200).json(rows);
  } catch (error) {
      console.error('Fehler beim Abrufen der Klassenzimmer:', error);
      res.status(500).json({ error: 'Fehler beim Abrufen der Klassenzimmer.' });
  }
};

// add user to classroom
exports.addUserToClassroom = async (req, res) => {
    const { userId, role } = req.body;
    const classroomId = req.params.id;
    const requestingUserId = req.user.id;

    try {
        // ask if user is the creator
        const [creatorCheck] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, requestingUserId]
        );

        if (!creatorCheck.length || creatorCheck[0].role !== 'creator') {
            return res.status(403).json({ error: 'Nur der Ersteller kann Benutzer hinzufügen.' });
        }

        // add user
        await db.query(
            'INSERT INTO classroom_users (classroom_id, user_id, role) VALUES (?, ?, ?)',
            [classroomId, userId, role]
        );

        res.status(201).json({ message: 'Benutzer erfolgreich hinzugefügt!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Hinzufügen des Benutzers' });
    }
};

// userlist of classroom
exports.getClassroomUsers = async (req, res) => {
    const classroomId = req.params.id;

    try {
        const [users] = await db.query(
            `SELECT u.id, u.email, cu.role 
             FROM classroom_users cu 
             JOIN users u ON cu.user_id = u.id 
             WHERE cu.classroom_id = ?`,
            [classroomId]
        );

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
    }
};

// delete user from classroom
exports.removeUserFromClassroom = async (req, res) => {
    const { classroomId } = req.params;
    const { userIdToRemove } = req.body;
    const requestingUserId = req.user.id;

    try {
        // get permission of user
        const [requestingUser] = await db.query(
            'SELECT role FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, requestingUserId]
        );

        if (!requestingUser.length) {
            return res.status(403).json({ error: 'Du bist kein Mitglied dieses Klassenzimmers.' });
        }

        const requestingRole = requestingUser[0].role;

        // role of user
        if (requestingRole === 'teacher' && userIdToRemove === 'creator') {
            return res.status(403).json({ error: 'Lehrer können den Ersteller nicht entfernen.' });
        }

        if (requestingRole === 'creator' && userIdToRemove === requestingUserId) {
            return res.status(403).json({ error: 'Der Creator kann sich nicht selbst entfernen.' });
        }

        // delete user
        await db.query(
            'DELETE FROM classroom_users WHERE classroom_id = ? AND user_id = ?',
            [classroomId, userIdToRemove]
        );

        res.status(200).json({ message: 'Benutzer erfolgreich entfernt!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Entfernen des Benutzers.' });
    }
};
