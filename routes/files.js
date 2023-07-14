const express = require('express');
const fileController = require('../controllers/files');
const filesmiddleware=require('../middlewares/upload');

const router = express.Router();

router.post('/uploadfiles',filesmiddleware.single('file'),fileController.uploads);

module.exports = router; 