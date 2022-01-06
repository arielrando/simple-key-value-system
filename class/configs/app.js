
const path = require('path');
const express = require('express');
const session = require('express-session');
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const passport = require('passport');
require('./passport.js')(passport);
const {DBdefault,optionsSqlite3} = require('../../config.js');
const keyvalue = require('../objects/keyvalue.js');
const keyvalueObj = new keyvalue();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'../../public')));

const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: path.join(__dirname,"../../views/layouts"),
    partialsDir:path.join(__dirname,"../../views/partials/"),
    helpers:{
        lvlUser: function(v1, v2, options) {
            if(v1 >= v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        equal: function(v1, v2, options) {
            if(v1 == v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});

app.engine("hbs",hbs.engine);

let sessionsConfig = {};
switch (DBdefault) {
    case 'sqlite3':
      const KnexSessionStore = require('connect-session-knex')(session);
      let knex = require('knex');
      sessionsConfig = new KnexSessionStore({
        knex: knex(optionsSqlite3)
      })
    break;
    case 'firebase':
        const firebaseAdmin = require("firebase-admin");
        let {optionsFirebase} = require('../../config.js');
        if (!firebaseAdmin.apps.length) {
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(optionsFirebase.conexion)
            });
         }else {
            firebaseAdmin.app(); 
         }
         const FirestoreStore = require("firestore-store")(session);
         sessionsConfig =new FirestoreStore({
            database: firebaseAdmin.firestore()
        })
    break;
    default:
        const DefaultStore = require('connect-session-knex')(session);
        let Defaultknex = require('knex');
        sessionsConfig = new DefaultStore({
          knex: Defaultknex(optionsSqlite3)
        })
    break;
}

app.use(session({
    store: sessionsConfig,
    secret: 'mediamonks',
    resave: false,
    rolling: true,
    saveUninitialized: false ,
    cookie: {
        maxAge: 60000*60
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',passport.authenticate('login', { failureRedirect: 'failLogin' }),(req, res)=>{
    res.redirect(`/home`);
});

io.on('connection', (socket) => {
    function changeKeyvalue(id, deleteKeyvalue = false){
        (async() => {
            if(!deleteKeyvalue){
                let search = await keyvalueObj.getById(id);
                io.sockets.emit('changeKeyvalue', JSON.stringify({keyvalue:search}));
            }else{
                io.sockets.emit('changeKeyvalue', JSON.stringify({id:id, deleteKeyvalue:true}));
            }
          })();
    }

    socket.on('saveKeyvalue', data => {
        (async() => {
            data = JSON.parse(data);
            let result = await keyvalueObj.saveKeyvalue(data);
            if(result.status =='ok'){
                socket.emit('saveKeyvalueSuccess',JSON.stringify(result.result));
                changeKeyvalue(result.result);
            }else{
                socket.emit('saveKeyvalueFail',result.result);
            }
          })();
    })

    socket.on('deleteKeyvalue', data => {
        (async() => {
            data = JSON.parse(data)
            let result = await keyvalueObj.deleteById(data.id);
            if(result){
                socket.emit('deleteKeyvalueSuccess');
                changeKeyvalue(result.result, true);
            }else{
                socket.emit('deleteKeyvalueFail');
            }
          })();
    })
});

module.exports = {
    app,
    httpServer,
    io
};