import { call, put, takeLatest } from 'redux-saga/effects';
import {
  GET_SEO_DATA,
  GET_SEO_HOME,
  GET_SEO_COMPANIES,
  GET_SEO_COMPANIES_SUCCESS,
  GET_SEO_LANDING_PAGE,
  GET_SEO_LIMOUSINE,
} from './constants';

import { getSEODataFail, getSEODataSuccess } from './actions';
import {
  getSEODataFromAPI,
  getSEOHomeFromAPI,
  getSEOCompaniesFromAPI,
  getSEOLandingPageFromAPI,
  getSEOLimousineFromAPI,
} from '#/utils/api/seo';

function* getSEODataSaga(action) {
  try {
    const res = yield call(getSEODataFromAPI, action.payload);
    res.data.seo.richSnippet = JSON.parse(res.data.seo.richSnippet) || [];
    res.data.seo.dataStructures = JSON.parse(res.data.seo.dataStructures) || [];
    yield put(getSEODataSuccess(action.payload, res.data));
  } catch (err) {
    yield put(getSEODataFail(action.payload, err));
  }
}

function* getSEOCompaniesSaga(action) {
  try {
    const res = yield call(getSEOCompaniesFromAPI, action.payload);
    yield put({
      type: GET_SEO_COMPANIES_SUCCESS,
      companies: res.data.seo.companies,
    });
  } catch (err) {
    yield put(getSEODataFail(action.payload, err));
  }
}

function* getSEOHomeSaga(action) {
  try {
    const res = yield call(getSEOHomeFromAPI, action.payload);
    res.data.seoHome.dataStructures = JSON.parse(
      res.data.seoHome.dataStructures,
    );
    yield put(getSEODataSuccess(action.payload, { seo: res.data.seoHome }));
  } catch (err) {
    yield put(getSEODataFail(action.payload, err));
  }
}

function* getSEOLandingPage({ payload }) {
  try {
    const { slug, lang } = payload;
    const res = yield call(getSEOLandingPageFromAPI, { lang, slug });
    res.data.seoLandingPage.dataStructures = JSON.parse(
      res.data.seoLandingPage.dataStructures,
    );
    yield put(getSEODataSuccess(payload, { seo: res.data.seoLandingPage }));
  } catch (err) {
    yield put(getSEODataFail(payload, err));
  }
}

function* getSEOLimousineSaga({ payload }) {
  try {
    const res = yield call(getSEOLimousineFromAPI, payload);
    res.data.seoLimousine.dataStructures = JSON.parse(
      res.data.seoLimousine.dataStructures,
    );
    res.data.seoLimousine.richSnippet = JSON.parse(res.data.seoLimousine.richSnippet);
    yield put(getSEODataSuccess(payload, { seo: res.data.seoLimousine }));
  } catch (err) {
    yield put(getSEODataFail(payload, err));
  }
}

function* root() {
  yield takeLatest(GET_SEO_DATA, getSEODataSaga);
  yield takeLatest(GET_SEO_HOME, getSEOHomeSaga);
  yield takeLatest(GET_SEO_COMPANIES, getSEOCompaniesSaga);
  yield takeLatest(GET_SEO_LANDING_PAGE, getSEOLandingPage);
  yield takeLatest(GET_SEO_LIMOUSINE, getSEOLimousineSaga)
}

export default root;
