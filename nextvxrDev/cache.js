const cache = require('memory-cache');

const CACHE_PATHS = {
  // For banner
  '/MAIN/v1/banner': true,
  '/v1/banner': {
    time: 15 * 60,
  },

  // For SEO
  '/SEO/graphql': true,
  '/graphql': {
    time: 10 * 60,
  },
};

const getKey = req => `__express__${req.originalUrl || req.url}`;

module.exports = (req, res, next) => {
  if (CACHE_PATHS[req.path]) {
    const key = getKey(req);
    const cacheContent = cache.get(key);

    if (cacheContent) {
      res.json(cacheContent);
      return;
    }
  }

  next();
};

module.exports.follow = (proxyRes, req) => {
  if (!CACHE_PATHS[req.path]) {
    return true;
  }

  if (req.path === '/graphql' && req.query.page !== 'home') {
    return true;
  }

  let body = '';
  proxyRes.on('data', (chunk) => {
    body += chunk;
  });

  proxyRes.on('end', () => {
    if (body) {
      try {
        cache.put(getKey(req), JSON.parse(body), CACHE_PATHS[req.path].time * 1000);
      } catch (e) {
        console.log('cache err', e, body, req.path)
      }
    }
  });
  return true;
};
