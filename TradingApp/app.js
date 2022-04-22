
//require modules
const express=require('express');

const morgan=require('morgan');

// const storyRoutes=require('./routes/storyRoutes');

const mongoose=require('mongoose');
var methodOverride = require('method-override')


const mainRoutes=require('./routes/mainRoutes');
const tradeRoutes=require('./routes/TradeRoutes')
const userRoutes=require('./routes/userRoutes');
const session=require('express-session')
const flash=require('connect-flash');
const MongoStore=require('connect-mongo');
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


app.use(session({
    secret:'lohfowhfwehfoih',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:60*60*1000},
    store:new MongoStore({mongoUrl:'mongodb://localhost:27017/trade_sports'})
}))

app.use(flash());
app.use((req,res,next)=>{
    console.log(req.session);
    res.locals.successMessages=req.flash('success');
    res.locals.errorMessages=req.flash('error');
    
    next();
})

//set up routes
// app.get('/',(req,res)=>{

//     res.render('index');
// })

app.use('/trades',tradeRoutes);

app.use('/',mainRoutes);

app.use('/users',userRoutes);

//connect to database

mongoose.connect('mongodb://localhost:27017/trade_sports',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
       // console.log("db connected");
    });

})
.catch(
err=>console.log(err));



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

// app.listen(port,host,()=>{

// console.log("server running on",port);
// });
