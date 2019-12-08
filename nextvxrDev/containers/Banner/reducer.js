import get from 'lodash.get';
import {
  GET_BANNERS_SUCCESS,
} from './constants';

const initialState = {
  banners: {
    main: undefined,
    promotions: [],
  },
};

export default (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case '@@INIT':
    case '@@redux/INIT':
      return initialState;
    case GET_BANNERS_SUCCESS: {
      const mainBanner = action.banners.filter(x => x.Type === '1');
      const promotionBanners = action.banners.filter(x => x.Type === '2');
      return { ...state, banners: { main: mainBanner, promotions: promotionBanners } };
    }
    default:
      return state
  }
}
