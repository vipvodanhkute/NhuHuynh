import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import get from 'lodash.get'
import {
  GET_SPONSOR_OPERATOR,
  GET_SPONSOR_OPERATOR_FAIL,
  GET_SPONSOR_OPERATOR_SUCCESS,
} from './constants';
import { getSponsorOperator } from '#/utils/api/ccum';
import { mapFromAPI } from '#/utils/api/mapping/ccumNormalize'

function* getSponsorOperatorSaga() {
  try {
    const response = yield call(getSponsorOperator)
    const sponsors = mapFromAPI(response.data);
    yield put({ type: GET_SPONSOR_OPERATOR_SUCCESS, sponsors })
  } catch (err) {
    yield put({
      type: GET_SPONSOR_OPERATOR_FAIL, error: get(err, 'response.data', { code: 1 }),
    })
  }
}

function* root() {
  yield takeLatest(GET_SPONSOR_OPERATOR, getSponsorOperatorSaga)
}

export default root;
