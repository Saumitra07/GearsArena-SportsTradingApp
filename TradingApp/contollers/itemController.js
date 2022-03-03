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




exports.new=(req,res)=>{

    //  res.send('send the new form');
  


    res.render('./trades/new.ejs');
  
  };
  
  exports.create=(req,res)=>
  {

    let item=req.body;
    model.createTrade(item);
    res.redirect('/trades');
  }

  exports.delete=(req,res)=>
  {
    let id=req.params.id;
   if(model.deleteById(id))
   {
       res.redirect('/trades');

   }
//    else{
//     let err=new Error('Cannot find story with id '+ id);
//     err.status=404;
//     next(err);
//    }
        
  }