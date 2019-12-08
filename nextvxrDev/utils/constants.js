const getConfig = require('next/config').default;

const { publicRuntimeConfig } = getConfig() || {};
const env = publicRuntimeConfig ? publicRuntimeConfig.env : 'development';

const DEFAULT_LANG = 'en';

const APPLE_METAS_LINKS = {
  metas: [
    {
      name: 'theme-color',
      content: '#007AFF',
    },
    {
      name: 'full-screen',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: '',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: '#007AFF',
    },
    {
      charset: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
    {
      name: 'google-site-verification',
      content: 'niV9ShHdCWcZFAoPyWjqPL74Aldmk_jHfbvYkIt6uX0',
    },
  ],
  links: [
    {
      rel: 'apple-touch-icon',
      href: 'https://vexere.com/Content/vxr/images/vexere-ico.ico?v=00323',
      type: 'image/x-icon',
    },
    {
      rel: 'alternate',
      href: 'https://vexere.com',
      type: 'text/html',
      hreflang: 'x-default',
      title: 'Tiếng Việt',
    },
    {
      rel: 'alternate',
      href: 'https://vexere.com/Content/vxr/images/vexere-ico.ico?v=00323',
      type: 'text/html',
      hreflang: 'en-US',
      title: 'English',
    },
    // {
    //   rel: 'apple-touch-icon',
    //   href: '',
    //   type: 'image/x-icon',
    // },
  ],
};

const URL = {
  development: {
    BASE_URL: 'http://localhost:8080',
    MAIN: 'https://uat-api.vexere.net',
    ROUTE: 'https://uat-route-service.vexere.net',
    SEO: 'https://uat-seo-service.vexere.net',
    VGATE: 'https://uat-vgate.vexere.net',
    PAYMENT_RESULT: 'http://localhost:8080',
  },
  sandbox: {
    BASE_URL: 'https://dev-femobile.vexere.net',
    MAIN: 'https://uat-api.vexere.net',
    ROUTE: 'https://uat-route-service.vexere.net',
    SEO: 'https://uat-seo-service.vexere.net',
    VGATE: 'https://uat-vgate.vexere.net',
    PAYMENT_RESULT: 'https://uat-payment-result.vexere.net',
  },
  uat: {
    BASE_URL: 'https://uat-fe.vexere.net',
    DOT_NET_URL: 'https://uat-fe.vexere.net',
    MAIN: 'https://uat-api.vexere.net',
    ROUTE: 'https://uat-route-service.vexere.net',
    SEO: 'https://uat-seo-service.vexere.net',
    VGATE: 'https://uat-vgate.vexere.net',
    PAYMENT_RESULT: 'https://uat-payment-result.vexere.net',
  },
  canary: {
    BASE_URL: 'https://canary.vexere.com',
    MAIN: 'https://canary-api.vexere.com',
    ROUTE: 'https://canary-route-service.vexere.com',
    SEO: 'https://canary-seo-service.vexere.com',
    VGATE: 'https://vgate.vexere.com',
    PAYMENT_RESULT: 'https://canary-payment-result.vexere.com',
  },
  production: {
    BASE_URL: 'https://vexere.com',
    MAIN: 'https://api.vexere.com',
    ROUTE: 'https://route-service.vexere.com',
    SEO: 'https://seo-service.vexere.com',
    VGATE: 'https://vgate.vexere.com',
    PAYMENT_RESULT: 'https://payment-result.vexere.com',
  },
}[env];

const ROUTE_URL = {
  BUS_TICKET: {
    'vi-VN': 've-xe-khach',
    'en-US': 'bus-ticket-booking',
  },
  BUS_TICKET_LIMOUSINE: {
    'vi-VN': 've-xe-limousine',
    'en-US': 'limousine-bus-ticket-booking',
  },
  FROM: {
    'vi-VN': 'tu',
    'en-US': 'from',
  },
  TO: {
    'vi-VN': 'di',
    'en-US': 'to',
  },
};

const LANG = {
  VN: 'vi-VN',
  EN: 'en-US',
};


const SEO_ID = {
  DESKTOP: {
    GTM_ID: 'GTM-M6PXMMJ',
    HOTJAR_TRACKING: '1217690',
    FB_ID: '639150852886647',
    GA_ID: 'UA-42076441-6',
  },
  MOBILE: {
    GTM_ID: 'GTM-M6PXMMJ',
    HOTJAR_TRACKING: '1217690',
    FB_ID: '639150852886647',
    GA_ID: 'UA-42076441-6',
  },
}

// const SEAT_TYPE = {
//   1: 'ghế ngồi',
//   2: 'giường nằm',
//   3: 'ghế ngã',
//   7: 'giường nằm đôi',
// };
// const VEHICLE_QUALITY = {
//   1: 'xe thường',
//   2: 'limousine (vip)',
// };

const SEAT_TYPE = {
  1: 'ac seater',
  2: 'ac sleeper',
  3: 'reclining seat',
  7: 'double ac sleeper',
};

const VEHICLE_QUALITY = {
  1: 'normal',
  2: 'limousine',
};

const SEAT_TYPE_LANG = {
  1: {
    'vi-VN': 'Ghế ngồi',
    'en-US': 'AC Seater',
  },
  2: {
    'vi-VN': 'Giường nằm',
    'en-US': 'AC Sleeper',
  },
  3: {
    'vi-VN': 'Ghế ngã',
    'en-US': 'Reclining seat',
  },
  7: {
    'vi-VN': 'Giường đôi',
    'en-US': 'Double sleeping',
  },
};

const VEHICLE_QUALITY_LANG = {
  1: '',
  2: 'VIP',
};

const VXR_INFO = {
  HOTLINE: '1900969681',
  HOTLINE_FARE: '1,000',
};

const BOOKING_STATUS = {
  RESERVED: 1,
  PAID: 4,
  CANCELED: 5,
};

const PAYMENT_SERVICE = {
  FAIL: 0,
  SUCCESS: 1,
  PROCESSING: -1,
};

const PAYMENT_METHOD_CODE = {
  VISA: 'VISA',
  INTERNET_BANKING: 'IB',
  ZALO: 'ZALO_PAY_APP',
  CASH: 'CASH_COLLECTION',
  TRANSFER: 'TRANSFER',
  COP: 'COP',
  VXR: 'VXR',
};

const PAYMENT_METHOD = {
  NOT_SELECTED: {
    id: 0,
    idString: '0',
    smsId: '0',
  },
  ONLINE: {
    id: 5,
    idString: '5',
    smsId: '8',
  },
  SHOP_NEAR_HOME: {
    id: 8,
    idString: '8',
    smsId: '9',
  },
  TRANSFER: {
    id: 2,
    idString: '2',
    smsId: '4',
  },
  VEXERE_OFFICE: {
    id: 7,
    idString: '7',
    smsId: '6',
  },
  AT_BUS_AGENT: {
    id: 1,
    idString: '1',
    smsId: '3',
  },
  AT_AGENT: {
    id: 6,
    idString: '6',
    smsId: '0',
  },
  AT_HOME: {
    id: 3,
    idString: '3',
    smsId: '5',
  },
  MOMO: {
    id: 9,
    idString: '9',
    smsId: '10',
  },
};

const TICKET_SOURCE_TYPE = {
  1: 'bms',
  2: 'fe',
  3: 'ams',
  4: 'agent',
};

const API_MAP_KEY = 'AIzaSyDwGWP_SY9lG69hPAPsstcL-44P9ixqDWY';

const TICKET_STATUS = {
  NEW: 'new', // đã giữ chỗ
  PAID: 'paid', // đã thanh toán
  CANCELLED: 'cancelled', // đã bị hủy
};

const BREAK_POINT = {
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
}

const TICKET_NOTIFICATION_TYPE = {
  ALERT: 1,
  DISCOUNT: 2,
  PROMOTION: 3,
}

module.exports = {
  ENV: env,
  DEFAULT_LANG,
  APPLE_METAS_LINKS,
  URL,
  ROUTE_URL,
  LANG,
  SEO_ID,
  SEAT_TYPE,
  VEHICLE_QUALITY,
  VXR_INFO,
  BOOKING_STATUS,
  PAYMENT_SERVICE,
  PAYMENT_METHOD_CODE,
  PAYMENT_METHOD,
  API_MAP_KEY,
  TICKET_SOURCE_TYPE,
  TICKET_STATUS,
  BREAK_POINT,
  TICKET_NOTIFICATION_TYPE,
  SEAT_TYPE_LANG,
  VEHICLE_QUALITY_LANG,
};
