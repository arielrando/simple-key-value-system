const {DBdefault} = require('../../config.js');

let generalDao;

switch (DBdefault) {
    case 'sqlite3':
        generalDao = require("../controllers/SQLite3client.js");
    break;
    case 'firebase':
        generalDao = require("../controllers/Firebaseclient.js");
    break;
    default:
        generalDao =  require("../controllers/SQLite3client.js");
    break;
}

module.exports = generalDao;