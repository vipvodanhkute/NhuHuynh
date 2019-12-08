import {
  GET_BOOKING_INFO,
  GET_BOOKING_INFO_SUCCESS,
  GET_BOOKING_INFO_ERROR,
} from '#/containers/PaymentResults/constants';

export const getBookingInfo = payload => ({
  type: GET_BOOKING_INFO,
  payload,
});

export const getBookingInfoSuccess = response => ({
  type: GET_BOOKING_INFO_SUCCESS,
  response,
});

export const getBookingInfoError = error => ({
  type: GET_BOOKING_INFO_ERROR,
  error,
});
