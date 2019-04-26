const createPool = require('./connectMysql');

const pool = createPool();

module.exports = {
    postComponent: function(compId, instanceId) {
        const query = `SELECT * FROM components WHERE compID = ?`;
        pool.query(query, compId, function(err, rows){
            if(!rows.length) {
                const query = `INSERT INTO components (compID, instanceID, message) VALUES (?, ?, ?)`;
                pool.query(query, [compId, instanceId, '']);
            }
        })
    },
    getMessage: function(res, params) {
        const query = `SELECT message FROM components WHERE compID = ? AND instanceID = ?`;
        const callback = function(err, rows) {
            if(rows.length) {
                res.write(rows[0].message);
                res.end();
            }
        };
        pool.query(query, params, callback);
    },
    postMessage: function(req, res, params) {
        const query = `UPDATE components SET message = ? WHERE compID = ? AND instanceID = ?`;
        const callback = function() {
            res.write('updated successfully');
            res.end();
        }
        pool.query(query, params, callback);
    }
}
