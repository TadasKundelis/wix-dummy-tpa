const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config();

const config = {
    host     : process.env.DB_HOST,
    database : process.env.DATABASE,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
};

function createConnection() {
    const connection = mysql.createConnection(config);
    connection.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
        console.log('Connected as id ' + connection.threadId);
    });
    return connection
}

module.exports = createConnection;



