/**
 * Express middleware attached to all API GET routes to return a cached version if exists.
 * Note: server cache TTL = 10 seconds
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.fetchFromCache = async (req, res, next) => {
  // Don't use Redis cache in tests
  if (process.env.NODE_ENV === 'test' || req.method !== 'GET') {
    next();
  } else {
    // Send cached value if present, else proceed to next middleware
    let cached = await require('./redisClient').getAsync(req.originalUrl);
    if (cached) {
      res.status(200).json(JSON.parse(cached));
    } else {
      next();
    }
  }
}

/**
 * Set a JSON response in server cache for TTL seconds.
 * @param {String} key: endpoint string, one of `/description/${PID}`, `/description/title/${PID}`, `/genre/${PID}`
 * @param {String} val: Stringified JSON to be stored in cache
 * @param {Number} ttl: number of seconds before cache expiration. Defaults to 10.
 */
exports.setCache = async (key, val, ttl = 10) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  } else {
    return await require('./redisClient').setAsync(key, val, 'EX', ttl);
  }
}

/**
 * Remove a key-val pair from server cache.
 * @param {*} key
 */
exports.invalidateCache = async (key) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  } else {
    return await require('./redisClient').delAsync(key);
  }
}
