const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const handleHttpRequest = require('./handleHttpRequest');
const port = 3001;

function extractInstanceData(instance) {
    const instanceData = instance.split('.')[1];
    const instanceBuffer = new Buffer.from(instanceData, 'base64');
    const decodedInstanceData = instanceBuffer.toString('utf-8');
    return JSON.parse(decodedInstanceData);
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', async function(req, res) {
    const {instance, compId} = req.query;
    const {instanceId} = extractInstanceData(instance);
    await handleHttpRequest.postComponent([compId, instanceId]);
    const message = await handleHttpRequest.getMessage([compId, instanceId]);
    res.render('home', {message})
});

app.get('/settings', async function(req, res) {
    const {origCompId, instance} = req.query;
    const {instanceId, permissions} = extractInstanceData(instance);
    console.log(permissions)
    if(permissions != 'OWNER') {
        res.render('settings', {error: "You're not authorized to modify the content"});
    } else {
        const message = await handleHttpRequest.getMessage([origCompId, instanceId]);
        res.render('settings', {message, instanceId, compId: origCompId})
    }
});

app.post('/message', async function(req, res) {
    const {message} = req.body;
    const {compId, instanceId} = req.query;
    await handleHttpRequest.postMessage([message, compId, instanceId]);
    res.render('settings', {message, instanceId, compId});
});

app.listen(port);



/*

const routes = [
  { method: 'GET', path: '/', handler}
];

*/

