const http = require('http');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3001;

const connection = mysql.createConnection({
    host     : 'localhost',
    database : 'apps',
    user     : 'root',
    password : '',
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

http.createServer(function(req, res) {
    const urlParts = url.parse(req.url, true);
    if(urlParts.pathname === '/') {
        const compId = urlParts.query.compId;
        const instanceData = urlParts.query.instance.split('.')[1];
        const instanceBuffer = new Buffer.from(instanceData, 'base64');
        const decodedInstanceData = instanceBuffer.toString('utf-8');
        const instanceID = JSON.parse(decodedInstanceData).instanceId;
        const sql = `SELECT * FROM components WHERE compID = ?`;
        connection.query(sql, compId, function(err, rows, fields) {
            if(!rows.length) {
                const sql = `INSERT INTO components (compID, instanceID, message) VALUES (?, ?, ?)`;
                connection.query(sql, [compId, instanceID, ''], function(err, rows, fields) {
                    console.log(err, rows, fields);
                })
            }
        });
        fs.readFile('./index.html', function(err, html) {
            if(err) {
                throw err;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        })
    } else if (urlParts.pathname === '/settings' && req.method === 'GET') {
        fs.readFile('./settings.html', function(err, html) {
            if(err) {
                throw err;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        })
    } else if (urlParts.pathname === '/message' && req.method === 'GET') {
        const {compId, instanceId} = urlParts.query;
        const sql = `SELECT message FROM components WHERE compID = ? AND instanceID = ?`;
        connection.query(sql, [compId, instanceId], function(err, rows, fields) {
            if(rows.length) {
                res.write(rows[0].message);
                res.end();
            }
        })
    } else if (urlParts.pathname === '/message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const {message, compId, instanceId} = JSON.parse(body);
            const sql = `UPDATE components SET message = ? WHERE compID = ? AND instanceID = ?`;
            connection.query(sql, [ message, compId, instanceId ], function() {
                res.write('updated successfully');
                res.end();
            });
        });
    }
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
