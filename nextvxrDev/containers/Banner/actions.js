import {
  GET_BANNERS,
} from './constants'

export const getBanners = payload => ({
  type: GET_BANNERS,
  payload,
})
