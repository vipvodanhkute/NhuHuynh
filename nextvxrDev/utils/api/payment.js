import request from '#/utils/request';
import format from 'string-template';
import { API_PAYMENT } from '#/utils/api.payment';

export const getIBBanksFromAPI = () => request({
  url: API_PAYMENT.GET_IB_BANKS,
  options: {
    method: 'GET',
  },
});

export const getTransferBanksFromAPI = () => request({
  url: API_PAYMENT.GET_TRANSFER_BANKS,
  options: {
    method: 'GET',
  },
});

export const getPaymentMethodsFromAPI = params => request({
  url: API_PAYMENT.GET_PAYMENT_METHODS,
  options: {
    method: 'GET',
    params,
  },
});

export const checkCouponFromAPI = params => request({
  url: API_PAYMENT.CHECK_COUPON,
  options: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
  },
});

export const paymentOrderFromAPI = body => request({
  url: API_PAYMENT.PAYMENT_ORDER,
  options: {
    method: 'POST',
    body,
  },
});

export const getTermFromAPI = () => request({
  url: API_PAYMENT.TERM,
  options: {
    method: 'GET',
  },
});

export const cancelBookingFromAPI = params => request({
  url: format(API_PAYMENT.CANCEL_BOOKING, params),
  options: {
    method: 'POST',
  },
});
