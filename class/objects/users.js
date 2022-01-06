const generalDao = require('../daos/generalDao.js');
const {DBdefault} = require('../../config.js');
const bCrypt = require('bcrypt');

module.exports = class Users extends generalDao {
    constructor(){
        switch (DBdefault) {
            case 'firebase':
                super('users');
            break;
            case 'sqlite3':
                super('users');
            break;
            default:
                super('users');
            break;
        }
    }

    createHash(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
      } 

    async saveUser(data){
        try {
            let safeKey = await this.getCustom([{fieldName: 'username', value: data.username}],1);
            if(!data.id){
                if(!safeKey[0]){
                    let result = await this.save({username:data.username, password: this.createHash(data.password), lvlUser: data.lvlUser});
                    if(result){
                       return {status:'ok', result: result}; 
                    }else{
                        return {status:'fail', result: 'an error occurred while trying to save the User'}; 
                    }
                }else{
                    return {status:'fail', result:`already exists the User '${data.username}', try another different`};
                }
            }else{
                let search = await this.getById(data.id);
                if(search){
                    if(!safeKey[0] || safeKey[0].id == data.id){
                        if(data.password){
                            data.password = this.createHash(data.password)
                        }else{
                            delete data.password;
                        }
                        let result = await this.editById(data.id,data);
                        if(result){
                            return {status:'ok', result: result.id}; 
                         }else{
                            return {status:'fail', result: 'an error occurred while trying to modify the User'}; 
                         }
                    }else{
                        return {status:'fail', result:`already exists the User '${data.username}', try another different`};
                    }
                }else{
                    return {status:'fail', result:`there is no User with the id ${data.id}`};
                }
            }
        } catch (err) {
            console.log(`an error occurred: ${err}`);
            return {status:'fail'}; 
        }
    }
}