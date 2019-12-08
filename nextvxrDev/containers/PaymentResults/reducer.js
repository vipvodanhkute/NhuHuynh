// import get from 'lodash.get';
import {
  GET_BOOKING_INFO_SUCCESS,
  GET_BOOKING_INFO_ERROR,
} from './constants';

const initState = {
  bookingInfo: {},
  error: {},
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_BOOKING_INFO_SUCCESS: {
      // console.log('GET_BOOKING_INFO_SUCCESS', action.response)
      return {
        ...state,
        bookingInfo: action.response,
      };
    }
    case GET_BOOKING_INFO_ERROR: {
      return {
        ...state,
        error: action.response,
      };
    }
    default:
      return state;
  }
}
