import request from '#/utils/request';
import format from 'string-template';
import { API_ROUTE } from '#/utils/api.routes';

export const getSponsorOperator = () => request({
    url: API_ROUTE.GET_SPONSOR_OPERATOR,
    options: {
      method: 'GET',
    },
});
