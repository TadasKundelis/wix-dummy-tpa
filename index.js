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
    let response;
    const urlParts = url.parse(req.url, true);
    if(urlParts.pathname === '/') {
        const {compId, instance} = urlParts.query;
        const instanceId = extractInstanceID(instance);
        try {
            await mysqlQueries.postComponent(compId, instanceId);
            response = await readFile('./index.html');
            res.writeHead(200, {'Content-Type': 'text/html'});
        }
        catch(err) {
            console.log('err', err)
        }
    } else if (urlParts.pathname === '/settings' && req.method === 'GET') {
        try {
            response = await readFile('./settings.html');
            res.writeHead(200, {'Content-Type': 'text/html'});
        } catch(err) {
            console.log('err', err)
        }
    } else if (urlParts.pathname === '/message' && req.method === 'GET') {
        const {compId, instanceId} = urlParts.query;
        try {
            const result = await mysqlQueries.getMessage([compId, instanceId]);
            if(result.length) {
                response = result[0].message;
            }
        } catch(err) {
            console.log(err);
        }
    } else if (urlParts.pathname === '/message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const {message, compId, instanceId} = JSON.parse(body);
            try {
                const result = await mysqlQueries.updateMessage([message, compId, instanceId]);
                if(result) {
                    response ='updated successfully';
                }
            } catch(err) {
                console.log(err);
            }
        });
    }
    res.write(response);
    res.end();
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
