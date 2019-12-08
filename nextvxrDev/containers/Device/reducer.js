import { STORE_DEVICE_INFO } from './constants';

const initState = {
  isMobile: false,
  deviceName: undefined,
  locale: 'vi-VN',
};

export default function device(state = initState, action) {
  switch (action.type) {
    case STORE_DEVICE_INFO: {
      const { data: { isMobile, deviceName, locale } } = action.payload;
      return {
        ...state,
        isMobile,
        deviceName,
        locale,
      };
    }

    default:
      return state;
  }
}
