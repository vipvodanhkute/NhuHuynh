import request from '#/utils/request';
import { API_HOME } from '#/utils/api.home';

export const getHomeBanners = payload => request({
  url: API_HOME.GET_BANNERS,
  options: {
    method: 'GET',
    params: {
      date: payload.date,
      page: payload.page,
      raw: '1',
      scope: payload.scope,
    },
  },
});
