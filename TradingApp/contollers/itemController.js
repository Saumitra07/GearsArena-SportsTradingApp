const e=require('express');
const model=require('../models/item')


exports.index=(req,res)=>
{
    let trades=model.getTrades();
    res.render('./trades/index.ejs',{trades:trades});
}

exports.getTrade=(req,res)=>{

    let id=req.params.id;
    let item=model.getTrade(id);
    
    console.log(item);
    if(item)
    {
        res.render('./trades/show.ejs',{item:item});


    }
    else{
      res.status(400).send('Cannot find story with id '+ id);

        // let err=new Error('Cannot find story with id '+ id);
        // err.status=404;
        // next(err);
    }
}