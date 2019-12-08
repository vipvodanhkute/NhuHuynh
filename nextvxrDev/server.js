process.on('uncaughtException', (err) => {
  console.error('uncaughtException', new Date(), err.stack);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const get = require('lodash.get');
const axios = require('axios');
const sessionstorage = require('sessionstorage');
const moment = require('moment');
const proxyMiddleware = require('http-proxy-middleware');
const morgan = require('morgan');
const languageDetector = require('./utils/middleware/languageDetector');
const { config } = require('./config');
const cache = require('./cache');

let URL = () => {
  const urls = require('./utils/constants').URL || {};
  URL = () => urls;
  return urls;
};
const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';

// // if (dev) {
// runServer();
// // }

const app = next({ dev });
const handle = routes.getRequestHandler(app, ({
  req, res, route, query,
}) => {
  app.render(req, res, route.page, query);
});

const port = process.env.PORT || 8080;

const getToken = () => axios({
  url: `${URL().MAIN}/v1/oauth/token`,
  method: 'post',
  data: `grant_type=client_credentials&client_secret=${config.api.api_client_secret}&client_id=${
    config.api.api_client_id
  }`,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
}).then((result) => {
  if (!result || result.data.error) {
    throw new Error(get(result, 'data.error', 'GET_TOKEN_FAIL'));
  }

  return result.data;
});

app.prepare().then(() => {
  const server = express();
  // server.use(morgan('combined'));
  const router = express.Router();

  // Set up the proxy.
  const proxy = {
    '/MAIN': {
      target: URL().MAIN, // 'https://dev-api.vexere.net/',
      pathRewrite: { '^/MAIN': '' },
      changeOrigin: true,
      onProxyReq: (proxyReq, req) => {
        // console.log('req.access_token', req.access_token)
        // console.log('----------------------------------')
        // console.log(req.headers)
        proxyReq.setHeader('Authorization', `Bearer ${req.access_token}`);
        proxyReq.setHeader('Accept', 'application/json');
      },
      onProxyRes: cache.follow,
    },
    '/ROUTE': {
      target: URL().ROUTE, // 'https://dev-api.vexere.net/',
      pathRewrite: { '^/ROUTE': '' },
      changeOrigin: true,
      onProxyReq: (proxyReq, req) => {
        // console.log('req.access_token', req.access_token)
        // console.log('----------------------------------')
        // console.log(req.headers)
        proxyReq.setHeader('Authorization', `Bearer ${req.access_token}`);
        proxyReq.setHeader('Accept', 'application/json');
      },
    },
    '/SEO': {
      target: URL().SEO, // 'https://dev-api.vexere.net/',
      pathRewrite: { '^/SEO': '' },
      changeOrigin: true,
      onProxyReq: (proxyReq, req) => {
        // console.log('req.access_token', req.access_token)
        // console.log('----------------------------------')
        // console.log(req.headers)
        proxyReq.setHeader('Authorization', `Bearer ${req.access_token}`);
        proxyReq.setHeader('Accept', 'application/json');
      },
      onProxyRes: cache.follow,
    },
    '/VGATE': {
      target: URL().VGATE,
      pathRewrite: { '^/VGATE': '' },
      changeOrigin: true,
      onProxyReq: (proxyReq, req) => {
        proxyReq.setHeader('Authorization', `Bearer ${req.access_token}`);
        proxyReq.setHeader('Accept', 'application/json');
      },
    },
  };

  const setAuth = (req, res, next) => {
    if (
      !sessionstorage.getItem('access_token')
      || moment().valueOf()
        > moment(sessionstorage.getItem('access_token_expires_at'), 'YYYY-MM-DD HH:mm:ss').valueOf()
    ) {
      return getToken()
        .then((result) => {
          if (!result) {
            req.token = false;
            return next();
          }

          req.access_token = result.access_token;
          sessionstorage.setItem('access_token', result.access_token);
          sessionstorage.setItem(
            'access_token_expires_at',
            moment()
              .add(result.expires_in - 10, 'seconds')
              .format('YYYY-MM-DD HH:mm:ss'),
          );
          return next();
        })
        .catch(() => {
          req.token = false;
          next();
        });
    }

    req.access_token = sessionstorage.getItem('access_token');
    return next();
  };

  Object.keys(proxy).forEach((context) => {
    server.use(cache, setAuth, proxyMiddleware(context, proxy[context]));
  });

  server.get('/healthz', (req, res) => {
    res.send('OK');
  });

  server.post('/getToken', (req, res) => getToken()
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.status(500).end('GET_TOKEN_FAIL');
    }));

  server.use(cookieParser());

  server.use(languageDetector);

  server.use(handle);

  server.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, lang',
    );
    next();
  });

  router.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});

setInterval(() => {
  try {
    global.gc();
  } catch (e) {
    console.log("You must run program with 'node --expose-gc server.js' or 'npm start'");
    process.exit();
  }
}, 5000);
