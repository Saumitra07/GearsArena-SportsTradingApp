const express=require('express');
const controller=require('../contollers/itemController');

const {isGuest,isAuthenticated,isTrader} =require('../middleware/auth');
const {validateId} =require('../middleware/validator');

const router=express.Router();

router.get('/',controller.index);

router.get('/new',isAuthenticated,controller.new);

router.post('/',controller.create);

router.get('/:id',validateId,controller.getTrade);


router.get('/:id/edit',isAuthenticated,isTrader,validateId,controller.edit);



router.put('/:id',isAuthenticated,isTrader,validateId,controller.update);



router.delete('/:id',isAuthenticated,isTrader,validateId,controller.delete);

module.exports =router;