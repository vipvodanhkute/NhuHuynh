import {
  GET_ROUTE,
  GET_ROUTES,
  GET_ROUTE_SUCCESS,
  GET_ROUTE_ERROR,
  GET_ROUTES_ERROR,
  SEARCH_TICKET,
  UPDATE_STATE_REDUX,
  GET_TOTAL_ROUTE,
  GET_TOTAL_ROUTE_SUCCESS,
  GET_TOTAL_ROUTE_ERROR,
  GET_STATUS_ROUTE,
  GET_STATUS_ROUTE_SUCCESS,
  GET_STATUS_ROUTE_ERROR,
  GET_TOTAL_TRIP,
  GET_TOTAL_TRIP_SUCCESS,
  GET_TOTAL_TRIP_ERROR,
  POST_BUS_OPERATOR,
  POST_BUS_OPERATOR_SUCCESS,
  POST_BUS_OPERATOR_FAIL,
  CLEAR_FILTER,
} from './constants';

export const getRoutes = (payload, filters, isServer) => ({
  type: GET_ROUTES,
  payload,
  filters,
  isServer,
});

export const getRoute = payload => ({
  type: GET_ROUTE,
  payload,
});

export const getRouteSuccess = result => ({
  type: GET_ROUTE_SUCCESS,
  ...result,
});

export const getRouteError = ({ message, code = 1 }, payload) => ({
  type: GET_ROUTE_ERROR,
  error: {
    message,
    code,
  },
  payload,
});

export const getRoutesError = ({ message, code = 1 }, payload) => ({
  type: GET_ROUTES_ERROR,
  error: {
    message,
    code,
  },
  payload,
});

export const getStatusRoute = payload => ({
  type: GET_STATUS_ROUTE,
  payload,
});

export const getStatusRouteSuccess = ({ status, payload, totalTicket }) => ({
  type: GET_STATUS_ROUTE_SUCCESS,
  payload,
  status,
  totalTicket,
});

export const getStatusRouteError = ({ message, code = 1 }) => ({
  type: GET_STATUS_ROUTE_ERROR,
  error: {
    message,
    code,
  },
});

export const getTotalRoute = payload => ({
  type: GET_TOTAL_ROUTE,
  payload,
});

export const getTotalRouteSuccess = payload => ({
  type: GET_TOTAL_ROUTE_SUCCESS,
  ...payload,
});

export const getTotalRouteError = ({ message, code = 1 }) => ({
  type: GET_TOTAL_ROUTE_ERROR,
  error: {
    message,
    code,
  },
});

export const gtmClickEvent = () => ({
  type: 'GTM_CLICK_EVENT',
});

export const searchTicket = data => ({
  type: SEARCH_TICKET,
  payload: {
    data,
  },
});

export const updateStateRedux = (path, data) => ({
  type: UPDATE_STATE_REDUX,
  path,
  data,
});

export const getTotalTripWithFilter = (payload, filters) => ({
  type: GET_TOTAL_TRIP,
  payload,
  filters,
});
export const getTotalTripWithFilterSuccess = ({ total, payload }) => ({
  type: GET_TOTAL_TRIP_SUCCESS,
  payload,
  total,
});

export const getTotalTripWithFilterError = ({ message, code = 1 }) => ({
  type: GET_TOTAL_TRIP_ERROR,
  error: {
    message,
    code,
  },
});

export const postNewBusOperator = ({
  name,
  phone,
  owner,
  from_id,
  to_id,
}) => ({
  type: POST_BUS_OPERATOR,
  payload: {
    name, phone, owner, from_id, to_id,
  },
})

export const postNewBusOperatorSuccess = () => ({
  type: POST_BUS_OPERATOR_SUCCESS,
})
export const postNewBusOperatorFail = () => ({
  type: POST_BUS_OPERATOR_FAIL,
})

export const clearFilter = () => ({
  type: CLEAR_FILTER,
})
