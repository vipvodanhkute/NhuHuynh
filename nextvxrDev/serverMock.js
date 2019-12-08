/*  eslint no-param-reassign: 0 */
const moment = require('moment');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const proxyMiddleware = require('http-proxy-middleware');
const qs = require('qs');

function runServer() {
  const proxy = {
    '/v1': {
      target: 'http://localhost:8081', // 'https://dev-api.vexere.net/',
      pathRewrite: {
        '^/v1/route/total': '/total',
        '^/v1/route/status': '/status',
        '^/v1/route': '/tickets',
        '^/v1/oauth/token': '/token',
        '^/v1/trip/filter': '/totalTrips',
        '^/v1/requestcompany': '/request',
      },
      changeOrigin: true,
      onProxyReq(proxyReq, req) {
        if (req.url === '/token') {
          proxyReq.method = 'GET';
        }
      },
    },
    '/seo': {
      target: 'http://localhost:8081', // 'https://dev-api.vexere.net/',
      changeOrigin: true,
      pathRewrite: {
        '/seo': '/dataSEO',
      },
      onProxyReq(proxyReq, req) {
        delete req.query.from
        delete req.query.to
        delete req.query.companyId
        delete req.query.lang
      },
    },
  };

  Object.keys(proxy).forEach((context) => {
    server.use(context, proxyMiddleware(proxy[context]));
  });


  // delay
  server.use('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    // setTimeout(next, Math.random() * 2000);
  });

  server.post('api/v1/oauth/token', (req, res, next) => {
    req.method = 'GET';
    next();
  });

  router.render = (req, res) => {
    if (req.url === '/token') {
      res.jsonp(res.locals.data);
    } else if (req.url === '/totalTrips') {
      res.jsonp({
        total: Math.floor(Math.random() * 100),
      });
    } else {
      const query = qs.parse(req._parsedUrl.query);
      if (query.filter && query.filter.date) {
        const date = moment(query.filter.date).format('DD-MM-YYYY');
        if (res.locals.data[date]) res.jsonp(res.locals.data[date]);
        else res.jsonp(res.locals.data.default);
      } else {
        res.jsonp(res.locals.data);
      }
    }
  };

  server.use(middlewares);
  // To handle POST, PUT and PATCH you need to use a body-parser
  // You can use the one used by JSON Server
  server.use(jsonServer.bodyParser);

  // Use default router
  server.use(router);
  server.listen(8081, () => {
    console.log('JSON Server is running');
  });
}

module.exports = runServer;
