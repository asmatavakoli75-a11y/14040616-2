import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = 'server/uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @desc    Upload a data file
// @route   POST /api/data/upload
// @access  Private/Admin
router.post('/upload', upload.single('datafile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  res.status(200).json({
    message: 'File uploaded successfully.',
    filePath: req.file.path
  });
});

export default router;
