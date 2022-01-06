const indexView = new Ruta();
const {checkLogin} = require('../config.js');

indexView.get('/',(req, res) => {
    res.redirect(`/login`);
})

indexView.get('/login',(req, res) => {
    if(!req.user){
        res.render('login.hbs',{});
    }else{
        res.redirect(`/home`);
    }
})

indexView.get('/home', checkLogin(), (req, res) => {
        res.render('home.hbs',{user:req.user});
})

indexView.get('/logout', (req, res) => {
    if (req.user) {
        let usuario = req.user;
        req.logout();
        res.render('logout.hbs',{usuario: usuario});
    }else{
        res.redirect(`/login`);
    }
    
})

indexView.get('/failLogin',(req, res) => {
    res.render('failLogin.hbs',{});
})

module.exports = indexView;