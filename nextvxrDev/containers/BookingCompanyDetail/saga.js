import moment from 'moment'
import {
  call,
  put,
  takeLatest,
  all, // all, takeEvery,
  select,
} from 'redux-saga/effects';
import {
  GET_COMPANY_INFO,
  GET_COMPANY_REVIEW,
  GET_CANCELLATION_POLICY,
} from './constants';
import {
  getCompanyImageSuccess,
  getCompanyImageError,
  getCancellationPolicySuccess,
  getCancellationPolicyError,
  getCompanyUtilitySuccess,
  getCompanyUtilityError,
  getCompanySummaryInfoSuccess,
  getCompanySummaryInfoError,
  getCompanyReviewSuccess,
  getCompanyReviewError,
} from './actions';
import {
  getCompanyImage,
  getCancellationPolicy,
  getCompanyUtility,
  getCompanyInfo,
  getCompanyReview,
} from '#/utils/api/companyInfo';
import {
  getTripCodeInfo,
} from '#/utils/api/booking';
import { normalizeCancellationPolicy } from '#/utils/api/mapping/cancellationPolicyNormalize'

function* getCompanyUtilitySaga(action) {
  try {
    const response = yield call(getCompanyUtility, action.payload);
    // console.log('response', response)
    yield put(getCompanyUtilitySuccess(response));
    return;
  } catch (err) {
    yield put(getCompanyUtilityError({ message: err }));
  }
}

function* getCompanyImageSaga(action) {
  try {
    const response = yield call(getCompanyImage, action.payload);
    yield put(getCompanyImageSuccess(response));
    return;
  } catch (err) {
    yield put(getCompanyImageError({ message: err }));
  }  
}

function* getCancellationPolicySaga(action) {
  try {
    let { payload: { timeDeparture } } = action
    const response = yield call(getCancellationPolicy, action.payload);
    if (!action.payload.timeDeparture) {
      const tripCodeInfo = yield call(getTripCodeInfo,
        {
          trip_code: action.payload.trip_code,
          from: action.payload.from,
          to: action.payload.to,
        })
      timeDeparture = moment(tripCodeInfo.data.route.departure_date);
    }
    const locale = yield select(state => state.device.locale)
    const cancellationPolicy = normalizeCancellationPolicy(response, timeDeparture, locale)
    yield put(getCancellationPolicySuccess(cancellationPolicy));
    return;
  } catch (err) {
    yield put(getCancellationPolicyError({ message: err }));
  }
}

function* getCompanySummaryInfoSaga(action) {
  try {
    const response = yield call(getCompanyInfo, action.payload);
    yield put(getCompanySummaryInfoSuccess(response));
    return;
  } catch (err) {
    yield put(getCompanySummaryInfoError({ message: err }));
  }
}

function* getCompanyInfoSaga(action) {
  try {
    yield all([
      call(getCompanySummaryInfoSaga, { payload: action.payload }),
      call(getCompanyImageSaga, { payload: action.payload }),
      call(getCancellationPolicySaga, { payload: action.payload }),
      call(getCompanyUtilitySaga, { payload: action.payload }),
    ]);
    // console.log('results', results)
    // return;
  } catch (err) {
    yield put(getCompanyImageError({ message: err }));
  }
}

function* getCompanyReviewSaga(action) {
  try {
    const response = yield call(getCompanyReview, action.payload);
    yield put(getCompanyReviewSuccess(response));
    return;
  } catch (err) {
    yield put(getCompanyReviewError({ message: err }));
  }
}

function* root() {
  yield takeLatest(GET_COMPANY_INFO, getCompanyInfoSaga);
  yield takeLatest(GET_COMPANY_REVIEW, getCompanyReviewSaga);
  yield takeLatest(GET_CANCELLATION_POLICY, getCancellationPolicySaga)
}

export default root;
