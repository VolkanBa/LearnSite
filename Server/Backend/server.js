const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes.js');
const db = require('./config/db');
const authMiddleware = require('./controllers/middelware.js');
const classroomRoutes = require('./routes/classroomRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(express.json());

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));




// Geschützte Routen
app.use('/api/classrooms', authMiddleware, classroomRoutes);


db.query('SELECT 1')
    .then(() => console.log('Database connection succesfull!'))
    .catch((err) => console.error('error while trying to connect to database:', err));


app.use('/api/users', (req, res, next) => {
  console.log(`Route aufgerufen: ${req.method} ${req.url}`);
  next();
});

// Middleware
//app.use(cors());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.get('/api/user', authMiddleware, (req, res) => {
  // Nach erfolgreicher Validierung: Zugriff auf Benutzerdaten
  res.status(200).json({ id: req.user.id, email: 'beispiel@example.com', role: req.user.role });
});


app.use(cookieParser());

// Routen
app.use('/api/users', userRoutes);

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

app.use('/api/classrooms', classroomRoutes);


app.use('/api/classrooms', authMiddleware);
app.use('/api', userRoutes); // Präfix für die Routen


