import moment from 'moment';
import get from 'lodash.get';
import request from '#/utils/request';
import { API_ROUTE } from '#/utils/api.routes';
import { INIT_GROUPS } from '#/containers/Route/reducer'

export function payloadToParamGetRoute(payload, suggestion, filters) {
  const time = INIT_GROUPS[suggestion] ? INIT_GROUPS[suggestion].time : undefined;
  return {
    filter: {
      from: payload.from.id,
      to: payload.to.id,
      date: moment(payload.date).toISOString(true),
      online_ticket: get(filters, 'buyTicketOnline.items.ticketOnline') ? 1 : 0,
      suggestion,
      payment_method: Object.keys(get(filters, 'paymentMethods.items', {})).filter((item) => {
        if (get(filters, `paymentMethods.items.${item}`, false)) {
          return item
        }
        return false
      }),
      pickup_point: get(filters, 'boardingPoints.items', []).filter((item) => {
        if (item.selected) {
          return item.description
        }
        return false;
      }),
      drop_off: get(filters, 'droppingPoints.items', []).filter((item) => {
        if (item.selected) {
          return item.description
        }
        return false;
      }),
      fare: {
        min: get(filters, 'ticketPrice.filter.value[0]', 0),
        max: get(filters, 'ticketPrice.filter.value[1]', 2000000),
      },
      available_seat: {
        min: get(filters, 'seatAvailable.filter.value[0]', 0),
        max: get(filters, 'seatAvailable.filter.value[1]', 50),
      },
      rating: {
        min: get(filters, 'rating.filter.value[0]', 1),
        max: get(filters, 'rating.filter.value[1]', 5),
      },
      time,
      facility: Object.keys(get(filters, 'facility.items', {})).filter((item) => {
        if (get(filters, `facility.items.${item}`, false)) {
          return item
        }
        return false
      }),
      service: Object.keys(get(filters, 'service.items', {})).filter((item) => {
        if (get(filters, `service.items.${item}`, false)) {
          return item
        }
        return false
      }),
      limousine: get(filters, 'buyTicketOnline.items.limousine') ? 1 : 0,
      companies: Object.keys(get(filters, 'operators.items', {}))
        .filter(item => get(filters, `operators.items.${item}.checked`, false)).map(t => get(filters, `operators.items.${t}.id`, 0)),
    },
    sort: Object.keys(payload.sort).map(x => `${x}:${payload.sort[x]}`).join(',') || undefined,
    page: suggestion ? get(payload, `groups[${suggestion}].page`, 1) : undefined,
    pagesize: suggestion ? get(payload, `groups[${suggestion}].pagesize`, INIT_GROUPS[suggestion].pagesize) : undefined,
  };
}

// const filterToFilterParams = (filter) => {
//   let rs = {}
//   rs.payment_method = fitler.paymentMethods.items.filter(item=> item.check)
//   return rs;
// }

export const getListRoute = params => request({
  url: API_ROUTE.GET_LIST_ROUTE,
  options: {
    method: 'GET',
    params,
  },
});

export const getTotalListRoute = (payload) => {
  const path = API_ROUTE.GET_TOTAL_ROUTE;
  return request({
    url: path,
    options: {
      method: 'GET',
      params: payload,
    },
  });
};

export function payloadToParams(payload, filters) {
  const rs = [];
  if (payload.suggestion) {
    payload.suggestion.forEach((item) => {
      rs.push(payloadToParamGetRoute(payload, item, filters));
    });
  } else {
    return payloadToParamGetRoute(payload, undefined, filters);
  }

  return rs;
}

export function payloadToTotalParams(payload) {
  const rs = [];

  payload.suggestion.forEach((item) => {
    const param = payloadToParamGetRoute(payload, item);
    delete param.page;
    delete param.pagesize;
    rs.push(param);
  });
  return rs;
}

export const payloadToParamsGetStatus = payload => ({
  filter: {
    from: payload.from.id,
    to: payload.to.id,
    date: moment(payload.date).toISOString(true),
  },
  lang: payload.lang,
});

export const getStatusListRoute = (payload) => {
  const params = payloadToParamsGetStatus(payload);
  const path = API_ROUTE.GET_STATUS_ROUTE;
  return request({
    url: path,
    options: {
      method: 'GET',
      params,
    },
  });
};

export const getTotalTrip = (payload) => {
  const path = API_ROUTE.GET_TOTAL_TRIP;
  return request({
    url: path,
    options: {
      method: 'GET',
      params: payload,
    },
  });
};

export const postNewBusOperator = (payload) => {
  const path = API_ROUTE.POST_NEW_BO;
  return request({
    url: path,
    options: {
      method: 'POST',
      params: payload,
    },
  });
};
