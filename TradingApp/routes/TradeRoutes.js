const express=require('express');
const controller=require('../contollers/itemController');

const router=express.Router();

router.get('/',controller.index);

router.get('/new',controller.new);

router.post('/',controller.create);

router.get('/:id',controller.getTrade);


router.get('/:id/edit',controller.edit);


//PUT to update a story

router.put('/:id',controller.update);


// router.post('/',)

router.delete('/:id',controller.delete);

module.exports =router;