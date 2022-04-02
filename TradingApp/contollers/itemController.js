const e = require('express');
const model = require('../models/item')


exports.index = (req, res) => {
 // let trades = model.getTrades();
  model.find()
  .then(trades=>res.render('./trades/index.ejs', { trades: trades }))
  .catch(err=>next(err));
  //res.render('./trades/index.ejs', { trades: trades });
}

exports.getTrade = (req, res) => {

  let id = req.params.id;
  if(!id.match(/^[0-9a-fA-F]{24}$/))
  {
      let err=new Error('Invalid story id');
      err.status=400;
      return next(err);
  }

  model.findOne({"items._id":id})
  .then(item=>{
          if(item)
          {
            console.log(item);
              return res.render('./trades/show.ejs',{item:item.items[0]});
          }
          else
          {
              let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                console.log("not found");
              next(err); 
          }
  })
  .catch(err=>next(err));
  // let item = model.getTrade(id);

  // if (item) {
  //   res.render('./trades/show.ejs', { item: item });


  // }
  // else {

  //   let err = new Error('Cannot find item with id ' + id);
  //   err.status = 404;
  //   next(err);

  // }
  //results: { $elemMatch: { product: "xyz" } }
}

exports.new = (req, res) => {

  //  res.send('send the new form');
    res.render('./trades/new.ejs');

};

exports.create = (req, res) => {

  let item = req.body;
   item.itemImage='/images/baseball1.jpeg';

  model.findOneAndUpdate({categoryName:item.categoryName},{$push:{items:item}},{upsert:true})
  .then(trade=>{
    if(item)
    {
     // console.log(item);
        return res.redirect('/trades');
    }
    else
    {
        let err = new Error('Cannot find a story with id ' + id);
          err.status = 404;
          console.log("not found");
        next(err); 
    } })
  .catch(err=>{
      next(err);
  });



    // if (model.deleteById(id)) {
  //   res.redirect('/trades');

  // }
  //    else{
  //     let err=new Error('Cannot find story with id '+ id);
  //     err.status=404;
  //     next(err);
  //    }
}

exports.delete = (req, res,next) => {
  let id = req.params.id;
  if(!id.match(/^[0-9a-fA-F]{24}$/))
  {
      let err=new Error('Invalid story id');
      err.status=400;
      return next(err);
  }
     model.findOneAndUpdate(
      { "items._id":id },
      { $pull:{"items":{"_id":id}}})
      .then(trade=>{
        if(trade)
        {
            console.log(trade);
          return  res.redirect('/trades');
  
        }
        else
        { 
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
             next(err);
  
        }})
        .catch(err=>next(err));


          // if (model.deleteById(id)) {
  //   res.redirect('/trades');

  // }
  //    else{
  //     let err=new Error('Cannot find story with id '+ id);
  //     err.status=404;
  //     next(err);
  //    }

}



exports.edit = (request, response, next) => {
  let id = request.params.id;

  
  model.findOne({"items._id":id})
  .then(item=>{
          if(item)
          {
            console.log(item.items[0]);
              return response.render('./trades/edit.ejs',{item:item.items[0]});
          }
          else
          {
              let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                console.log("not found");
              next(err); 
          }
  })
  .catch(err=>next(err));

  //   let category = model.getCategory(id);
//   if(category)
//   {
//     let item = model.getTrade(id);

//     if (item) {
//       item.categoryName = category.categoryName;
//       response.render('./trades/edit.ejs', { item: item });
//       //console.log("please edit a item with id" + item.itemId);
//     }
//   }
//   else{
//     let err=new Error('Cannot find story with id '+ id);
//     err.status=404;
//     next(err);
// }






};

exports.update = (req, res) => {

  let id = req.params.id;
  model.findOneAndUpdate(
    { "items._id":id },
    { $set: { 'items.$.itemName': req.body.itemName,
    'items.$.itemDescription':req.body.itemDescription},'categoryName':req.body.categoryName}, {upsert:true} )
    .then(story=>{
      if(story)
      {
          console.log(story);
            res.redirect('/trades/'+id);

      }
      else
      { 
          let err = new Error('Cannot find a story with id ' + id);
          err.status = 404;
           next(err);

      }})
      .catch(err=>next(err));




        // let item = req.body;
  // if (model.updateById(id, item)) {
  //  // console.log(item);
  //   res.redirect('/trades/' + id);

  // }
  // else{
  //  let err=new Error('Cannot find story with id '+ id);
  //  err.status=404;
  //  next(err);
  // }

}