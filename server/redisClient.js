const redis = require('redis');
const { promisify } = require("util");

const redisClient = redis.createClient('redis://localhost:6379');
const getAsync = process.env.NODE_ENV === 'test' ? () => {} : promisify(redisClient.get).bind(redisClient);
const setAsync = process.env.NODE_ENV === 'test' ? () => {} : promisify(redisClient.set).bind(redisClient);
const delAsync = process.env.NODE_ENV === 'test' ? () => {} : promisify(redisClient.del).bind(redisClient);

redisClient.on('ready', () => console.log('Redis server connection established'));
redisClient.on('error', (err) => console.error(err));

module.exports = { redisClient, getAsync, setAsync, delAsync };
