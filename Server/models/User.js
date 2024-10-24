const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (data, callback) => {
    bcrypt.hash(data.password, 10, (err, hash) => {
      if (err) throw err;
      const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
      db.query(query, [data.email, hash, data.role], callback);
    });
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
  }
};

module.exports = User;
