import clonedeep from 'lodash.clonedeep'
import get from 'lodash.get'
import {
  call, put, takeLatest, all, takeEvery,
} from 'redux-saga/effects';
import {
  GET_ROUTE, GET_ROUTES, GET_TOTAL_TRIP, POST_BUS_OPERATOR,
  PRODUCT_IMPRESSION,
} from './constants';

import {
  getRouteSuccess,
  getRouteError,
  getRoutesError,
  getTotalRouteSuccess,
  getTotalRouteError,
  getStatusRouteSuccess,
  getStatusRouteError,
  getTotalTripWithFilterSuccess,
  getTotalTripWithFilterError,
  postNewBusOperatorFail,
  postNewBusOperatorSuccess,
} from './actions';
import {
  getListRoute,
  getTotalListRoute,
  payloadToParams,
  getStatusListRoute,
  getTotalTrip,
  postNewBusOperator,
} from '#/utils/api/route';

import { mapFromAPI } from '#/utils/api/mapping/ticketNormalize';
import { mapAreaFromRouteAPI } from '#/utils/api/mapping/areaNormalize'
import { sendEventTracking } from '../Device/actions';

function* getRoute(action) {
  try {
    const response = yield call(getListRoute, action.payload);
    const tickets = mapFromAPI(response);
    const area = mapAreaFromRouteAPI(response.area)

    yield put(getRouteSuccess({ tickets, payload: action.payload, area }));
    if (action.payload.isLoadMore) {
      yield put(sendEventTracking({
        type: PRODUCT_IMPRESSION,
        tickets: response.data,
        from: get(action, 'payload.from'),
        to: get(action, 'payload.to'),
      }))
    }
    return tickets;
  } catch (err) {
    yield put(getRouteError(err.response.data, action.payload));
    return undefined;
  }
}

function* getStatus(action) {
  try {
    const response = yield call(getStatusListRoute, action.payload);
    yield put(getStatusRouteSuccess({ status: response.status, payload: action.payload }));
  } catch (err) {
    yield put(getStatusRouteError(err.response.data));
  }
}

function* getTotalRoute(action) {
  try {
    const response = yield call(getTotalListRoute, action.payload);
    const data = { total: response.total, totalAvailableTrips: response.total_available_trips }
    yield put(getTotalRouteSuccess({ ...data, payload: action.payload }));
    return data;
  } catch (err) {
    yield put(getTotalRouteError(err.response.data));
    return { total: undefined, totalAvailableTrips: undefined };
  }
}

function* getRoutes(action) {
  try {
    const newPayload = clonedeep(action.payload)
    action.payload.suggestion.forEach((group) => {
      if (get(newPayload, `groups.${group}.page`)) {
        newPayload.groups[group].page = 1
      }
    })
    const params = payloadToParams(newPayload, action.filters)
    const results = yield all(params.map(item => all(
      [call(getTotalRoute, { payload: item }), call(getRoute, { payload: item })],
      // [call(getRoute, { payload: item })],
    )))

    const totalTicket = results.map(x => x[0].total || 0)
      .reduce((acc, cur) => acc + cur)
    const totalSeat = results.map((x) => {
      let availableSeats = 0;
      if (x[1] && x[1].length) {
        availableSeats += x[1].map(t => t.numberSeatAvailable).reduce(
          (acc, cur) => ((acc === undefined ? 1 : acc) + (cur === undefined ? 1 : cur)),
        )
      }
      return availableSeats
    }).reduce((acc, cur) => acc + cur)
    if (totalTicket === 0) {
      yield call(getStatus, { payload: newPayload })
    } else if (totalSeat === 0) {
      if (!action.isServer) {
        const tickets = results.map(x => x[1])[0]
        yield put(sendEventTracking({
          type: PRODUCT_IMPRESSION,
          tickets,
          from: get(action, 'payload.from'),
          to: get(action, 'payload.to'),
        }))
      }
      yield put(getStatusRouteSuccess({ status: 'SOLD_OUT', payload: newPayload }))
    } else {
      if (!action.isServer) {
        yield put(sendEventTracking({
          type: PRODUCT_IMPRESSION,
          tickets: get(results, '[0][1]'),
          from: get(action, 'payload.from'),
          to: get(action, 'payload.to'),
        }))
      }
      yield put(getStatusRouteSuccess({ status: 'NORMAL', totalTicket }))
    }
  } catch (err) {
    yield put(getRoutesError({ message: err }));
  }
}

function* getTotalTripSaga(action) {
  try {
    const params = payloadToParams(action.payload, action.filters)
    const response = yield call(getTotalTrip, params);
    if (response) {
      yield put(
        getTotalTripWithFilterSuccess({
          total: response.total,
          payload: action.payload,
        }),
      );
    }
  } catch (err) {
    yield put(
      getTotalTripWithFilterError({
        message: err,
      }),
    );
  }
}

function* postNewBusOperatorSaga(action) {
  try {
    yield call(postNewBusOperator, action.payload)
    yield put(postNewBusOperatorSuccess())
  } catch (err) {
    yield put(postNewBusOperatorFail())
  }
}

function* root() {
  yield takeLatest(GET_ROUTES, getRoutes);
  yield takeEvery(GET_ROUTE, getRoute);
  yield takeLatest(GET_TOTAL_TRIP, getTotalTripSaga);
  yield takeLatest(POST_BUS_OPERATOR, postNewBusOperatorSaga)
}

export default root;
