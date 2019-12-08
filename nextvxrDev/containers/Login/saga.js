import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import { LOGIN } from './constants';

import { loginError, loginSuccess } from './actions';

import request from '#/utils/request';

function* fetch(action) {
  const { query } = action.payload;
  try {
    // const requestURL = `/api/v3/route?${qs.stringify(action.payload.query, { encode: false })}`
    const requestURL = 'https://jsonplaceholder.typicode.com/todos/1'
    const response = yield call(request, requestURL, {
      method: 'POST',
      data: query,
      headers: {
        // Authorization: `Bearer ${privateToken}`,
        // 'Content-Type': 'application/json',
        'X-Name': 'VXR',
      },
    })
    yield put(loginSuccess({ response }));
  } catch (err) {
    yield put(loginError({ error: err }));
  }
}

function* root() {
  yield takeLatest(LOGIN, fetch);
}

export default root;
