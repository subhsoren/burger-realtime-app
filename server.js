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
const passport = require('passport');
const Emitter = require('events');


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
//Event EMitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


//passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//Assests
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()

})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//routes location
require('./routes/web')(app)


const server = app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
})


//socket
const io = require('socket.io')(server);
io.on('connection', (socket)=> {
    //join
    console.log(socket.id)
    socket.on('join',(orderId)=> {
        console.log(orderId); 
        socket.join(orderId)

    })

})
eventEmitter.on('orderUpdated',(data)=> {
    io.to(`order_${data.id}`).emit('orderUpdated',data)

})

eventEmitter.on('orderPlaced', ()=> {
    io.to('adminRoom').emit('orderPlaced',data)
})