const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createImage, getSingleProductImages, updateImage, deleteImage } = require('../controllers/productImages');

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.route('/:id').get(getSingleProductImages);
router.route('/').post(upload.single('file'), createImage);
router.route('/:id').put(updateImage);
router.route('/:id').delete(deleteImage);

module.exports = router;