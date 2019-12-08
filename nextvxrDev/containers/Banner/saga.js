import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import get from 'lodash.get'
import {
  GET_BANNERS,
  GET_BANNERS_FAIL,
  GET_BANNERS_SUCCESS,
} from './constants';
import { mapFromAPI } from '#/utils/api/mapping/bannerNormalize'
import { getHomeBanners } from '#/utils/api/home';
import { appendLeadingZeroes } from '#/utils/stringUtils';

const getLocale = state => state.device.locale;


function* getBannersSaga(action) {
  try {
    const today = new Date();
    const response = yield call(
      getHomeBanners,
      {
        date: `${today.getFullYear()}-${appendLeadingZeroes(today.getMonth() + 1)}-${appendLeadingZeroes(today.getDate())}`,
        page: get(action, 'payload.page'),
        scope: get(action, 'payload.scope'),
        raw: get(action, 'payload.raw') || 1,
      },
    );
    const locale = yield select(getLocale)
    const banners = mapFromAPI(response, locale)
    yield put({ type: GET_BANNERS_SUCCESS, banners })
  } catch (err) {
    yield put({
      type: GET_BANNERS_FAIL, error: get(err, 'response.data', { code: 1 }),
    })
  }
}

function* root() {
  yield takeLatest(GET_BANNERS, getBannersSaga);
}

export default root;
