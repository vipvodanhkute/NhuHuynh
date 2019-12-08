import { all } from 'redux-saga/effects';
import Route from './containers/Route/saga';
import Login from './containers/Login/saga';
import Booking from './containers/Booking/saga';
import BookingCompanyDetail from './containers/BookingCompanyDetail/saga';
import SEO from './containers/SEO/saga';
// import Home from './containers/HomePage/saga';
import Payment from './containers/Payment/saga';
import PaymentResults from './containers/PaymentResults/saga';
import Banner from './containers/Banner/saga';
import Ccum from './containers/ChapCanhUocMo/saga';

export default function* AppSaga() {
  yield all([
    Route(),
    Login(),
    Booking(),
    BookingCompanyDetail(),
    SEO(),
    // Home(),
    Payment(),
    PaymentResults(),
    Banner(),
    Ccum(),
  ]);
}
