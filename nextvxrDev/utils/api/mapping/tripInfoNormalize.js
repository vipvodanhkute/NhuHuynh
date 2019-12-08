import {
  LANG,
} from '#/utils/constants';
import get from 'lodash.get';

const LOCALE_NAME = {
  'vi-VN': 'name',
  'en-US': 'english_name',
}

const LOCALE_ADDRESS = {
  'vi-VN': 'address',
  'en-US': 'english_address',
}

const getAreaByLocale = (areaPoint, locale) => ({
  ...areaPoint,
  ...{
    name: areaPoint[LOCALE_NAME[locale]] || areaPoint[LOCALE_NAME[LANG.VN]],
    address: areaPoint[LOCALE_ADDRESS[locale]] || areaPoint[LOCALE_ADDRESS[LANG.VN]],
  },
});

export const normalizeTripInfoData = (dataResponse, locale) => ({
  ...dataResponse,
  ...{
    route: {
      ...get(dataResponse, 'route', {}),
      ...{
        departure: getAreaByLocale(get(dataResponse, 'route.departure', {}), locale),
      },
    },
  },
  ...{
    online_info: get(dataResponse, 'online_info', null) ? {
      ...get(dataResponse, 'online_info'),
      ...{
        pickup_points: get(dataResponse, 'online_info.pickup_points').map(pointItem => getAreaByLocale(pointItem, locale)),
        transfer_points: get(dataResponse, 'online_info.transfer_points').map(pointItem => getAreaByLocale(pointItem, locale)),
        drop_off_points_at_arrive: get(dataResponse, 'online_info.drop_off_points_at_arrive').map(pointItem => getAreaByLocale(pointItem, locale)),
        transfer_points_at_arrive: get(dataResponse, 'online_info.transfer_points_at_arrive').map(pointItem => getAreaByLocale(pointItem, locale)),
      },
    } : null,
  },
  ...{
    register_info: get(dataResponse, 'register_info', null) ? {
      ...get(dataResponse, 'register_info'),
      ...{
        pickup_points: get(dataResponse, 'register_info.pickup_points').map(pointItem => getAreaByLocale(pointItem, locale)),
        transfer_points: get(dataResponse, 'register_info.transfer_points').map(pointItem => getAreaByLocale(pointItem, locale)),
        drop_off_points_at_arrive: get(dataResponse, 'register_info.drop_off_points_at_arrive').map(pointItem => getAreaByLocale(pointItem, locale)),
        transfer_points_at_arrive: get(dataResponse, 'register_info.transfer_points_at_arrive').map(pointItem => getAreaByLocale(pointItem, locale)),
      },
    } : null,
  },
})

export const normalizeTripInfoReviews = (dataResponse) => {
  const reviewItems = get(dataResponse, 'items', []).map(item => ({
    avatar: get(item, 'avatar'),
    userName: get(item, 'first_name'),
    dateTime: get(item, 'rating_date'),
    rating: get(item, 'overall_rating'),
    comment: get(item, 'comment'),
  }))

  return {
    ...dataResponse,
    ...{ items: reviewItems },
  }
}
