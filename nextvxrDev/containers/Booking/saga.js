import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import get from 'lodash.get';
import Router from 'next/router';
import {
  GET_TRIP_CODE_INFO,
  GET_TRIP_CODE_INFO_SUCCESS,
  GET_TRIP_CODE_INFO_ERROR,
  SUBMIT_TICKET,
  SUBMIT_TICKET_SUCCESS,
  SUBMIT_TICKET_ERROR,
  BOOKING_TYPE,
  GET_VXR_HOTLINE_SUCCESS,
  GET_VXR_HOTLINE_ERROR,
  GTM_PRODUCT_DETAIL_VIEW,
  GET_TRIP_INFO_DETAIL,
  GET_TRIP_REVIEWS,
} from './constants';
import {
  getTripCodeInfo,
  registerBooking,
  reserveBooking,
  getVXRHotline,
  getCountryCode,
} from '#/utils/api/booking';
import {
  getCompanyImage,
  getCancellationPolicy,
  getCompanyUtility,
  getCompanyInfo,
  getCompanyReview,
} from '#/utils/api/companyInfo';
import {
  getCountryCodeResourceSuccess,
  getCountryCodeResourceError,
  getTripInfoDetailSuccess,
  getTripInfoDetailError,
  getTripReviewsSuccess,
  getTripReviewsError,
} from './actions';
import {
  SEAT_TYPE,
  VEHICLE_QUALITY,
} from '#/utils/constants';
import { normalizeTripInfoData, normalizeTripInfoReviews } from '#/utils/api/mapping/tripInfoNormalize';
import { normalizeCancellationPolicy } from '#/utils/api/mapping/cancellationPolicyNormalize';

const getLocale = state => state.device.locale;

function* getCountryCodeResource(payload) {
  try {
    const response = yield call(getCountryCode, payload);
    yield put(getCountryCodeResourceSuccess({ payload: response.data }));
  } catch (err) {
    yield put(getCountryCodeResourceError(err.response.data));
  }
}

function* getTripInfoSaga(action) {
  try {
    const response = yield call(getTripCodeInfo, action.payload);
    const tripInfoData = normalizeTripInfoData(response.data, get(action, 'payload.lang'));
    yield put({
      type: GET_TRIP_CODE_INFO_SUCCESS,
      response: {
        data: tripInfoData,
      },
      payload: action.payload,
    });
    yield put({
      type: GTM_PRODUCT_DETAIL_VIEW,
      payload: {
        tripInfo: tripInfoData,
        trip_code: get(action, 'payload.trip_code'),
        seatType: SEAT_TYPE[get(tripInfoData, 'route.vehicle_seat_type')],
        vehicleQuanlity: VEHICLE_QUALITY[get(tripInfoData, 'route.vehicle_quality')],
        fare: get(action, 'payload.fare', 0),
      },
    });
    if (response.data && response.data.selling_type === BOOKING_TYPE.CALLING) {
      try {
        const hotlineResponse = yield call(getVXRHotline, { signal: 1 });
        yield put({
          type: GET_VXR_HOTLINE_SUCCESS,
          response: hotlineResponse,
        });
      } catch (err) {
        const error = get(err, 'response.data.error');
        yield put({
          type: GET_VXR_HOTLINE_ERROR,
          error,
        });
      }
    } else if (get(response, 'data.selling_type') === BOOKING_TYPE.ONLINE || get(response, 'data.selling_type') === BOOKING_TYPE.REGISTER) {
      yield call(getCountryCodeResource, {});
    }
  } catch (err) {
    const error = get(err, 'response.data.error');
    yield put({
      type: GET_TRIP_CODE_INFO_ERROR,
      error,
    });
  }
}

function* submitTicketSaga(action) {
  try {
    let submitTicketPesponse;
    const lang = yield select(getLocale)
    if (get(action, 'payload.booking_type') === BOOKING_TYPE.REGISTER) {
      submitTicketPesponse = yield call(registerBooking, get(action, 'payload.ticketData'));
    } else {
      submitTicketPesponse = yield call(reserveBooking, get(action, 'payload.ticketData'));
    }
    // const bookingInfo = yield call(getBookingInfo, {
    //   code: get(submitTicketPesponse, 'data.code'),
    // }, lang);
    // console.log('router', Router);
    yield put({
      type: SUBMIT_TICKET_SUCCESS,
      payload: {
        bookingCode: get(submitTicketPesponse, 'data.booking_code'),
        // tripId: get(bookingInfo, 'data[0].trip_id'),
      },
    });
    Router.pushRoute('payment', {
      lang,
      booking_code: get(submitTicketPesponse, 'data.booking_code'),
    });
  } catch (err) {
    const error = get(err, 'response.data.error');
    yield put({
      type: SUBMIT_TICKET_ERROR,
      error,
    });
  }
}

function* getTripInfoDetailSaga(action) {
  try {
    const payload = get(action, 'payload', {});
    const companyImages = yield call(getCompanyImage, { company_id: payload.company_id });
    const cancellationPolicyData = yield call(
      getCancellationPolicy,
      { trip_code: payload.trip_code },
    );
    const utilities = yield call(getCompanyUtility, { company_id: payload.company_id });
    const companyInfo = yield call(getCompanyInfo, { company_id: payload.company_id });
    const companyReviews = yield call(
      getCompanyReview,
      { company_id: payload.company_id, skip: payload.skip },
    );
    const locale = yield select(getLocale);
    const cancellationPolicy = normalizeCancellationPolicy(
      cancellationPolicyData,
      payload.timeDeparture,
      locale,
    );
    yield put(getTripInfoDetailSuccess({
      companyImages: companyImages.data,
      cancellationPolicy,
      utilities: utilities.data,
      companyInfo: companyInfo.data,
      companyReviews: normalizeTripInfoReviews(companyReviews.data),
    }));
  } catch (err) {
    const error = get(err, 'response.data.error');
    yield put(getTripInfoDetailError(error));
  }
}

function* getTripReviewSaga(action) {
  try {
    const response = yield call(getCompanyReview, action.payload);
    yield put(getTripReviewsSuccess(normalizeTripInfoReviews(response.data)));
    return;
  } catch (err) {
    yield put(getTripReviewsError({ message: err }));
  }
}

function* root() {
  yield takeLatest(GET_TRIP_CODE_INFO, getTripInfoSaga);
  yield takeLatest(SUBMIT_TICKET, submitTicketSaga);
  yield takeLatest(GET_TRIP_INFO_DETAIL, getTripInfoDetailSaga);
  yield takeLatest(GET_TRIP_REVIEWS, getTripReviewSaga);
}

export default root;
