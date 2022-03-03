const express=require('express');
const controller=require('../contollers/itemController');

const router=express.Router();

router.get('/',controller.index);

router.get('/new',controller.new);

router.post('/',controller.create);

router.get('/:id',controller.getTrade);

router.post('/',)

router.delete('/:id',controller.delete);

module.exports =router;