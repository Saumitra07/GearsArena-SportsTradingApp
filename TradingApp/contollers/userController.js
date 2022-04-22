const model = require('../models/user');
const User=require('../models/user');

const flash=require('connect-flash');
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
    user.save()
    .then(()=>res.redirect('/users/login'))
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
    let email=req.body.email;
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
    // console.log(req.flash());
    console.log("logged in user is",id);
    User.findById(id)
    .then(user=>
        {
            console.log("user details are",user);
            res.render('./user/profile',{user})
        }
        )
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