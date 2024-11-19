const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.create = async (userData) => {
    const { email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [
        email,
        hashedPassword,
        role,
    ]);
    return result;
};

exports.findByEmail = async (email) => {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return results;
};
