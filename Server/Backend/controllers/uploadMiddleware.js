const multer = require('multer');
const path = require('path');

// Speicherort und Dateiname für hochgeladene Dateien konfigurieren
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Speicherort für hochgeladene Dateien
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Eindeutiger Dateiname
    },
});

// Datei-Filter für zulässige Dateitypen
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Datei zulassen
    } else {
        cb(new Error('Ungültiger Dateityp. Nur JPEG, PNG und PDF sind erlaubt.'), false);
    }
};

// Multer-Upload konfigurieren
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maximal 5 MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;
