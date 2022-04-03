const e = require('express');
const model = require('../models/item')


exports.index = (req, res) => {
  model.find()
  .then(trades=>res.render('./trades/index.ejs', { trades: trades }))
  .catch(err=>next(err));
}

exports.getTrade = (req, res,next) => {

  let id = req.params.id;
  if(!id.match(/^[0-9a-fA-F]{24}$/))
  {
      let err=new Error('Invalid trade id');
      err.status=400;
      return next(err);
  }

  model.findOne({"items._id":id})
  .then(item=>{
          if(item)
          {
            model.findOne({_id:item._id},{items:{$elemMatch:{_id:id}}})
            .then(item1=>{
              console.log(item1);
              return res.render('./trades/show.ejs',{item:item1.items[0]});
            }  
            )
            .catch(err=>next(err));
          }
          else{
            let err=new Error('can not find trade id'+id);
            err.status=404;
            return next(err);
          }
        
  })
  .catch(err=>next(err));


}

exports.new = (req, res) => {
    res.render('./trades/new.ejs');

};

exports.create = (req, res,next) => {

  let item = req.body;
   item.itemImage='/images/baseball1.jpeg';

  model.findOneAndUpdate({categoryName:item.categoryName},{$push:{items:item}},{runValidators: true,upsert:true})
  .then(trade=>{
    return res.redirect('/trades');
  })
  .catch(err=>{
    if(err.name==='ValidationError')
    err.status=400;
      next(err);
  });

}

exports.delete = (req, res,next) => {
  let id = req.params.id;
  if(!id.match(/^[0-9a-fA-F]{24}$/))
  {
      let err=new Error('Invalid trade id');
      err.status=400;
      return next(err);
  }
     model.findOneAndUpdate(
      { "items._id":id },
      { $pull:{"items":{"_id":id}}})
      .then(trade=>{
        if(trade)
        {
           // console.log(trade);
          return  res.redirect('/trades');
  
        }
        else
        { 
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
             next(err);
  
        }})
        .catch(err=>next(err));


}



exports.edit = (request, response, next) => {
  let id = request.params.id;

  if(!id.match(/^[0-9a-fA-F]{24}$/))
    {
        let err=new Error('Invalid trade id');
        err.status=400;
        return next(err);
    }

 
  model.findOne({"items._id":id})
  .then(item=>{
          if(item)
          {
            model.findOne({_id:item._id},{items:{$elemMatch:{_id:id}}})
            .then(item1=>{
             // console.log(item1);
              return response.render('./trades/edit.ejs',{item:item1.items[0],category:item.categoryName});
            }  
            )
            .catch(err=>next(err));
          }
          else{
            let err=new Error('can not find trade id'+id);
            err.status=404;
            return next(err);
          }
        
  })
  .catch(err=>next(err));




};

exports.update = (req, res,next) => {

  let id = req.params.id;
  
  if(!id.match(/^[0-9a-fA-F]{24}$/))
    {
        let err=new Error('Invalid trade id');
        err.status=400;
        return next(err);
    }
  model.findOneAndUpdate(
    { "items._id":id },
    { $set: { 'items.$.itemName': req.body.itemName,
    'items.$.itemDescription':req.body.itemDescription},'categoryName':req.body.categoryName}, {runValidators: true,upsert:true} )
    .then(item=>{
      if(item)
      {
            console.log(item);
            res.redirect('/trades/'+id);

      }
      else
      { 
          let err = new Error('Cannot find a item with id ' + id);
          err.status = 404;
           next(err);

      }})
      .catch(err=>{
        if(err.name==='ValidationError')
            err.status=400;
        next(err);}
);

}