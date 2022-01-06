const usersRoute = new Ruta();
const users = require('../class/objects/users.js');
const usersObj = new users();
const {checkLogin,checklvl} = require('../config.js');
const levelSecurity = 3;

usersRoute.get('/list', checkLogin(), checklvl(levelSecurity), (req, res) => {
    (async() => {
        try{
            let all = await usersObj.getAll();
            all = all.reduce((memo, value) => value.hidenUser != 1 ? memo.concat(value) : memo, [])
            let haveUsers = (all.length>0)?true:false;
            res.render('users_list.hbs',{listUsers: all, haveUsers: haveUsers,user:req.user});
        } catch (err) {
            console.log(err);
            res.render('error.hbs',{});
        }
      })();
})

usersRoute.get('/form', checkLogin(), checklvl(levelSecurity), (req, res) => {
        res.render('users_form.hbs',{user:req.user});
})

usersRoute.get('/form/:id', checkLogin(), checklvl(levelSecurity), (req, res) => {
    (async() => {
        let buscado = await usersObj.getById(req.params.id);
        if(buscado){
            res.render('users_form.hbs',{userB: buscado, user:req.user,showDots: true});
        }else{
            console.log(`there is no key/value with the id ${req.params.id}`);
            res.redirect('/users/list');
        }
    })();
})

usersRoute.post('/form',(req, res)=>{ 
    if (req.user && req.user.lvlUser>=3) {
        (async() => {
            let checkHidden = req.body.id ? await usersObj.getById(req.body.id) : null;
            if(!checkHidden || checkHidden.hidenUser != 1 ){
                let result = await usersObj.saveUser(req.body);
                if(result.status =='ok'){
                    res.status(200);
                    res.json({ status : 200});
                }else{
                    res.status(400);
                    res.json({ status : 400, errorMessagge: result.result});
                }
            }else{
                res.status(401);
                res.json({ status : 401, errorMessagge: "unauthorized"});
            }
        })();
    } else {
        res.status(401);
        res.json({ status : 401, errorMessagge: "unauthorized"});
    } 
})

usersRoute.delete('/form',(req, res)=>{ 
    if (req.user && req.user.lvlUser>=3) {
        (async() => {
            let checkHidden = await usersObj.getById(req.body.id);
            if(!checkHidden || checkHidden.hidenUser != 1 ){
                let result = await usersObj.deleteById(req.body.id);
                if(result){
                    res.status(200);
                    res.json({ status : 200});
                }else{
                    res.status(400);
                    res.json({ status : 400, errorMessagge: "an error occurred when try to delete the user"});
                }
            }else{
                res.status(401);
                res.json({ status : 401, errorMessagge: "unauthorized"});
            }
        })();
    } else {
        res.status(401);
        res.json({ status : 401, errorMessagge: "unauthorized"});
    } 
})


module.exports = usersRoute;