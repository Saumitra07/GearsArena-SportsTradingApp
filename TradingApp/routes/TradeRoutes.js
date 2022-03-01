const express=require('express');
const controller=require('../contollers/itemController');

const router=express.Router();

router.get('/',controller.index);

router.get('/:id',controller.getTrade);

module.exports =router;