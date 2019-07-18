const redis = require("redis");
const config = require('./config');
// const console = require('../libs/winston');

redis.RedisClient.prototype.delWildcard = function(key, callback) {
    let redis = this;

    redis.keys(key, function(err, rows) {
        for(let i = 0, j = rows.length; i < j; ++i) {
            redis.del(rows[i])
        }
        return callback();
    });
};

console.info('redis: {host: %s, port: %s, database: %s}', config.redisHost, config.redisPort, config.redisSelect);
let client = redis.createClient(config.redisPort, config.redisHost);
client.on("error", function(err) {
    console.error("'redis: error" + err);
});
client.select(config.redisSelect, function() { 
//     console.info('RedisSelectDB ::',config.redisSelect);
}); 

// client.monitor(function (err, res) {
//     console.log("Entering monitoring mode.");
// });
// client.on("monitor", function (time, args, raw_reply) {
//     console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
// });


module.exports = client;