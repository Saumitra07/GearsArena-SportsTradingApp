const e = require('express');
const model = require('../models/item')
const flash=require('connect-flash');

const ObjectId = require('mongodb').ObjectId;

const watchModel=require('../models/watch');

exports.index = (req, res) => {
  model.find()
  .then(trades=>res.render('./trades/index.ejs', { trades: trades }))
  .catch(err=>next(err));
}

exports.getTrade = (req, res,next) => {

  let id = req.params.id;
  Promise.all([model.findOne({"items._id":id}), watchModel.findOne({user: req.session.user}, {watchedTrades: {$elemMatch:{trade_item:id}}})])
        .then(result => {
            const [item, watchedItems] = result
            if (item) {
              model.findOne({_id:item._id},{items:{$elemMatch:{_id:id}}})
                    .then(item1 => {
                          // if(!watchedItems)
                          // {
                          //   console.log("In show", watchedItems==null);
                            
                          // }
                          
                           return res.render('./trades/show.ejs',{item:item1.items[0],watchedItems});
                        }
                    )
                    .catch(err => {
                        next(err)
                    });
            }
            else {
                let err = new Error('Cannot find item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            next(err)
        });








  // Promise.all([model.findOne({"items._id":id}),watchModel.findOne({"user":req.session.user},{$elemMatch:{watchedTrades:{trade_item:id}}})]) 
  // .then(result=>{
  //   const [item,watchedItems]=result;
  //   console.log(watchedItems);
  //   if(item)
  //   {
  //     model.findOne({_id:item._id},{items:{$elemMatch:{_id:id}}})
  //     .then(item1=>{
  //      // console.log(item1);
  //       return res.render('./trades/show.ejs',{item:item1.items[0]});
  //     }  
  //     )
  //     .catch(err=>next(err));

  //   }
  
  //     else{
  //       let err=new Error('can not find trade id'+id);
  //       err.status=404;
  //       return next(err);
  //     }
    

  // }).catch(err=>next(err));


  // model.findOne({"items._id":id})
  // .then(item=>{
  //         if(item)
  //         {
  //           model.findOne({_id:item._id},{items:{$elemMatch:{_id:id}}})
  //           .then(item1=>{
  //             console.log(item1);
  //             return res.render('./trades/show.ejs',{item:item1.items[0]});
  //           }  
  //           )
  //           .catch(err=>next(err));
  //         }
  //         else{
  //           let err=new Error('can not find trade id'+id);
  //           err.status=404;
  //           return next(err);
  //         }
        
  // })
  // .catch(err=>next(err));


}

exports.new = (req, res) => {
    res.render('./trades/new.ejs');

};

exports.create = (req, res,next) => {

  let item = req.body;
   item.itemImage='/images/baseball1.jpeg';
   item.trader=req.session.user;  
   item.status="available";

  model.findOneAndUpdate({categoryName:item.categoryName},{$push:{items:item}},{runValidators: true,upsert:true})
  .then(trade=>{
    req.flash('success','New trade succesfully created');
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

  console.log("you wanted to delete item id is",id);
  
  console.log("offfered id is",req.body.offeredItem=="");

  console.log("initiated item is",req.body.initiatedItem=="");

  // res.redirect('/users/profile');
  if(!req.body.initiatedItem && !req.body.offeredItem)
  {
    model.findOneAndUpdate(
      { "items._id":id },
      { $pull:{"items":{"_id":id}}})
      .then(trade=>{
        if(trade)
        {
           console.log("in single delete");
           req.flash('success',' trade succesfully deleted');
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
  else if(req.body.initiatedItem=="")
  {
    Promise.all([ model.findOneAndUpdate({"items._id":req.body.offeredItem}, {  $set:{
      'items.$.status':"available"},$unset:{  'items.$.initiatedOffer':""}}),  model.findOneAndUpdate(
        { "items._id":id },
        { $pull:{"items":{"_id":id}}})])
      .then(results=>{
          const[OtherTrade,trade]=results;
          if(trade)
          {
             console.log("in initiated delete");
             req.flash('success',' trade succesfully deleted');
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
  else if(req.body.offeredItem=="")
  {
    Promise.all([ model.findOneAndUpdate({"items._id":req.body.initiatedItem}, {  $set:{
      'items.$.status':"available"},$unset:{  'items.$.offer':""}}),  model.findOneAndUpdate(
        { "items._id":id },
        { $pull:{"items":{"_id":id}}})])
      .then(results=>{
          const[OtherTrade,trade]=results;
          if(trade)
          {
             console.log("in manage delete");
             req.flash('success',' trade succesfully deleted');
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




}



exports.edit = (request, response, next) => {
  let id = request.params.id;

  // if(!id.match(/^[0-9a-fA-F]{24}$/))
  //   {
  //       let err=new Error('Invalid trade id');
  //       err.status=400;
  //       return next(err);
  //   }

 
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
  
  // if(!id.match(/^[0-9a-fA-F]{24}$/))
  //   {
  //       let err=new Error('Invalid trade id');
  //       err.status=400;
  //       return next(err);
  //   }
  model.findOneAndUpdate(
    { "items._id":id },
    { $set: { 'items.$.itemName': req.body.itemName,
    'items.$.itemDescription':req.body.itemDescription},'categoryName':req.body.categoryName}, {runValidators: true,upsert:true} )
    .then(item=>{
      if(item)
      {
            console.log(item);
            req.flash('success',' trade succesfully edited');
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


exports.watchTrade=(req,res,next)=>{


  let id = req.params.id;
  console.log(req.body.itemName)
  watchModel.findOneAndUpdate({"user":req.session.user},{$push:{watchedTrades:{trade_item:id,trade_title:req.body.itemName}}},{upsert:true})
  .then(item=>{
    // if(item)
    // {
    //   console.log("item is",item);
    //    res.redirect('/users/profile')
    // }
    // else
    // {
    //   console.log("item is",item);
    //   let err = new Error('Cannot find a item with id ' + id);
    //   err.status = 404;
    //    next(err);
    // }
    res.redirect('/users/profile')
  })
  .catch(err=>next(err));
}

exports.unwatchTrade=(req,res,next)=>
{

  id=req.params.id;
  watchModel.findOneAndUpdate(
    { "watchedTrades.trade_item":id },
    { $pull:{"watchedTrades":{"trade_item":id}}})
    .then(trade=>{
      if(trade)
      {
         // console.log(trade);
         req.flash('success',' trade successfully unwatched');
        return  res.redirect('/users/profile');

      }
      else
      { 
          let err = new Error('Cannot find a item with id ' + id);
          err.status = 404;
           next(err);

      }})
      .catch(err=>next(err));

}

exports.offer=(req,res,next)=>{

  let id=req.session.user;

//  model.aggregate([ { $unwind :  '$items' },{$match : { "items.trader" :ObjectId(id),"items.status":"available"}}])

let trade_id=req.params.id;

  //model.findOne({"items._id":trade_id},{items:{$elemMatch:{_id:trade_id}}})

  Promise.all([model.findOne({"items._id":trade_id},{items:{$elemMatch:{_id:trade_id}}}), model.aggregate( [{ $unwind :  '$items' },{$match : { "items.trader" :ObjectId(id),"items.status":"available"}}]) ])
.then(results=>{

  const[current_trade,userAvailableTrades]=results;
 
  console.log(current_trade);

  res.render('./trades/offer', {current_trade,userAvailableTrades})


})
.catch(err=>next(err));


}


exports.processTrade=(req,res,next)=>{

  let id=req.params.id;

  let initiatedId=req.body.trade_request_id;

  let initiatedTradeOwner= req.body.trade_request_owner;

  let offer={
    offeredByUser:initiatedTradeOwner,
    offeredAgainst:initiatedId
  }

 console.log("first request is",offer);
  //Promise.all([model.findOne({"items._id":id},{items:{$elemMatch:{_id:id}}})])

Promise.all([model.findOneAndUpdate(
  {"items._id":initiatedId},
  {$set:{
    'items.$.status':"pending",
    'items.$.initiatedOffer.tradeStartedBy':req.session.user,
    'items.$.initiatedOffer.tradeOffer':id,
  }}
),
model.findOneAndUpdate(
  { "items._id":id },
  { $set: { 'items.$.status': "pending",
  'items.$.offer.offeredByUser':initiatedTradeOwner,'items.$.offer.offeredAgainst':initiatedId}} )
])
.then(results=>{
  const [initiatedTrade,offeredTrade] =results;

  console.log("initiated trade is",initiatedTrade);
  console.log("offered trade is",offeredTrade);
  return res.redirect('/users/profile');

})
.catch(err=>{
  next(err);
}
  )

}