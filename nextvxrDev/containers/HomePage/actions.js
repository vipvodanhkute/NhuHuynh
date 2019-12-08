import {
  LOADING,
  FINISH_LOADING,
  UPDATE_PAYLOAD,
  GET_BANNERS,

} from './constants'


export const loading = () => ({
  type: LOADING,
});

export const finishLoading = () => ({
  type: FINISH_LOADING,
});

export const updatePayload = payload => ({
  type: UPDATE_PAYLOAD,
  payload,
})

export const getHomeBanners = () => ({
  type: GET_BANNERS,
})
