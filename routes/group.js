const express = require('express');
const groupController = require('../controllers/group');
const userauthentication=require('../middlewares/auth');

const router = express.Router();

router.get('/add-user',groupController.adduser);

router.get('/remove-user',groupController.removeuser);

router.get('/makeAdmin',groupController.makeAdmin);

router.get('/removeAdmin',groupController.removeAdmin);

router.get('/isAdmin',groupController.isAdmin);

router.get('/get-members/:groupId',groupController.getmembers)

router.get('/get-group',userauthentication.authenticate,groupController.getgroup);

router.post('/add-group',userauthentication.authenticate,groupController.addgroup);



module.exports = router; 