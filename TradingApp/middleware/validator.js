

const { body } = require('express-validator');
const {validationResult}=require('express-validator')
exports.validateId=(req,res,next)=>{
    if(!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid trade id');
        err.status = 400;
        return next(err);
    }
    
    else
    {
        return next();
    }


}




exports.validateSignUp=[body('firstName','first name can not be empty').notEmpty().trim().escape(),
body('lastName','last name can not be empty').notEmpty().trim().escape(),
body('email','email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','email must be min 8 chars and max 64 chars').isLength({min:8,max:64})];

exports.validateLogin=[body('email','email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','email must be min 8 chars and max 64 chars').isLength({min:8,max:64})];



exports.validateItem=[body('categoryName','category should not be empty').notEmpty().trim().escape(),
body('itemName','item name should be empty').notEmpty().trim().escape(),
body('itemDescription','item description should be min of 10 characters').isLength({min:10}).trim().escape()];


exports.validateResult=(req,res,next)=>{
let errors=validationResult(req);
if(!errors.isEmpty())
{
    errors.array().forEach(error=>{

        req.flash('error', error.msg);    

    });
    return res.redirect('back');
}
else
{
        return next();
}
}

