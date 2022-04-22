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