import request from '#/utils/request';
import format from 'string-template';
import { API_ROUTE } from '#/utils/api.routes';

export const getTripCodeInfo = payload => request({
  url: format(API_ROUTE.GET_TRIP_INFO, { trip_code: payload.trip_code }),
  options: {
    method: 'GET',
    params: { from: payload.from, to: payload.to },
  },
});

export const registerBooking = payload => request({
  url: format(API_ROUTE.POST_REGISTER_BOOKING, payload),
  options: {
    method: 'POST',
    body: payload,
  },
});

export const reserveBooking = payload => request({
  url: format(API_ROUTE.POST_RESERVE_BOOKING, payload),
  options: {
    method: 'POST',
    body: payload,
  },
});

export const getBookingInfo = payload => request({
  url: format(API_ROUTE.GET_BOOKING_INFO, { code: payload.code }),
  options: {
    method: 'GET',
    params: payload,
  },
});

export const getVXRHotline = payload => request({
  url: API_ROUTE.GET_VXR_HOTLINE,
  options: {
    method: 'GET',
    params: payload,
  },
});

export const getCountryCode = () => request({
  url: API_ROUTE.GET_COUNTRY_CODE,
  options: {
    method: 'GET',
  },
});
