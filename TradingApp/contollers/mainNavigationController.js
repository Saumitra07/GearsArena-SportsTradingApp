const e = require('express');



exports.goToHome=(req,res)=>
{
    res.render('index.ejs');

}

exports.about=(req,res)=>
{
    res.render('about');
}


exports.contact=(req,res)=>
{
    res.render('contact');
}


