const e = require('express');
const model = require('../models/item')


exports.index = (req, res) => {
  let trades = model.getTrades();
  res.render('./trades/index.ejs', { trades: trades });
}

exports.getTrade = (req, res) => {

  let id = req.params.id;
  let item = model.getTrade(id);

  if (item) {
    res.render('./trades/show.ejs', { item: item });


  }
  else {

    let err = new Error('Cannot find item with id ' + id);
    err.status = 404;
    next(err);

  }
}

exports.new = (req, res) => {

  //  res.send('send the new form');
    res.render('./trades/new.ejs');

};

exports.create = (req, res) => {

  let item = req.body;
  model.createTrade(item);
  res.redirect('/trades');
}

exports.delete = (req, res) => {
  let id = req.params.id;
  if (model.deleteById(id)) {
    res.redirect('/trades');

  }
     else{
      let err=new Error('Cannot find story with id '+ id);
      err.status=404;
      next(err);
     }

}



exports.edit = (request, response, next) => {
  let id = request.params.id;
  let category = model.getCategory(id);
  if(category)
  {
    let item = model.getTrade(id);

    if (item) {
      item.categoryName = category.categoryName;
      response.render('./trades/edit.ejs', { item: item });
      //console.log("please edit a item with id" + item.itemId);
    }
  }
  else{
    let err=new Error('Cannot find story with id '+ id);
    err.status=404;
    next(err);
}
 
};

exports.update = (req, res) => {

  let id = req.params.id;
  let item = req.body;
  if (model.updateById(id, item)) {
   // console.log(item);
    res.redirect('/trades/' + id);

  }
  else{
   let err=new Error('Cannot find story with id '+ id);
   err.status=404;
   next(err);
  }

}