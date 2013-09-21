var generic_pool = require('generic-pool');
var mongodb = require('mongodb');
var pool = generic_pool.Pool({
    name: 'mongodb',
    create: function(callback) {
        var config = {
            host : 'localhost',
            port : '27017',
            user : 'toriworks',
            password : 'z1z2z3z4',
            database : 'NineMiles'
        }
        var client = mongodb.createConnection(config);
        client.connect(function (error){
            if(error){
                console.log(error);
            }
            callback(error, client);
        });
    },
    destroy: function(client) {
        client.end();
    },
    min: 5,
    max: 100,
    idleTimeoutMillis : 300000,
    log : false
});

process.on("exit", function() {
    pool.drain(function () {
        pool.destroyAllNow();
    });
});

module.exports = pool;