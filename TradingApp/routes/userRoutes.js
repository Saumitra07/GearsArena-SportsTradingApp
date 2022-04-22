const express = require('express');
const controller = require('../contollers/userController');
const {isGuest,isAuthenticated} =require('../middleware/auth');
const router = express.Router();


router.get('/',controller.index);


router.get('/new',isGuest,controller.new);


router.post('/',isGuest,controller.signup);


router.get('/login',isGuest,controller.login);

router.post('/login',isGuest,controller.loginUser);

router.get('/profile',isAuthenticated,controller.profile);

router.get('/logout',isAuthenticated,controller.logout);


module.exports=router;