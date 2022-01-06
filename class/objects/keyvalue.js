const generalDao = require('../daos/generalDao.js');
const {DBdefault} = require('../../config.js');

module.exports = class KeyValue extends generalDao {
    constructor(){
        switch (DBdefault) {
            case 'firebase':
                super('keyvalue');
            break;
            case 'sqlite3':
                super('keyvalue');
            break;
            default:
                super('keyvalue');
            break;
        }
    }

    async saveKeyvalue(data){
        try {
            let safeKey = await this.getCustom([{fieldName: 'key', value: data.key}],1);
            if(!data.id){
                if(!safeKey[0]){
                    let result = await this.save({key:data.key, value: data.value});
                    if(result){
                       return {status:'ok', result: result}; 
                    }else{
                        return {status:'fail', result: 'an error occurred while trying to save the Key/Value'}; 
                    }
                }else{
                    return {status:'fail', result:`already exists the key '${data.key}', try another different`};
                }
            }else{
                let search = await this.getById(data.id);
                if(search){
                    if(!safeKey[0] || safeKey[0].id == data.id){
                        let result = await this.editById(data.id,data);
                        if(result){
                            return {status:'ok', result: result.id}; 
                         }else{
                            return {status:'fail', result: 'an error occurred while trying to modify the Key/Value'}; 
                         }
                    }else{
                        return {status:'fail', result:`already exists the key '${data.key}', try another different`};
                    }
                }else{
                    return {status:'fail', result:`there is no key/value with the id ${data.id}`};
                }
            }
        } catch (err) {
            console.log(`an error occurred: ${err}`);
            return {status:'fail'}; 
        }
    }
}
