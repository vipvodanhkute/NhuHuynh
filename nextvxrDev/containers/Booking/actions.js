import {
  GET_TRIP_CODE_INFO,
  UPDATE_BOOKING_DATA,
  UPDATE_OPEN_ALERT_MESSAGE,
  RESET_BOOKING_DATA,
  SUBMIT_TICKET,
  RESET_TRIP_INFO_DATA,
  GET_COUNTRY_CODE_RESOURCE_SUCCESS,
  GET_COUNTRY_CODE_RESOURCE_ERROR,
  GET_TRIP_INFO_DETAIL,
  GET_TRIP_INFO_DETAIL_SUCCESS,
  GET_TRIP_INFO_DETAIL_ERROR,
  GET_TRIP_REVIEWS,
  GET_TRIP_REVIEWS_SUCCESS,
  GET_TRIP_REVIEWS_ERROR,
  RESET_TRIP_DETAIL_DATA,
} from './constants';

export const getTripCodeInfo = payload => ({
  type: GET_TRIP_CODE_INFO,
  payload,
});

export const updateBookingData = payload => ({
  type: UPDATE_BOOKING_DATA,
  payload,
});

export const updateOpenAlertMessage = payload => ({
  type: UPDATE_OPEN_ALERT_MESSAGE,
  payload,
});

export const resetBookingData = () => ({
  type: RESET_BOOKING_DATA,
});

export const submitTicket = payload => ({
  type: SUBMIT_TICKET,
  payload,
});

export const resetTripInfoData = () => ({
  type: RESET_TRIP_INFO_DATA,
});

export const getCountryCodeResourceSuccess = ({ payload }) => ({
  type: GET_COUNTRY_CODE_RESOURCE_SUCCESS,
  payload,
});

export const getCountryCodeResourceError = ({ message, code = 1 }) => ({
  type: GET_COUNTRY_CODE_RESOURCE_ERROR,
  error: {
    message,
    code,
  },
});

export const getTripInfoDetail = payload => ({
  type: GET_TRIP_INFO_DETAIL,
  payload,
});

export const getTripInfoDetailSuccess = payload => ({
  type: GET_TRIP_INFO_DETAIL_SUCCESS,
  payload,
});

export const getTripInfoDetailError = payload => ({
  type: GET_TRIP_INFO_DETAIL_ERROR,
  payload,
});

export const getTripReviews = payload => ({
  type: GET_TRIP_REVIEWS,
  payload,
});

export const getTripReviewsSuccess = payload => ({
  type: GET_TRIP_REVIEWS_SUCCESS,
  payload,
});

export const getTripReviewsError = payload => ({
  type: GET_TRIP_REVIEWS_ERROR,
  payload,
});

export const resetTripDetailData = () => ({
  type: RESET_TRIP_DETAIL_DATA,
});
