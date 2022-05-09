const model = require('../models/user');
const User=require('../models/user');
const ObjectId = require('mongodb').ObjectId;

const watchModel=require('../models/watch');
const Trade=require('../models/item');

const flash=require('connect-flash');
const { json } = require('express');
exports.index=(req,res,next)=>{

    res.render('index');
}

exports.new=(req,res,next)=>{

    res.render('./user/new');
}

exports.login=(req,res,next)=>{

    res.render('./user/login');
}

exports.profile=(req,res,next)=>{

    res.render('./user/profile');
}

exports.signup=(req,res,next)=>{

    let user=new User(req.body);
    if(user.email)
    {
        user.email=user.email.toLowerCase();
    }
    user.save()
    .then(()=>{
        req.flash('success','new user succesfully created');
        res.redirect('/users/login')
    })
    .catch(err=>
        {
            console.log(err);
                if(err.name==='ValidationError')
                {
                    req.flash('error',err.message);
                    return res.redirect('/users/new');
                }
                else if(err.code===11000)
                {
                    req.flash('error','Email address already in use');
                    return res.redirect('/users/new');
                }

                next(err);
                

        });
}

exports.loginUser=(req,res,next)=>
{
    let email = req.body.email;
    if(email)
        email=email.toLowerCase();
    let password=req.body.password;

    User.findOne({email:email})
    .then(user=>{
        if(user)
        {

            user.comparePassword(password).
            then(result=>{
                if(result)
                {
                   //   console.log('Success');
                        req.session.user=user._id;
                        req.flash('success','You have successfully logged in');
                        res.redirect('/users/profile')
                }
                else
                {
                  //  console.log('wrong password');
                     req.flash('error','wrong password')
                    res.redirect('/users/login');
                }
            })
            .catch(err=>next(err));



        }
        else
        {
                //console.log('wrong email address');
                req.flash('error','wrong email')
                res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
}


exports.profile=(req,res,next)=>{
    let id=req.session.user;
   
    console.log("logged in user is",id);

    
 
    
    Promise.all([User.findById(id),Trade.aggregate([ { $unwind :  '$items' },{$match : { "items.trader" :ObjectId(id)}}]),
        watchModel.findOne({user:req.session.user})  ,
        Trade.aggregate([ { $unwind :  '$items' },{$match : { "items.initiatedOffer.tradeStartedBy" :ObjectId(req.session.user)}}])
        
            ]) 
    .then(results=>{

        const[user,trades,watchedItems,yourRequestedTrades]=results;
       
        res.render('./user/profile', {user,trades,watchedItems,yourRequestedTrades})
    
    
    })
    .catch(err=>next(err));



}


exports.cancelInitiatedTrade=(req,res,next)=>{

    let offeredItemId=req.body.offeredItemId;

    console.log("offered item id is",offeredItemId);

    let initiatedTradeId=req.params.id;
    Promise.all([Trade.findOneAndUpdate(
        {"items._id":initiatedTradeId},
      {  $set:{
            'items.$.status':"available"
        },
        $unset:{
            'items.$.initiatedOffer':""
        }}
      ),
      Trade.findOneAndUpdate(
        { "items._id":offeredItemId },
        { $set: { 

            'items.$.status':"available"
        },
        
            $unset:{
                'items.$.offer':""
            }
        } )
      ])
      .then(result=>{
            
            const [initiatedCancelTrade, offeredCancelTrade]=result;

            // console.log("initiated trade cancel",initiatedCancelTrade);
            
            // console.log("offered trade cancel",offeredCancelTrade);

            req.flash('success',"trade successfully canceled");

            return res.redirect('/users/profile');
      })
      .catch(err=>next(err));


}

exports.manageTrade=(req,res,next)=>{

    let offeredId=req.params.id;
    let requestedItem=req.query.requestedItem;
    console.log("requested item is",requestedItem)

    Promise.all([ Trade.findOne( {"items._id":offeredId},{items:{$elemMatch:{_id:offeredId}}}),
    Trade.findOne( {"items._id":requestedItem},{items:{$elemMatch:{_id:requestedItem}}})])

   .then(
        result=>{
            const [offeredTrade,requestedTrade]=result;
            console.log("offered Trade is",offeredTrade );
            console.log("requested trade is",requestedTrade)
            res.render('./user/manage',{offeredTrade,requestedTrade,result})
        }
    )
    .catch(err=>next(err));
    

   

}

exports.responseToOffer=(req,res,next)=>{
    let offeredId=req.params.id;
    let requestedItem=req.query.requestedItem;
    console.log("requested item is",requestedItem)

    Promise.all([ Trade.findOne( {"items._id":offeredId},{items:{$elemMatch:{_id:offeredId}}}),
    Trade.findOne( {"items._id":requestedItem},{items:{$elemMatch:{_id:requestedItem}}})])

   .then(
        result=>{
            const [offeredTrade,requestedTrade]=result;
            console.log("offered Trade is",offeredTrade );
            console.log("requested trade is",requestedTrade)
            res.render('./user/respondOffer',{offeredTrade,requestedTrade,result})
        }
    )
    .catch(err=>next(err));

}


exports.acceptTrade=(req,res,next)=>{
    let offeredItemId=req.body.offeredItemId;

    console.log("offered item id is",offeredItemId);

    let initiatedTradeId=req.params.id;

    
    Promise.all([Trade.findOneAndUpdate(
        {"items._id":initiatedTradeId},
      {  $set:{
            'items.$.status':"Traded"
        },
        $unset:{
            'items.$.initiatedOffer':""
        }}
      ),
      Trade.findOneAndUpdate(
        { "items._id":offeredItemId },
        { $set: { 

            'items.$.status':"Traded"
        },
        
            $unset:{
                'items.$.offer':""
            }
        } )
      ])
      .then(result=>{
            
            const [initiatedCancelTrade, offeredCancelTrade]=result;

            // console.log("initiated trade cancel",initiatedCancelTrade);
            
            // console.log("offered trade cancel",offeredCancelTrade);
            req.flash('success',"trade successfully accepted");

            return res.redirect('/users/profile');
      })
      .catch(err=>next(err));


}



exports.logout=(req,res,next)=>{
    req.session.destroy(err=>{
        if(err)
            next(err);
        else
            res.redirect('/users/login');
    })
}