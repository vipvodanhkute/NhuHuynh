import { STORE_DEVICE_INFO } from './constants';

export function storeDeviceInfo(data) {
  return {
    type: STORE_DEVICE_INFO,
    payload: {
      data,
    },
  };
}

export const sendEventTracking = payload => ({
  type: payload.type,
  payload,
});
