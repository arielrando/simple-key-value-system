const express = require('express');
const {Router} = express;

const {DBdefault, inicializarTablas} = require('./config.js');
(async() => {
    await inicializarTablas(DBdefault);
})();

global.Ruta = Router;

const {app, httpServer, io} = require('./class/configs/app.js');

const indexRoute = require('./routes/index_routes.js');
const keyvalueRoute = require('./routes/keyvalue_route.js');
const keyvalueApi = require('./api/keyvalueApi.js');
const usersRoute = require('./routes/users_routes');

app.use('/',indexRoute);
app.use('/keyvalue',keyvalueRoute);
app.use('/api/keyvalue',keyvalueApi);
app.use('/users',usersRoute);

app.use((req, res, next) => {
    res.status(404);
    res.send({ status : 404, errorMessagge: `route ${req.url} on ${req.method} not found`});
});

httpServer.listen(8080, () => console.log('SERVER ON'))
httpServer.on('error', (err) =>console.log(err));