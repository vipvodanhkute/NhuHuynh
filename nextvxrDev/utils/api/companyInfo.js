import format from 'string-template';
import request from '#/utils/request';
import { API_ROUTE } from '#/utils/api.routes';

const COMPANY_TYPE = 2;
const LIMIT_REVIEW_ITEM = 5;

export const getCompanyImage = params => request({
  url: format(API_ROUTE.GET_COMPANY_IMAGES, { company_id: params.company_id }),
  options: {
    method: 'GET',
  },
});

export const getCancellationPolicy = params => request({
  url: format(API_ROUTE.GET_CANCELLATION_POLICY),
  options: {
    method: 'GET',
    params: { trip_code: params.trip_code },
  },
});

export const getCompanyUtility = params => request({
  url: format(API_ROUTE.GET_COMPANY_UTILITY, { compId: params.company_id }),
  options: {
    method: 'GET',
    params: { type: COMPANY_TYPE },
  },
});

export const getCompanyInfo = params => request({
  url: format(API_ROUTE.GET_COMPANY_INFO, { company_id: params.company_id }),
  options: {
    method: 'GET',
  },
});

export const getCompanyReview = params => request({
  url: format(
    API_ROUTE.GET_COMPANY_REVIEW,
    {
      company_id: params.company_id,
      limit: LIMIT_REVIEW_ITEM,
      skip: params.skip,
    },
  ),
  options: {
    method: 'GET',
  },
});
