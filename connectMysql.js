const mysql = require('promise-mysql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    connectionLimit: 10,
    host     : process.env.DB_HOST,
    database : process.env.DATABASE,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
};

function createPool() {
    return mysql.createPool(config);
}

module.exports = createPool;



