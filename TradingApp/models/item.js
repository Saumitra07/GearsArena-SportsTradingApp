const e = require('express');

const mongoose=require('mongoose');


const Schema=mongoose.Schema;



const tradeSchema=new Schema({
    categoryName:{type:String,required:[true,'categoryName is required']},
    items: {
        type: [{
            itemName:{type:String,required:[true,'itemName is required']},
            trader: {type: Schema.Types.ObjectId,ref:'User'},
            itemDescription:{type:String,required:[true,'itemName is required']},
            itemImage:{type:String,required:[true,'itemImage is required']},
            createdAt:{type:Date,default:Date.now}
        },{timestamps:true}],
        default: undefined
      }
},{timestamps:true});



module.exports=mongoose.model('Trade',tradeSchema);
