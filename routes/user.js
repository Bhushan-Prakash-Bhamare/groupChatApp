const express = require('express');
const userController = require('../controllers/user');
const userauthentication=require('../middlewares/auth');

const router = express.Router();

router.get('/:UserId',userController.getuser);

router.post('/signup',userController.signup);

router.post('/login',userController.login);

module.exports = router; 