const express=require('express');
const controller=require('../contollers/itemController');

const {isGuest,isAuthenticated,isTrader} =require('../middleware/auth');
const {validateId,validateItem,validateResult} =require('../middleware/validator');

const router=express.Router();

router.get('/',controller.index);

router.get('/new',isAuthenticated,controller.new);

router.post('/',validateItem,validateResult,controller.create);

router.get('/:id',validateId,controller.getTrade);


router.get('/:id/edit',isAuthenticated,isTrader,validateId,controller.edit);

router.post('/:id/watchtrade',isAuthenticated,validateId,controller.watchTrade)

router.delete('/:id/unwatchtrade',isAuthenticated,validateId,controller.unwatchTrade)


router.put('/:id',isAuthenticated,isTrader,validateId,validateItem,validateResult,controller.update);



router.delete('/:id',isAuthenticated,isTrader,validateId,controller.delete);

module.exports =router;