require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');


//database connection
const url = 'mongodb://localhost/burger';
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',()=> {
    console.log('Database connected');
}).catch(err=> {
    console.log('Connection failed');
})

//Session Store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
         mongoUrl: 'mongodb://localhost/burger'
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}//24 hours
  
}))

app.use(flash())

//Assests
app.use(express.static('public'))
app.use(express.json());
app.use((req,res,next)=>{
    res.locals.session = req.session
    next()

})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routes location
require('./routes/web')(app)


app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
})


