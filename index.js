const http = require('http');
const url = require('url');
const fs = require('fs');
const { promisify } = require('util');
const mysqlQueries = require('./mysqlQueries');
const hostname = '127.0.0.1';
const port = 3001;

function extractInstanceID(instance) {
    const instanceData = instance.split('.')[1];
    const instanceBuffer = new Buffer.from(instanceData, 'base64');
    const decodedInstanceData = instanceBuffer.toString('utf-8');
    return JSON.parse(decodedInstanceData).instanceId;
}

const readFile = promisify(fs.readFile);

http.createServer(async function(req, res) {
    const urlParts = url.parse(req.url, true);
    if(urlParts.pathname === '/') {
        const {compId, instance} = urlParts.query;
        const instanceId = extractInstanceID(instance);
        mysqlQueries.postComponent(res, compId, instanceId);
        try {
            const html = await readFile('./index.html');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }
        catch(err) {
            console.log('err', err)
        }
    } else if (urlParts.pathname === '/settings' && req.method === 'GET') {
        redirectToFile('./settings.html', res);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    } else if (urlParts.pathname === '/message' && req.method === 'GET') {
        const {compId, instanceId} = urlParts.query;
        mysqlQueries.getMessage(res, [compId, instanceId], );
    } else if (urlParts.pathname === '/message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const {message, compId, instanceId} = JSON.parse(body);
            mysqlQueries.postMessage(req, res, [message, compId, instanceId]);
        });
    }
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
