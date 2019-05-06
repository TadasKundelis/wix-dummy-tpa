const mysql = require('promise-mysql');

function createPool(config) {
    return mysql.createPool(config);
}

module.exports = createPool;



