import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import get from 'lodash.get';
import { URL, PAYMENT_METHOD_CODE } from '#/utils/constants';
import {
  GET_IB_BANKS_REQUEST,
  GET_IB_BANKS_FAILURE,
  GET_IB_BANKS_SUCCESS,
  GET_TRANSFER_BANKS_FAILURE,
  GET_TRANSFER_BANKS_REQUEST,
  GET_TRANSFER_BANKS_SUCCESS,
  GET_PAYMENT_METHODS_REQUEST,
  CHECK_COUPON_CODE_REQUEST,
  GET_BOOKING_INFO_PAYMENT,
  GET_BOOKING_INFO_ERROR_PAYMENT,
  GET_BOOKING_INFO_SUCCESS_PAYMENT,
  PAYMENT_ORDER_REQUEST,
  GET_TERM,
  GET_TERM_FAILURE,
  GET_TERM_SUCCESS,
  CANCEL_BOOKING_REQUEST,
  GTM_PAYMENT_ORDER_STEP_1,
} from './constants';

import {
  getPaymentMethodsSuccess,
  getPaymentMethodsFailure,
  checkCouponSuccess,
  checkCouponFailure,
  paymentOrderFailure,
} from './actions';
import {
  getIBBanksFromAPI,
  getTransferBanksFromAPI,
  getPaymentMethodsFromAPI,
  checkCouponFromAPI,
  paymentOrderFromAPI,
  getTermFromAPI,
  cancelBookingFromAPI,
} from '#/utils/api/payment';
import { getBookingInfo } from '#/utils/api/booking';
import { mapFromAPI } from '#/utils/api/mapping/bookingBasicNormalize';
import { normalizeBookingInfoData } from '#/utils/api/mapping/bookingInfoNormalize';
import { mapIBBanksFromAPI, mapTransferBanksFromAPI } from '#/utils/api/mapping/bankNormalize';
import { mapPaymentMethodFromAPI } from '#/utils/api/mapping/paymentMethodNormalize';
import { mapTermFromAPI } from '#/utils/api/mapping/termNormalize';


const getLocale = state => state.device.locale;

function* getIBBanksSaga(action) {
  try {
    const response = yield call(getIBBanksFromAPI, action.payload);
    const IBBanks = mapIBBanksFromAPI(response);
    yield put({ type: GET_IB_BANKS_SUCCESS, IBBanks });
  } catch (err) {
    yield put({ type: GET_IB_BANKS_FAILURE });
  }
}

function* getTransferBanksSaga(action) {
  try {
    const lang = yield select(getLocale);
    const response = yield call(getTransferBanksFromAPI, action.payload);
    const transferBanks = mapTransferBanksFromAPI(response, lang);
    yield put({ type: GET_TRANSFER_BANKS_SUCCESS, transferBanks });
  } catch (err) {
    yield put({ type: GET_TRANSFER_BANKS_FAILURE });
  }
}

function* getPaymentMethodsByBookingCode(action) {
  try {
    const response = yield call(getPaymentMethodsFromAPI, action.payload);
    yield put(
      getPaymentMethodsSuccess({
        data: mapPaymentMethodFromAPI(response.data),
        booking: mapFromAPI({ ...get(response, 'booking'), code: action.payload.code }),
        payload: action.payload,
      }),
    );
    yield put({
      type: GTM_PAYMENT_ORDER_STEP_1,
      payload: {
        booking: mapFromAPI({ ...get(response, 'booking'), code: action.payload.code }),
      },
    });
  } catch (error) {
    yield put(getPaymentMethodsFailure());
  }
}

function* checkCoupon(action) {
  try {
    const response = yield call(checkCouponFromAPI, action.payload);
    yield put(checkCouponSuccess({ payload: response.data }));
  } catch (error) {
    yield put(checkCouponFailure());
  }
}
function* getBookingInfoPaymentSaga(action) {
  try {
    const response = yield call(getBookingInfo, {
      code: get(action, 'bookingCode'),
    });
    const lang = yield select(state => state.device.locale);
    const bookingInfo = normalizeBookingInfoData(response.data[0], lang);
    yield put({ type: GET_BOOKING_INFO_SUCCESS_PAYMENT, booking: bookingInfo });
    return;
  } catch (err) {
    yield put({
      type: GET_BOOKING_INFO_ERROR_PAYMENT,
      error: get(err, 'response.data', { code: 1 }),
    });
  }
}

function* paymentOrderSaga() {
  try {
    const booking = yield select(state => state.paymentReducer.bookingWithCoupon);
    const couponInfo = yield select(state => state.paymentReducer.couponInfo);
    const lang = yield select(state => state.device.locale);
    const method = yield select(state => state.paymentReducer.method);
    let paymentGateway = '';
    if (method.type === 5) {
      paymentGateway = method.code === 'VISA' ? 'cybersource' : 'zalo';
    } else {
      paymentGateway = 'pay_later';
    }
    const paymentOrder = {
      phone: booking.customer.phone,
      source: 'MOW',
      code: booking.code,
      email: booking.customer.email,
      value: booking.totalPrice,
      payment_gateway: paymentGateway,
      redirect_url: `${URL.PAYMENT_RESULT}/${lang}/payment-result`,
      ticket_ids: booking.ticketIds.toString(),
      vxr_payment_type: method.type,
      language: lang,
    };
    if (couponInfo) {
      paymentOrder.coupon = couponInfo.code;
    }
    switch (method.code) {
      case PAYMENT_METHOD_CODE.INTERNET_BANKING: {
        const selectedIBBank = yield select(state => state.paymentReducer.selectedIBBank);
        paymentOrder.bankcode = get(selectedIBBank, 'gateway[0].code');
        paymentOrder.payment_gateway = get(selectedIBBank, 'gateway[0].name');
        break;
      }
      case PAYMENT_METHOD_CODE.ZALO: {
        paymentOrder.bankcode = 'zalopayapp'
        break;
      }
      case PAYMENT_METHOD_CODE.TRANSFER: {
        const selectedTransferBank = yield select(
          state => state.paymentReducer.selectedTransferBank,
        );
        paymentOrder.bankcode = selectedTransferBank.code;
        break;
      }
      case PAYMENT_METHOD_CODE.COP: {
        paymentOrder.company_id = booking.companyId;
        break;
      }
      case PAYMENT_METHOD_CODE.VXR: {
        paymentOrder.company_id = 1;
        break;
      }
      default:
        break;
    }
    const response = yield call(paymentOrderFromAPI, paymentOrder);
    window.location.href = response.payment.redirect_url;
  } catch (error) {
    yield put(paymentOrderFailure());
  }
}

function* getTermSaga() {
  try {
    const response = yield call(getTermFromAPI);
    const lang = yield select(state => state.device.locale)
    yield put({ type: GET_TERM_SUCCESS, term: mapTermFromAPI(response, lang) });
  } catch (error) {
    yield put({ type: GET_TERM_FAILURE });
  }
}

function* cancelBookingSaga(action) {
  try {
    yield call(cancelBookingFromAPI, { code: action.payload.code, status: action.payload.status });
    window.location.reload(true)
  } catch (err) {
    window.location.reload(true)
  }
}

function* root() {
  yield takeLatest(GET_IB_BANKS_REQUEST, getIBBanksSaga);
  yield takeLatest(GET_TRANSFER_BANKS_REQUEST, getTransferBanksSaga);
  yield takeLatest(GET_PAYMENT_METHODS_REQUEST, getPaymentMethodsByBookingCode);
  yield takeLatest(CHECK_COUPON_CODE_REQUEST, checkCoupon);
  yield takeLatest(GET_BOOKING_INFO_PAYMENT, getBookingInfoPaymentSaga);
  yield takeLatest(PAYMENT_ORDER_REQUEST, paymentOrderSaga);
  yield takeLatest(GET_TERM, getTermSaga);
  yield takeLatest(CANCEL_BOOKING_REQUEST, cancelBookingSaga);
}
export default root;
