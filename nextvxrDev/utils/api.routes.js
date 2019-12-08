import { URL } from '#/utils/constants';

const MAIN_API = URL.MAIN;
const ROUTE_API = URL.ROUTE;
const SEO_API = URL.SEO;
const VER_1 = 'v1';
const VER_2 = 'v2';
const VER_3 = 'v3';

export const API_ROUTE = {
  GET_LIST_ROUTE: `${ROUTE_API}/${VER_2}/route`,
  GET_SEAT_TEMPLATE: `${MAIN_API}/${VER_1}/trip/seats`,
  CREATE_BOOKING_TICKET: {
    PATH: '/booking/online/complete',
  },
  CREATE_AVAILABLE_SEATS: {
    PATH: '/trip/available_seats',
  },
  GET_TOTAL_ROUTE: `${ROUTE_API}/${VER_2}/route/total`,
  GET_STATUS_ROUTE: `${ROUTE_API}/${VER_2}/route/status`, // "NORMAL", "SOLD_OUT", "DEPARTED", "NOT_EXIST"
  GET_TOTAL_TRIP: `${ROUTE_API}/${VER_2}/route/total`,
  POST_NEW_BO: `${ROUTE_API}/${VER_1}/requestcompany`,
  GET_COMPANY_IMAGES: `${MAIN_API}/${VER_3}/company/{company_id}/image`,
  GET_CANCELLATION_POLICY: `${MAIN_API}/${VER_3}/cancellation/policy`,
  GET_TRIP_INFO: `${MAIN_API}/${VER_3}/trip/{trip_code}`,
  GET_COMPANY_UTILITY: `${MAIN_API}/${VER_1}/company/{compId}/utility`,
  GET_COMPANY_INFO: `${MAIN_API}/${VER_3}/company/{company_id}`,
  GET_COMPANY_REVIEW: `${MAIN_API}/${VER_3}/company/{company_id}/review?filter[limit]={limit}&&filter[skip]={skip}`,
  GET_SEO_DATA: `${SEO_API}/graphql`,
  POST_REGISTER_BOOKING: `${MAIN_API}/${VER_3}/booking/register`,
  POST_RESERVE_BOOKING: `${MAIN_API}/${VER_3}/booking/reserve`,
  GET_BOOKING_INFO: `${MAIN_API}/${VER_3}/booking`,
  GET_VXR_HOTLINE: `${MAIN_API}/${VER_3}/resource/hotline`,
  GET_COUNTRY_CODE: `${MAIN_API}/${VER_3}/resource/country`,
  GET_LIST_BANKS: `${MAIN_API}/${VER_3}/bank`,
  GET_LANDING_PAGE_BY_SLUG: `${MAIN_API}/${VER_1}/affiliate/landing_page`,
  GET_SPONSOR_OPERATOR: `${MAIN_API}/${VER_3}/ccum`,
};
