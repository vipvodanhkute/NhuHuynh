const env = process.env.ENV || 'development';

// Node config (hidden from browser
const config = {
  development: {
    assetPrefix: '',
    cookie: {
      path: '/',
      domain: 'localhost',
    },
    routePrefix: '',
    api: {
      api_client_id: '1355d8d0-35a4-11e5-84d3-cfa1193d2b50',
      api_client_secret: '4918ee64-42c9-45af-9f5d-8309fe611d03',
    },
  },
  sandbox: {
    assetPrefix: '',
    cookie: {
      path: '/',
      domain: 'dev-fe.vexere.net',
    },
    routePrefix: '',
    api: {
      api_client_id: '1355d8d0-35a4-11e5-84d3-cfa1193d2b50',
      api_client_secret: '4918ee64-42c9-45af-9f5d-8309fe611d03',
    },
  },
  uat: {
    assetPrefix: '',
    cookie: {
      path: '/',
      domain: 'uat-fe.vexere.net',
    },
    routePrefix: '',
    api: {
      api_client_id: '1355d8d0-35a4-11e5-84d3-cfa1193d2b50',
      api_client_secret: '4918ee64-42c9-45af-9f5d-8309fe611d03',
    },
  },
  canary: {
    assetPrefix: '',
    cookie: {
      path: '/',
      domain: '.vexere.com',
    },
    routePrefix: '',
    api: {
      api_client_id: 'a4eac500-3624-11e5-ac9e-09124c601013',
      api_client_secret: 'd1909676-fe4c-44b5-9fc5-040ee5c31c9e',
    },
  },
  production: {
    assetPrefix: '',
    cookie: {
      path: '/',
      domain: '.vexere.com',
      expires: 604800,
    },
    routePrefix: '',
    api: {
      api_client_id: 'a4eac500-3624-11e5-ac9e-09124c601013',
      api_client_secret: 'd1909676-fe4c-44b5-9fc5-040ee5c31c9e',
    },
  },
}[env];

module.exports = {
  config,
  env,
};
