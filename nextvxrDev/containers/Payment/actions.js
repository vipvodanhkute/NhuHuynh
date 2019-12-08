import {
  GET_IB_BANKS_REQUEST,
  GET_TRANSFER_BANKS_REQUEST,
  GET_PAYMENT_METHODS_REQUEST,
  GET_PAYMENT_METHODS_SUCCESS,
  GET_PAYMENT_METHODS_FAILURE,
  CHECK_COUPON_CODE_REQUEST,
  CHECK_COUPON_CODE_SUCCESS,
  CHECK_COUPON_CODE_FAILURE,
  GET_BOOKING_INFO_PAYMENT,
  UPDATE_IB_BANK,
  REMOVE_COUPON,
  PAYMENT_ORDER_REQUEST,
  PAYMENT_ORDER_FAILURE,
  UPDATE_PAYMENT_METHOD,
  UPDATE_TRANSFER_BANK,
  UPDATE_OFFICE,
  GET_TERM,
  CANCEL_BOOKING_REQUEST,
  RESET_PAYMENT_PAGE_DATA,
  HIDE_POPUP_INCORRECT_COUPON,
  HIDE_POPUP_CREATE_ORDER_FAILED,
  CHECK_MINIMUM_TRANSACTION_AMOUNT,
} from './constants';

export const getIBBanks = () => ({
  type: GET_IB_BANKS_REQUEST,
});

export const getTransferBanks = () => ({
  type: GET_TRANSFER_BANKS_REQUEST,
});

export const getPaymentMethods = payload => ({
  type: GET_PAYMENT_METHODS_REQUEST,
  payload,
});

export const getPaymentMethodsSuccess = ({ booking, data, payload }) => ({
  type: GET_PAYMENT_METHODS_SUCCESS,
  payload,
  booking,
  data,
});

export const getPaymentMethodsFailure = () => ({
  type: GET_PAYMENT_METHODS_FAILURE,
});

export const checkCouponCode = payload => ({
  type: CHECK_COUPON_CODE_REQUEST,
  payload,
});

export const checkCouponSuccess = ({ payload }) => ({
  type: CHECK_COUPON_CODE_SUCCESS,
  payload,
});

export const checkCouponFailure = () => ({
  type: CHECK_COUPON_CODE_FAILURE,
});

export const getBookingInfoPayment = bookingCode => ({
  type: GET_BOOKING_INFO_PAYMENT,
  bookingCode,
});

export const updateIBBank = bank => ({
  type: UPDATE_IB_BANK,
  bank,
});

export const removeCoupon = () => ({
  type: REMOVE_COUPON,
});

export const paymentOrderRequest = () => ({
  type: PAYMENT_ORDER_REQUEST,
});
export const paymentOrderFailure = () => ({
  type: PAYMENT_ORDER_FAILURE,
});
export const updatePaymentMethod = method => ({
  type: UPDATE_PAYMENT_METHOD,
  method,
});

export const updateTransferBank = bank => ({
  type: UPDATE_TRANSFER_BANK,
  bank,
});

export const updateOffice = office => ({
  type: UPDATE_OFFICE,
  office,
});

export const getTerm = () => ({
  type: GET_TERM,
});

export const cancelBooking = payload => ({
  type: CANCEL_BOOKING_REQUEST,
  payload,
});

export const resetPaymentPageData = () => ({
  type: RESET_PAYMENT_PAGE_DATA,
});

export const hidePopupIncorrectCoupon = () => ({
  type: HIDE_POPUP_INCORRECT_COUPON,
});
export const hidePopupCreateOrderFailed = () => ({
  type: HIDE_POPUP_CREATE_ORDER_FAILED,
});

export const checkMinimumTransactionAmount = payload => ({
  type: CHECK_MINIMUM_TRANSACTION_AMOUNT,
  payload,
});
