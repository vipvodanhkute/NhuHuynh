import {
  GET_SPONSOR_OPERATOR_SUCCESS,
} from './constants';

const initialState = {
  sponsors: [],
}
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SPONSOR_OPERATOR_SUCCESS: {
      return { ...state, sponsors: action.sponsors }
    }
    default:
      return state;
  }
}
