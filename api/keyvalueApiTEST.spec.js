const {app} = require('../class/configs/app.js');
const request = require('supertest');
const {Router} = require('express');
global.Ruta = Router;
const keyvalueApi = require('./keyvalueApi.js');
app.use('/api/keyvalue',keyvalueApi);

describe('KeyValue api: get all key/value',()=>{
    test('should return an array', async ()=>{
        const response = await request(app).get("/api/keyvalue").send();
        expect(response.body).toBeInstanceOf(Array);
    })

    test('should return a status 200', async ()=>{
        const response = await request(app).get("/api/keyvalue").send();
        expect(response.statusCode).toBe(200);
    })
})

describe('KeyValue api: get specific value',()=>{
    test('should return an object', async ()=>{
        const response = await request(app).get("/api/keyvalue/test").send();
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        
    })

    test('should return an object with the field "value"', async ()=>{
        const response = await request(app).get("/api/keyvalue/test").send();
        expect(response.body.value).toBeDefined();
        
    })

    test('should return a status 200', async ()=>{
        const response = await request(app).get("/api/keyvalue/test").send();
        expect(response.statusCode).toBe(200);
    })

    test('should return a status 404', async ()=>{
        const response = await request(app).get("/api/keyvalue/doesNotExist").send();
        expect(response.statusCode).toBe(404);
    })
})

describe('KeyValue api: wrong URL',()=>{
    test('should return a status 404', async ()=>{
        const response = await request(app).get("/doesNotExist").send();
        expect(response.statusCode).toBe(404);
        
    })
})