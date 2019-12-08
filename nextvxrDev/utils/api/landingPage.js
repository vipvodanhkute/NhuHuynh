import request from '#/utils/request';
import { API_ROUTE } from '#/utils/api.routes';

export const getLandingPageBySlug = slug => request({
  url: API_ROUTE.GET_LANDING_PAGE_BY_SLUG,
  options: {
    method: 'GET',
    params: { slug },
  },
});
