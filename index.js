const express = require('express')
const app = express();
const PORT = 8001;
const urlRoute = require('./routes/url');
const {connectToMongoDb} = require('./connect');
const URL = require('./models/url')
const nodemon = require('nodemon');
const path = require('path');
const staticRoute = require('./routes/staticRoute');
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser');
const {restrictToLoggedInUsersOnly} = require('./middleware/auth')


connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(()=>{
    console.log('MongoDB Connected');
    
})
.catch((err)=>{
    console.log('Error connecting database',err);
    
})
//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//Register of routes
app.use('/url',restrictToLoggedInUsersOnly,urlRoute);
app.use('/',staticRoute);
app.use('/user',userRoute);


// To track and update VisitHistory
app.get('/url/:shortId', async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({shortId},
        {
            $push:{
                visitHistory:{
                    timestamp:Date.now()
                }
            }
        }
    );
    res.redirect(entry.redirectUrl);
})


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get('/test', async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls:allUrls
    })
})

app.listen(PORT,()=>{
    console.log(`Server started at port : ${PORT}`);
    
})
