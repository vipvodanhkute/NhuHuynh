import get from 'lodash.get';
import {
  GET_COMPANY_INFO_SUCCESS,
  GET_COMPANY_INFO_ERROR,
  GET_COMPANY_IMAGE_SUCCESS,
  GET_COMPANY_IMAGE_ERROR,
  GET_CANCELLATION_POLICY_SUCCESS,
  GET_CANCELLATION_POLICY_ERROR,
  GET_COMPANY_UTILITY_SUCCESS,
  GET_COMPANY_UTILITY_ERROR,
  GET_COMPANY_SUMMARY_INFO_SUCCESS,
  GET_COMPANY_SUMMARY_INFO_ERROR,
  GET_COMPANY_REVIEW_SUCCESS,
  GET_COMPANY_REVIEW_ERROR,
  CLEAR_COMPANY_REVIEW_DATA,
} from './constants';

const initState = {
  companyInfo: {},
  utilities: {},
  cancellationPolicy: {},
  reviews: {},
  images: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_COMPANY_INFO_SUCCESS: {
      return {
        ...state,
        tripInfo: action.response,
      };
    }
    case GET_COMPANY_INFO_ERROR: {
      return {
        ...state,
        tripInfo: action.response,
      };
    }
    case GET_COMPANY_IMAGE_SUCCESS: {
      return {
        ...state,
        images: get(action.response, 'data'),
      };
    }
    case GET_COMPANY_IMAGE_ERROR: {
      return {
        ...state,
        images: action.response,
      };
    }
    case GET_CANCELLATION_POLICY_SUCCESS: {
      return {
        ...state,
        cancellationPolicy: get(action, 'payload'),
      };
    }
    case GET_CANCELLATION_POLICY_ERROR: {
      return {
        ...state,
        cancellationPolicy: action.response,
      };
    }
    case GET_COMPANY_UTILITY_SUCCESS: {
      const utilities = get(action, 'payload.data', []).map(item => ({
        name: item.name,
        id: item.id,
      }));

      return {
        ...state,
        utilities,
      };
    }
    case GET_COMPANY_UTILITY_ERROR: {
      return {
        ...state,
        utilities: action.response,
      };
    }
    case GET_COMPANY_SUMMARY_INFO_SUCCESS: {
      return {
        ...state,
        companyInfo: get(action.response, 'data'),
      };
    }
    case GET_COMPANY_SUMMARY_INFO_ERROR: {
      return {
        ...state,
        companyInfo: action.response,
      };
    }
    case GET_COMPANY_REVIEW_SUCCESS: {
      const reviewData = get(action, 'response.data', {});
      const newReviews = get(action, 'response.data.items', []).map(item => ({
        avatar: get(item, 'avatar'),
        userName: get(item, 'first_name'),
        dateTime: get(item, 'rating_date'),
        rating: get(item, 'overall_rating'),
        comment: get(item, 'comment'),
      }))
      const items = get(state, 'reviews.items', []).concat(newReviews);

      return {
        ...state,
        reviews: {
          ...reviewData,
          ...{ items },
        },
      };
    }
    case GET_COMPANY_REVIEW_ERROR: {
      return {
        ...state,
        reviews: action.response,
      };
    }
    case CLEAR_COMPANY_REVIEW_DATA: {
      return {
        ...state,
        reviews: {},
      };
    }
    default:
      return state;
  }
}
