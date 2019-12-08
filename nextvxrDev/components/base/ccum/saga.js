import {
 takeEvery, call, put, select 
} from 'redux-saga/effects';
import getAPI from './function';


function* getAPICCUM() {
  const result = yield call(getAPI);
  const dataAPI = result.data;
  const dataChamp = Object.values(dataAPI)
  yield put({ type: 'dataCCUM', data: dataChamp })
// fork, take, call , put , takeLatest, delay, select
}
function* root() {
  yield takeEvery('loadCCUM', getAPICCUM)
}

export default root;
