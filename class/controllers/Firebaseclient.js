module.exports = class Firebaseclient {
    constructor(tabla){
        this.admin = require("firebase-admin");
        let {optionsFirebase} = require('../../config.js');
        if (!this.admin.apps.length) {
            this.admin.initializeApp({
                credential: this.admin.credential.cert(optionsFirebase.conexion)
            });
         }else {
            this.admin.app(); 
         }
        
        this.db = this.admin.firestore();
        this.tabla = tabla;
        this.collection = this.db.collection(this.tabla);
    }

    static async inicializarTablas(){
        try{
            const admin = require("firebase-admin");
            let {optionsFirebase} = require('../../config.js');
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(optionsFirebase.conexion)
                });
            }else {
                admin.app(); 
            }
            const db = admin.firestore();
            let snapshotUsers = await db.collection('users').limit(1).get();
            if (snapshotUsers.size == 0) {
                (async() => {
                    await db.collection('users').add({username:"monkadmin",password:"$2b$10$RVJjxq2tV8P79yy.1QEL7OCjvLtOkZruSYUjb8y7dOdUCLxlGX73i",hidenUser:1,lvlUser:3});
                })();
            }
            let snapshotKeyvalue = await db.collection('keyvalue').limit(1).get();
            if (snapshotKeyvalue.size == 0) {
                (async() => {
                    await db.collection('keyvalue').add({key:"test",value:"test"});
                })();
            }
        }catch(err){
            console.log('no se pudieron inicializar las tablas: ',err);
        }
    }

    async getById(num) {
        try{
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                return { id: doc.id, ...doc.data() } ;
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async getCustom(arrayCustom, cantResultados = 0) {
        try{
            let doc = this.collection;
            if(arrayCustom.length>0){
                    for (let i = 0; i < arrayCustom.length; i++) {
                        doc = doc.where(arrayCustom[i].fieldName,'==',arrayCustom[i].value)
                    }
            }
            const snapshot = await doc.get();
            let resultado = Array();
            snapshot.forEach(doc => {
                resultado.push({ id: doc.id, ...doc.data() })
            })

            if(isNaN(cantResultados)){
                throw "The number of 'results searched' must be a valid number" ;
            }
            if(cantResultados>0){
                resultado = resultado.slice(0, cantResultados);
            }
            return resultado;
        }catch(err){
            console.log('No se pudo buscar el dato de la tabla ',this.tabla,': ',err);
            throw 'fatal error, check the logs'
        }
    }

    async getAll() {
        try{
            const snapshot = await this.collection.get();
            const respuestas = Array();
            snapshot.forEach(doc => {
                respuestas.push({ id: doc.id, ...doc.data() })
            })
            if(respuestas){
                return respuestas;
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo obtener los datos de la tabla ',this.tabla,' de la base de datos: ',err);
            throw 'fatal error, check the logs'
        }
    }

    async save(item) {
        try{
            const guardado = await this.collection.add(item);
            if(guardado.id){
                return guardado.id;
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo grabar el dato en la tabla ',this.tabla,': ',err);
        }
    }

    async editById(num, item) {
        try{
            let respuesta = null;
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                await this.collection.doc(num).set(item).then((resultado) => {
                    if(resultado._writeTime){
                        item.id = num;
                        respuesta = item;
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
            return respuesta;
        }catch(err){
            console.log('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteById(num) {
        try{
            let respuesta = false;
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                await this.collection.doc(num).delete().then((resultado) => {
                    if(resultado._writeTime){
                        respuesta = true
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
            return respuesta;
        }catch(err){
            console.log('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        try{
            await this.collection.get().then(querySnapshot => {
                querySnapshot.docs.forEach(snapshot => {
                    snapshot.ref.delete();
                })
            })
        }catch(err){

        }
    }
}