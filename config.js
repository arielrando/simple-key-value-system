require('dotenv').config();
/*firebase - sqlite3*/
const DBdefault = 'sqlite3';

const optionsSqlite3 = {
  client: 'sqlite3',
  connection: {
    filename: "./DB/database.sqlite"
  },
  useNullAsDefault: true
}

const optionsFirebase = {
  conexion : {
    type: "service_account",
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.client_x509_cert_url
  }
}

let sessionsConfig = {};

 function inicializarTablas(db){
  (async() => {
    switch (db) {
        case 'sqlite3':
          const SQLite3Client = require('./class/controllers/SQLite3client.js');
          await SQLite3Client.inicializarTablas();
        break;
        case 'firebase':
          const Firebaseclient = require('./class/controllers/Firebaseclient.js');
          await Firebaseclient.inicializarTablas();
        break;
        default:
          const DefaultClient = require('./class/controllers/SQLite3client.js');
          await DefaultClient.inicializarTablas();
        break;
    }
})();
}

const checkLogin = () => {
  return (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      res.redirect(`/login`);
    } else {
      next();
    }
  }
}

const checklvl = (num) => {
  return (req, res, next) => {
    if (req.user.lvlUser>=num) {
      next();
    } else {
      res.redirect(`/home`);
    }
  }
}

module.exports = {
    DBdefault,
    optionsSqlite3,
    optionsFirebase,
    sessionsConfig,
    inicializarTablas,
    checkLogin,
    checklvl
};