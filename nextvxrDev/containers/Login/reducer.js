import { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR } from './constants';
import User from '#/Model/User';


const initState = {
  user: new User(),
  routes: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case LOGIN: {
      // const { query } = action.payload;
      console.log('LOGIN', action);
      return {
        ...state,
      };
    }
    case LOGIN_SUCCESS: {
      // const { query } = action.payload;
      console.log('LOGIN_SUCCESS', action);
      const user = new User().loadInfo();
      return {
        ...state,
        user,
        // routes: action.

      };
    }
    case LOGIN_ERROR: {
      // const { query } = action.payload;
      console.log('LOGIN_ERROR', action);
      return {
        ...state,
        // routes: action.

      };
    }
    default:
      return state;
  }
}
