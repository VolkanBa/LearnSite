const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const db = require('./config/db');
const authMiddleware = require('./controllers/middelware');
const classroomRoutes = require('./routes/classroomRoutes');

// Geschützte Routen
app.use('/api/classrooms', authMiddleware, classroomRoutes);


db.query('SELECT 1')
    .then(() => console.log('Database connection succesfull!'))
    .catch((err) => console.error('error while trying to connect to database:', err));

app.use((req, res, next) => {
  req.user = { id: 1 }; // Setze testweise einen Benutzer mit ID 1
  next();
});


app.use('/api/users', (req, res, next) => {
  console.log(`Route aufgerufen: ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/users', userRoutes);

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

app.use('/api/classrooms', classroomRoutes);


app.use('/api/classrooms', authMiddleware);

