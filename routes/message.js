const express = require('express');
const messageController = require('../controllers/message');
const userauthentication=require('../middlewares/auth');

const router = express.Router();

router.post('/add-message',userauthentication.authenticate,messageController.addMsg);

router.get('/get-message/:groupId',messageController.getMsgs)

module.exports = router; 