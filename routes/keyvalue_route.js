const keyvalueRoute = new Ruta();
const keyvalue = require('../class/objects/keyvalue.js')
const keyvalueObj = new keyvalue();
const {checkLogin,checklvl} = require('../config.js');
const levelSecurity = 2;

keyvalueRoute.get('/list', checkLogin(), (req, res) => {
    (async() => {
        try {
            let all = await keyvalueObj.getAll();
            let haveKeyvalue = (all.length>0)?true:false;
            res.render('keyvalue_list.hbs',{listKeyvalue: all, haveKeyvalue: haveKeyvalue,user:req.user});
        } catch (err) {
            console.log(err);
            res.render('error.hbs',{});
        }
        
      })();
})

keyvalueRoute.get('/form', checkLogin(), checklvl(levelSecurity), (req, res) => {
        res.render('keyvalue_form.hbs',{user:req.user});
})

keyvalueRoute.get('/form/:id', checkLogin(), checklvl(levelSecurity), (req, res) => {
    (async() => {
        let buscado = await keyvalueObj.getById(req.params.id);
        if(buscado){
            res.render('keyvalue_form.hbs',{keyvalue: buscado, user:req.user});
        }else{
            console.log(`there is no key/value with the id ${req.params.id}`);
            res.redirect('/keyvalue/list');
        }
    })();
})

module.exports = keyvalueRoute;