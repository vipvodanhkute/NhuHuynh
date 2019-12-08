import {
  call,
  put,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import get from 'lodash.get';
import {
  getBookingInfoSuccess,
  getBookingInfoError,
} from './actions';
import {
  getBookingInfo,
} from '#/utils/api/booking';
import {
  GET_BOOKING_INFO,
} from '#/containers/PaymentResults/constants';
import { normalizeBookingInfoData } from '#/utils/api/mapping/bookingInfoNormalize';
import { BOOKING_STATUS } from '#/utils/constants';

const retryTimes = 3;

function* getBookingInfoSaga(action) {
  try {
    const lang = select(state => state.device.locale)
    let response = {};
    if (get(action, 'payload.paymentGateway') && get(action, 'payload.paymentGateway') !== 'pay_later') {
      for (let i = 0; i < retryTimes; i += 1) {
        response = yield call(getBookingInfo, {
          code: get(action, 'payload.bookingCode'),
        }, lang);
        if (get(response, 'data[0].status') === BOOKING_STATUS.PAID) { break; }
        yield delay(100);
      }
    } else {
      response = yield call(getBookingInfo, {
        code: get(action, 'payload.bookingCode'),
      }, lang);
    }
    yield put(
      getBookingInfoSuccess(
        normalizeBookingInfoData(response.data[0], get(action, 'payload.lang')),
      ),
    );
    return;
  } catch (err) {
    yield put(getBookingInfoError({ message: err }));
  }
}

function* root() {
  yield takeLatest(GET_BOOKING_INFO, getBookingInfoSaga);
}

export default root;
