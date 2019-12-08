import dotProp from 'dot-prop-immutable-chain';
import {
  GET_IB_BANKS_SUCCESS,
  GET_TRANSFER_BANKS_SUCCESS,
  GET_PAYMENT_METHODS_SUCCESS,
  GET_BOOKING_INFO_PAYMENT,
  GET_BOOKING_INFO_ERROR_PAYMENT,
  GET_BOOKING_INFO_SUCCESS_PAYMENT,
  UPDATE_IB_BANK,
  CHECK_COUPON_CODE_SUCCESS,
  CHECK_COUPON_CODE_REQUEST,
  CHECK_COUPON_CODE_FAILURE,
  REMOVE_COUPON,
  UPDATE_PAYMENT_METHOD,
  UPDATE_TRANSFER_BANK,
  UPDATE_OFFICE,
  PAYMENT_ORDER_REQUEST,
  PAYMENT_ORDER_FAILURE,
  GET_TERM_SUCCESS,
  RESET_PAYMENT_PAGE_DATA,
  HIDE_POPUP_INCORRECT_COUPON,
  HIDE_POPUP_CREATE_ORDER_FAILED,
} from './constants';

const initState = {
  listPaymentMethods: undefined,
  booking: {},
  bookingWithCoupon: {},
  couponInfo: undefined,
  couponLoading: false,
  payload: {
    bookingLoading: false,
  },
  transferBanks: [],
  internetBankingBanks: [],
  selectedIBBank: undefined,
  selectedTransferBank: undefined,
  selectedOffice: undefined,
  method: undefined,
  paymentLoading: false,
  paymentOrderFailured: false,
  isIncorrectCoupon: false,
  term: undefined,
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_IB_BANKS_SUCCESS:
      return {
        ...state,
        internetBankingBanks: action.IBBanks,
      };
    case GET_TRANSFER_BANKS_SUCCESS:
      return {
        ...state,
        transferBanks: action.transferBanks,
      };
    case GET_PAYMENT_METHODS_SUCCESS: {
      return {
        ...state,
        listPaymentMethods: action.data,
        booking: action.booking,
        bookingWithCoupon: action.booking,
      };
    }
    case CHECK_COUPON_CODE_REQUEST:
      return {
        ...state,
        couponLoading: true,
      };
    case CHECK_COUPON_CODE_SUCCESS:
      return dotProp(state)
        .set('isIncorrectCoupon', false)
        .set('couponInfo', action.payload.info)
        .set('couponLoading', false)
        .set('bookingWithCoupon.totalPrice', action.payload.info.fare_info.final_fare)
        .set('bookingWithCoupon.coupon', action.payload.info)
        .set('bookingWithCoupon.totalCoupon', action.payload.info.fare_info.coupon_value)
        .value();
    case CHECK_COUPON_CODE_FAILURE:
      return {
        ...state,
        couponLoading: false,
        isIncorrectCoupon: true,
      };
    case GET_BOOKING_INFO_PAYMENT:
      return dotProp.set(state, 'payload.bookingLoading', true);
    case GET_BOOKING_INFO_ERROR_PAYMENT:
      return dotProp(state)
        .set('payload.bookingLoading', false)
        .value();

    case GET_BOOKING_INFO_SUCCESS_PAYMENT: {
      const newState = dotProp(state)
        .set('payload.bookingLoading', false)
        .set('booking', { ...state.booking, ...action.booking })
        .set('bookingWithCoupon', { ...state.booking, ...action.booking });
      if (state.couponInfo) {
        newState
          .set('bookingWithCoupon.totalPrice', state.couponInfo.fare_info.final_fare)
          .set('bookingWithCoupon.coupon', state.couponInfo)
          .set('bookingWithCoupon.totalCoupon', state.couponInfo.fare_info.coupon_value);
      }
      return newState.value();
    }
    case REMOVE_COUPON:
      return dotProp(state)
        .set('bookingWithCoupon', state.booking)
        .set('couponInfo', null)
        .value();
    case UPDATE_IB_BANK:
      return { ...state, selectedIBBank: action.bank };
    case UPDATE_TRANSFER_BANK:
      return { ...state, selectedTransferBank: action.bank };
    case UPDATE_OFFICE:
      return { ...state, selectedOffice: action.office };
    case UPDATE_PAYMENT_METHOD:
      return { ...state, method: action.method };
    case PAYMENT_ORDER_REQUEST:
      return { ...state, paymentLoading: true, paymentOrderFailured: false };
    case PAYMENT_ORDER_FAILURE:
      return { ...state, paymentLoading: false, paymentOrderFailured: true };
    case GET_TERM_SUCCESS:
      return { ...state, term: action.term };
    case RESET_PAYMENT_PAGE_DATA:
      return {
        ...state,
        listPaymentMethods: undefined,
        booking: {},
        bookingWithCoupon: {},
        couponLoading: false,
        payload: {
          bookingLoading: false,
        },
        couponInfo: undefined,
        selectedIBBank: undefined,
        selectedOffice: undefined,
        method: undefined,
        paymentLoading: false,
        isIncorrectCoupon: false,
      };
    case HIDE_POPUP_INCORRECT_COUPON:
      return {
        ...state,
        isIncorrectCoupon: false,
      };
    case HIDE_POPUP_CREATE_ORDER_FAILED:
      return {
        ...state,
        paymentOrderFailured: false,
      };
    default:
      return state;
  }
};
