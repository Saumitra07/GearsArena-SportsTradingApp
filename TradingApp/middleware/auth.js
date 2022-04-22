const Trade = require('../models/item')
const ObjectId = require('mongodb').ObjectId;


exports.isGuest = (req, res, next) => {

    if (!req.session.user)
        return next();
    else {
        req.flash('error', 'You are currently logged in');
        return res.redirect('/users/profile')
    }

}


exports.isAuthenticated = (req, res, next) => {

    if (req.session.user) {
        return next();
    }

    else {
        req.flash('error', 'You are not logged in, please login.');
        return res.redirect('/users/login');
    }

}

exports.isTrader = (req, res, next) => {
    let id = req.params.id;

    Trade.find({ 'items._id': id }, { 'items': { $elemMatch: { _id: id } } })
        .then(item => {
           console.log(JSON.stringify(item));
            if (item) {
                if (item[0].items[0].trader == req.session.user) {
                    return next();
                }
                else {
                    let err=new Error('Unauthorized to access this resource');
                    err.status=401;
                    return next(err);      
                }
            }
            else {

                    console.log("Hi from error");

                           let err=new Error('Unauthorized to access this resource');
                           err.status=401;
                           return next(err);      

            }

        //    console.log("item is",item.items.trader);

        })
        .catch(err => next(err));

    // Story.findById(id)
    // .then(story=>{

    //     if(story)
    //     {
    //         if(story.author==req.session.user)
    //         {
    //            return next();
    //         }
    //         else
    //         {
    //            let err=new Error('Unauthorized to access this resource');
    //            err.status=401;
    //            return next(err);
    //         }
    //     }


    // })
    // .catch(err=>next(err))

}