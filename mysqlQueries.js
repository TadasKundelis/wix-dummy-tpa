const createPool = require('./connectMysql');

const pool = createPool();

module.exports = {
    postComponent: function(res, compId, instanceId) {
        const query = `SELECT * FROM components WHERE compID = ?`;
        pool.query(query, compId, function(err, rows){
            if(err) throw err;
            if(!rows.length) {
                const query = `INSERT INTO components (compID, instanceID, message) VALUES (?, ?, ?)`;
                const callback = function(err) {
                    if(err) throw err;
                    res.write("Component successfully saved");
                    res.end();
                };
                pool.query(query, [compId, instanceId, ''], callback);
            }
        })
    },
    getMessage: function(res, params) {
        const query = `SELECT message FROM components WHERE compID = ? AND instanceID = ?`;
        const callback = function(err, rows) {
            if(err) throw err;
            if(rows.length) {
                res.write(rows[0].message);
                res.end();
            }
        };
        pool.query(query, params, callback);
    },
    postMessage: function(req, res, params) {
        const query = `UPDATE components SET message = ? WHERE compID = ? AND instanceID = ?`;
        const callback = function(err) {
            if(err) throw err;
            res.write('updated successfully');
            res.end();
        }
        pool.query(query, params, callback);
    }
}
