const apiKeyvalue = new Ruta();
const keyvalue = require('../class/objects/keyvalue.js');
const keyvalueObj = new keyvalue();

apiKeyvalue.get('/',(req, res)=>{
    (async() => {
        try {
            let todos = await keyvalueObj.getAll();
            res.status(200);
            res.json(todos);
        } catch (error) {
            res.status(500);
            res.json({ status : 500, errorMessagge: "A fatal error ocurred"});
        }
        
      })();
})

apiKeyvalue.get('/:key',(req, res)=>{
    (async() => {
        try {
            let buscado = await keyvalueObj.getCustom([{fieldName: 'key', value: req.params.key}],1);
            if(buscado[0]){
                res.status(200);
                res.json({value:buscado[0].value});
            }else{
                res.status(404);
                res.json({ status : 404, errorMessagge: "Key not found"});
            }
        } catch (error) {
            res.status(500);
            res.json({ status : 500, errorMessagge: "A fatal error ocurred"});
        }
      })();
})

module.exports = apiKeyvalue;