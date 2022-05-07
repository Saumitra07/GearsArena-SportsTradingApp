const express = require('express');
const controller = require('../contollers/userController');
const {isGuest,isAuthenticated} =require('../middleware/auth');
const {validateSignUp,validateLogin,validateResult}=require('../middleware/validator')
const {loginLimiter}=require('../middleware/rateLimiter')
const router = express.Router();


router.get('/',controller.index);


router.get('/new',isGuest,controller.new);


router.post('/',isGuest,validateSignUp,validateResult,controller.signup);


router.get('/login',isGuest,controller.login);

router.post('/login',loginLimiter,isGuest,validateLogin,validateResult,controller.loginUser);

router.get('/profile',isAuthenticated,controller.profile);

router.get('/profile/:id/manageTrade/',isAuthenticated,controller.manageTrade)

router.get('/profile/:id/responseToOffer/',isAuthenticated,controller.responseToOffer)

router.get('/logout',isAuthenticated,controller.logout);

router.post('/profile/:id/acceptTrade',isAuthenticated,controller.acceptTrade)

router.delete('/profile/:id/cancelTrade',isAuthenticated,controller.cancelInitiatedTrade)

module.exports=router;