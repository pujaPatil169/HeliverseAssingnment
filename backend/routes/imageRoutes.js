const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');

router.post('/upload', authMiddleware, imageController.upload.single('image'), imageController.uploadImage);
router.delete('/:public_id', authMiddleware, imageController.deleteImage);

module.exports = router;
