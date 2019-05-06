const mysql = require('mysql');

function aDriverFor(testkit) {

    function queryFactory(connectionString) {
        function query(sql, ...args) {
            return new Promise((resolve, reject) => {
                const conn = mysql.createConnection(connectionString);
                conn.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        conn.query(sql, args, (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(results);
                            }
                            conn.destroy();
                        })
                    }
                });
            });
        }

        return {query};
    }

    function readWrite() {
        return queryFactory(testkit.connectionString);
    }

    function readOnly() {
        return queryFactory(testkit.readOnlyConnectionString);
    }

    return {readOnly, readWrite};
}

function sleepOnServer(testkit, seconds) {
    return aDriverFor(testkit).readWrite().query(`SELECT SLEEP(${seconds})`);
}

module.exports = {sleepOnServer, aDriverFor};
