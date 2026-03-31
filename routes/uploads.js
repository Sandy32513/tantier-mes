const express = require('express');
const multer = require('multer');
const path = require('path');
const { createUploadHandler } = require('../controllers/uploadController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname || '').toLowerCase();
    if (!['.csv', '.xlsx'].includes(extension)) {
      callback(new Error('Only .csv and .xlsx files are allowed.'));
      return;
    }
    callback(null, true);
  }
});

function handleSingleFile(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  });
}

router.post('/tool-group', handleSingleFile, createUploadHandler('tool-group'));
router.post('/tool', handleSingleFile, createUploadHandler('tool'));
router.post('/equipment-group', handleSingleFile, createUploadHandler('equipment-group'));
router.post('/equipment', handleSingleFile, createUploadHandler('equipment'));

module.exports = router;
