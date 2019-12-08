
import GoogleTagManager from '@redux-beacon/google-tag-manager';
import GoogleAnalytics from '@redux-beacon/google-analytics';
import moment from 'moment';
import 'moment-timezone';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createMiddleware } from 'redux-beacon';
import eventGTMMap from '#/utils/eventGTMMap';
import eventGAMap from '#/utils/eventGAMap';
import reducer from './reducer';
import rootSaga from './saga';
import clientMiddleware from '#/utils/middleware/clientMiddleware';

require('moment/locale/vi');

moment.tz.setDefault('Asia/Ho_Chi_Minh');

const initState = {};
const sagaMiddleware = createSagaMiddleware();
const gtmMiddleware = createMiddleware(eventGTMMap, GoogleTagManager());

const ga = GoogleAnalytics();
const gaMiddleware = createMiddleware(eventGAMap, ga);
// const env = `window.ENV = '${process.env.ENV || 'development'}';`;

export default (initialState = initState) => {
  const middlewares = [
    clientMiddleware(),
    sagaMiddleware,
    gtmMiddleware,
    gaMiddleware,
  ];

  const enhancers = [applyMiddleware(...middlewares)];
  const store = createStore(reducer(), initialState, ...enhancers);

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  }
  store.runSagaTask();

  return store;
}
