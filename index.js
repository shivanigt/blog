const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const app=express();
const port= 8005;
// set layout
const ejsLayout=require('express-ejs-layouts');

// set database and model
const db=require('./config/mongoose')
// user for session cookies
const session = require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local');

// not use the session beacause update is are and goto session part on this page
const MongoStore=require('connect-mongo');
const model=require('./models/user');

// setting sass
const sassMiddleware=require('node-sass-middleware');

app.use(sassMiddleware({
    src:'./assests/scss',
    dest:'./assests/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}))


// app.use(express.urlencoded());

app.use(cookieParser())

app.use(express.static('./assests'));

// make the upload path avialable to browser avatar
app.use('/uploads',express.static(__dirname +'/uploads'));

// use layout
app.use(ejsLayout);

// extract style and script for differnt sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// main is routing and use
const router=require('./routes/index')

app.use(bodyParser.urlencoded({extended:false}));


// set engine
app.set('view engine','ejs');
app.set('views','./views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name:'Codial',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    // remove new and add .create and mongoURL
    store:MongoStore.create(
        {
            // mongoUrl add and locate the path from mongoose.js
            mongoUrl:'mongodb://127.0.0.1:27017/blog',
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok')
        }
        
    )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/',router);



app.listen(port,function(err){
    if(err){
        console.log(`error in routing ${err}`)
        return;
    }
    console.log(`server is running on port ${port}`);
});
