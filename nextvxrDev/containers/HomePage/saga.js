// import {
//   call, put, takeLatest, select,
// } from 'redux-saga/effects';
// import get from 'lodash.get'
// import { GET_BANNERS, GET_BANNERS_FAIL, GET_BANNERS_SUCCESS } from './constants';
// import { mapFromAPI } from '#/utils/api/mapping/bannerNormalize'
// import { getHomeBanners } from '#/utils/api/home';
// import { appendLeadingZeroes } from '#/utils/stringUtils';
// import { BANNER_PAGE } from '#/utils/constants';

// const getLocale = state => state.device.locale;


// function* getHomeBannersSaga() {
//   try {
//     const today = new Date();
//     const response = yield call(
//       getHomeBanners,
//       {
//         date: `${today.getFullYear()}-${appendLeadingZeroes(today.getMonth() + 1)}-${today.getDate()}`,
//         page: BANNER_PAGE.HOME_PAGE,
//       },
//     );
//     const locale = yield select(getLocale)
//     // console.log('response', response.data[0].Images);
//     const banners = mapFromAPI(response, locale)
//     console.log('banners', banners);
//     yield put({ type: GET_BANNERS_SUCCESS, banners })
//   } catch (err) {
//     yield put({
//       type: GET_BANNERS_FAIL, error: get(err, 'response.data', { code: 1 }),
//     })
//   }
// }

// function* root() {
//   return;
// }

// export default root;
