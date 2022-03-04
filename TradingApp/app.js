
//require modules
const express=require('express');

const morgan=require('morgan');

// const storyRoutes=require('./routes/storyRoutes');

var methodOverride = require('method-override')


const mainRoutes=require('./routes/mainRoutes');
const tradeRoutes=require('./routes/TradeRoutes')

//create app
const app=express();


//configure app

let port=3000;

let host='localhost';

app.set('view engine','ejs');


//mount middleware
app.use(methodOverride('_method'))
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use('/trades',tradeRoutes);

app.use('/',mainRoutes);

//set up routes
// app.get('/',(req,res)=>{

//     res.render('index');
// })



app.use((req,res,next)=>{
    let err=new Error('The server cannot locate'+ req.url);
    err.status=404;
    next(err);
  
})

app.use((err,req,res,next)=>{
    if(!err.status)
    {
        err.status=500;
        err.message=("Internal Server Error");


    }
   
    res.status(err.status);
    res.render('error',{error:err});
})


//start the server

app.listen(port,host,()=>{

console.log("server running on",port);
});
