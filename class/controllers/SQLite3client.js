module.exports = class SQLite3client {
    constructor(tabla, combierteJson = false){
        let {optionsSqlite3} = require('../../config.js');
        let knex = require('knex');
        
        this.objKnex = knex(optionsSqlite3);
        this.tabla = tabla;
        this.combierteJson = combierteJson;
    }

    static async inicializarTablas(){
        try{
            let {optionsSqlite3} = require('../../config.js');
            let knex = require('knex');
            let knexAux = knex(optionsSqlite3);
            await knexAux.schema.hasTable('users').then(async function(exists) {
                if (!exists) {
                    await knexAux.schema.createTable('users', function(table){
                        table.increments('id').primary();
                        table.string('username',30).notNullable();
                        table.string('password',200).notNullable();
                        table.boolean('hidenUser').defaultTo(0);
                        table.integer('lvlUser').defaultTo(1);
                    });
                    let user = [
                        {"username":'monkadmin',"password":"$2b$10$RVJjxq2tV8P79yy.1QEL7OCjvLtOkZruSYUjb8y7dOdUCLxlGX73i","hidenUser":1,"lvlUser":3},
                    ]
                    await knexAux('users').insert(user);
                }
            });
            await knexAux.schema.hasTable('keyvalue').then(async function(exists) {
                if (!exists) {
                    await knexAux.schema.createTable('keyvalue', function(table){
                        table.increments('id').primary();
                        table.string('key',50).notNullable();
                        table.string('value',50).notNullable();
                    });
                    let keyvalue = [
                        {"key":'test',"value":"test"},
                    ]
                    await knexAux('keyvalue').insert(keyvalue);
                }
            });
        }catch(err){
            console.log('No se pudo creat la tabla de productos: ',err);
        }
    }

    async getAll(){
        try{
            let test = await this.objKnex(this.tabla).select('*');
            return test;
        }catch(err){
            console.log('No se pudo obtener los datos de la tabla ',this.tabla,' de la base de datos: ',err);
            throw 'fatal error, check the logs'
        }
    }

    async save(item){
        try{
            if(this.combierteJson){
                for (const property in item) {
                    if((!!item[property]) && ((item[property].constructor === Array) || (item[property].constructor === Object))){
                        item[property] = JSON.stringify(item[property]);
                    }
                }
            }
            let resultado = await this.objKnex(this.tabla).insert(item, ['id']);
            if(resultado.length>0){
                return resultado[0];
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo grabar el dato en la tabla ',this.tabla,': ',err);
            return null;
        }
    }

    async getById(num){
        try{
            let resultado = await this.objKnex(this.tabla).where('id',num).select('*');
            if(resultado.length>0){
                if(this.combierteJson){
                    for (const property in resultado[0]) {
                        if(this.IsJsonString(resultado[0][property])){
                            resultado[0][property] = JSON.parse(resultado[0][property]); 
                        }
                    }
                }
                return resultado[0];
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async getCustom(arrayCustom, cantResultados = 0){
        try{
            let query = {};
            if(arrayCustom.length>0){
                
                if(arrayCustom.length) {
                    for (let i = 0; i < arrayCustom.length; i++) {
                        query[arrayCustom[i].fieldName] = arrayCustom[i].value;
                    }
                };
            }
            let resultado = await this.objKnex(this.tabla).where(query).select('*');
            if(isNaN(cantResultados)){
                throw "La cantidad de resultados debe ser un numero valido" ;
            }
            if(cantResultados>0){
                resultado = resultado.slice(0, cantResultados);
            }
            return resultado;
        }catch(err){
            console.log('No se pudo buscar el dato ',JSON.stringify(arrayCustom),' de la tabla ',this.tabla,': ',err);
            throw 'fatal error, check the logs'
        }
    }

    async editById(num,item){
        try{
            let buscado = await this.objKnex(this.tabla).where('id',num).select('*');
            if(buscado.length>0){
                if(this.combierteJson){
                    for (const property in item) {
                        if((!!item[property]) && ((item[property].constructor === Array) || (item[property].constructor === Object))){
                            item[property] = JSON.stringify(item[property]);
                        }
                    }
                }
                let result = await this.objKnex.from(this.tabla).where('id', num).update(item);
                if(result){
                    item.id = num;
                    return item
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
            return null;
        }
    }

    async deleteById(num){
        try{
            let buscado = await this.objKnex(this.tabla).where('id',num).select('*');
            if(buscado.length>0){
                return await this.objKnex.from(this.tabla).where('id', num).del();
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo borrar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        await this.objKnex(this.tabla).truncate();
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}