const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');

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

