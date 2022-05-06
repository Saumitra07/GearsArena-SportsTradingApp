const e = require('express');

const mongoose=require('mongoose');


const Schema=mongoose.Schema;


const watchSchema=new Schema({
    user:{type: Schema.Types.ObjectId,ref:'User'},
    watchedTrades: {
        type: [{
           
            trade_item: {type: Schema.Types.ObjectId},
            trade_title:{type:String}
           
        },{timestamps:true}],
        default: undefined
      }
},{timestamps:true});


// const watchSchema=new Schema({
//     user:{type: Schema.Types.ObjectId,ref:'User'},
//     watchedTrades:[ Schema.Types.ObjectId]

// })


module.exports=mongoose.model('Watch',watchSchema);
