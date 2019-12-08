import { combineReducers } from 'redux';
// import { authReducer } from 'vrx-auth-reducer';
// import { appWrapperReducer } from 'vrx-app-reducer';
import { reducer as formReducer } from 'redux-form';
import device from '#/containers/Device/reducer';
import routeReducer from '#/containers/Route/reducer';
import seoReducer from '#/containers/SEO/reducer';
import homeReducer from '#/containers/HomePage/reducer';
import bookingReducer from '#/containers/Booking/reducer';
import bookingCompanyDetailReducer from '#/containers/BookingCompanyDetail/reducer';
import paymentReducer from '#/containers/Payment/reducer';
import paymentResultsReducer from '#/containers/PaymentResults/reducer';
import bannerReducer from '#/containers/Banner/reducer';
import ccumReducer from '#/containers/ChapCanhUocMo/reducer';

export default () => combineReducers({
  form: formReducer,
  routeReducer,
  device,
  seoReducer,
  homeReducer,
  bookingReducer,
  bookingCompanyDetailReducer,
  paymentReducer,
  paymentResultsReducer,
  bannerReducer,
  ccumReducer,
});
