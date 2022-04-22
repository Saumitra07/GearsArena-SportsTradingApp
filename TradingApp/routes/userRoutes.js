const express = require('express');
const controller = require('../contollers/userController');

const router = express.Router();


router.get('/',controller.index);


router.get('/new',controller.new);


router.post('/',controller.signup);


router.get('/login',controller.login);

router.post('/login',controller.loginUser);

router.get('/profile',controller.profile);

router.get('/logout',controller.logout);


module.exports=router;