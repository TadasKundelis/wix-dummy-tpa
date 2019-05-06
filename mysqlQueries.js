const createPool = require('./connectMysql');



// module.exports = {
//     getComponent: function(compId) {
//         const query = `SELECT * FROM components WHERE compID = ?`;
//         return this.pool.query(query, compId);
//     },
//     postComponent: async function(compId, instanceId) {
//         const self = this;
//         try {
//             const result = await self.getComponent(compId);
//             if(!result.length) {
//                 const query = `INSERT INTO components (compID, instanceID, message) VALUES (?, ?, ?)`;
//                 return this.pool.query(query, [compId, instanceId, '']);
//             } else {
//                 return Promise.resolve('component already exists');
//             }
//         } catch (err) {
//             throw err;
//         }
//     },
//     getMessage: function(params) {
//         const query = `SELECT message FROM components WHERE compID = ? AND instanceID = ?`;
//         return this.pool.query(query, params);
//     },
//     updateMessage: function(params) {
//         const query = `UPDATE components SET message = ? WHERE compID = ? AND instanceID = ?`;
//         return this.pool.query(query, params);
//     }
// }

module.exports = function(config) {
    const pool = createPool(config);
    const module = {
        getComponent: function(compId) {
            const query = `SELECT * FROM components WHERE compID = ?`;
            return pool.query(query, compId);
        },
        postComponent: async function(compId, instanceId) {
            const self = this;
            try {
                const result = await self.getComponent(compId);
                if(!result.length) {
                    const query = `INSERT INTO components (compID, instanceID, message) VALUES (?, ?, ?)`;
                    return pool.query(query, [compId, instanceId, '']);
                } else {
                    return Promise.resolve('component already exists');
                }
            } catch (err) {
                throw err;
            }
        },
        getMessage: function(params) {
            const query = `SELECT message FROM components WHERE compID = ? AND instanceID = ?`;
            return pool.query(query, params);
        },
        updateMessage: function(params) {
            const query = `UPDATE components SET message = ? WHERE compID = ? AND instanceID = ?`;
            return pool.query(query, params);
        }
    };
    return module;
};
