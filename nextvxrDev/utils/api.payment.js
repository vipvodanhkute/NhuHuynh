import { URL } from '#/utils/constants';

const MAIN_API = URL.MAIN;
const VGATE_API = URL.VGATE;
const VER_3 = 'v3';
const VER_1 = 'v1';

export const API_PAYMENT = {
  GET_IB_BANKS: `${VGATE_API}/${VER_1}/bank`,
  GET_TRANSFER_BANKS: `${MAIN_API}/${VER_3}/resource/bank`,
  GET_PAYMENT_METHODS: `${MAIN_API}/${VER_3}/payment_method`,
  CHECK_COUPON: `${MAIN_API}/${VER_3}/campaign/coupon`,
  PAYMENT_ORDER: `${VGATE_API}/${VER_1}/order`,
  TERM: `${MAIN_API}/${VER_1}/term`,
  CANCEL_BOOKING: `${MAIN_API}/${VER_3}/booking/{code}/refund/{status}`,
};
