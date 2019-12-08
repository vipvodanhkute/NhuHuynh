import request from '#/utils/request';
import format from 'string-template';
import { API_ROUTE } from '#/utils/api.routes';

export const getBookingInfo = payload => request({
  url: format(API_ROUTE.GET_BOOKING_INFO, { trip_code: payload.trip_code }),
  options: {
    method: 'GET',
    params: { from: payload.from, to: payload.to },
  },
});
