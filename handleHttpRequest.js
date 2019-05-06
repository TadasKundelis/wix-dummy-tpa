const mysqlQueries = require('./mysqlQueries');

module.exports = {
    postComponent: async function([compId, instanceId]) {
        try {
            return await mysqlQueries.postComponent(compId, instanceId);
        } catch(err) {
            console.log(err);
        }
    },
    getMessage: async function([compId, instanceId]) {
        try {
            const result = await mysqlQueries.getMessage([compId, instanceId]);
            if(result.length > 0) {
                return result[0].message;
            } else {
                return 'message not found';
            }
        } catch(err) {
            console.log(err);
        }
    },
    postMessage: async function([message, compId, instanceId]) {
        try {
            return await mysqlQueries.updateMessage([message, compId, instanceId]);
        } catch(err) {
            console.log(err);
        }
    }
};
