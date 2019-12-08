import { GET_SEO_DATA_FAIL, GET_SEO_DATA_SUCCESS } from '#/containers/SEO/constants'
import { STORE_DEVICE_INFO } from '#/containers/Device/constants';

const initialState = {
  seo: {
    title: '',
    metas: [],
    links: [],
    dataStructures: [],
    richSnippet: {},
  },
  seoBooking: {
    metas: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  },
  seoPayment: {
    metas: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  },
  seoPaymentResult: {
    metas: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  },
  locale: 'vi-VN',
};

export default (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case '@@INIT':
    case '@@redux/INIT': {
      return initialState
    }

    case STORE_DEVICE_INFO: {
      return Object.assign({}, state, { locale: action.payload.data.locale });
    }
    case GET_SEO_DATA_SUCCESS: {
      const newState = Object.assign({}, state, action.data)
      return newState
    }
    case GET_SEO_DATA_FAIL: {
      return state;
    }
    default:
      return state
  }
}
