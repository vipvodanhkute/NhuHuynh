import get from 'lodash.get';
import find from 'lodash.find';
import moment from 'moment';
import {
  GET_TRIP_CODE_INFO_SUCCESS,
  GET_TRIP_CODE_INFO_ERROR,
  UPDATE_BOOKING_DATA,

  UPDATE_OPEN_ALERT_MESSAGE,
  RESET_BOOKING_DATA,
  BOOKING_TYPE,
  SUBMIT_TICKET_SUCCESS,
  SUBMIT_TICKET_ERROR,
  GET_VXR_HOTLINE_SUCCESS,
  GET_VXR_HOTLINE_ERROR,
  RESET_TRIP_INFO_DATA,
  MASK_SEAT_TYPE,
  SEAT_TYPE_VALUE,
  GET_COUNTRY_CODE_RESOURCE_SUCCESS,
  GET_COUNTRY_CODE_RESOURCE_ERROR,
  GET_TRIP_INFO_DETAIL_SUCCESS,
  GET_TRIP_INFO_DETAIL_ERROR,
  GET_TRIP_REVIEWS_SUCCESS,
  GET_TRIP_REVIEWS_ERROR,
  RESET_TRIP_DETAIL_DATA,
} from './constants';
import {
  SEAT_TYPE,
  VEHICLE_QUALITY,
  LANG,
} from '#/utils/constants';

const initState = {
  tripInfo: null,
  bookingData: {
    seatData: {},
    seatBookingData: {
      totalPrice: 100000,
      totalTickets: 1,
      ticketPrice: 100000,
      maxBookingTicket: 6,
      minBookingTicket: 1,
    },
    customerInfo: typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('customerInfo')) : {},
  },
  visibleBookingSumary: false,
  nextStep: null,
  openAlertMessage: true,
  booking_type: '',
  vxrHotline: {},
  bookingCreated: undefined,
  tripInfoDetail: {},
};

const getTimeValue = strDateTime => strDateTime.split(' ')[0];

const formatTripInfo = response => ({
  operator: response.data.operator,
  route: get(response, 'data.route'),
  area: get(response, 'data.area'),
  tripName: `${get(response, 'data.route.departure.time')} • ${get(
    response,
    'data.area.from.name',
  )} - ${get(response, 'data.area.to.name')}`,
  seatType: SEAT_TYPE[get(response, 'data.route.vehicle_seat_type')],
  vehicleQuanlity: VEHICLE_QUALITY[get(response, 'data.route.vehicle_quality')],
  ratings: get(response, 'data.operator.ratings'),
  hotline:
    get(response, 'data.selling_type') === BOOKING_TYPE.DEFAULT
      ? get(response, 'data.default_info.branches', [])
      : get(response, 'data.calling_info.hotline', []),
  dateDeparture: moment(
    get(response, 'data.online_info.departure_time'),
    'HH:mm DD-MM-YYYY',
  ).format('DD/MM/YYYY'),
  eatingFare: get(response, 'data.online_info.eating_fare'),
  isNotSeatCode: get(response, 'data.online_info.is_not_seat_code'),
  isDeposit: get(response, 'data.online_info.deposit_selling'),
});

const formatBookingType = response => get(response, 'data.selling_type');

const formatSeatTemplate = (response) => {
  const coach_seat_template = get(response, 'data.online_info.coach_seat_template');
  const mask_info = get(response, 'data.online_info.mask_info');

  if (mask_info) {
    const maskTemplateResult = get(response, 'data.online_info.coach_seat_template').map((templateItem, index) => {
      let maskSeatResult = [];
      maskSeatResult = coach_seat_template[index].seats.map(coachItem => ({
        ...coachItem,
        ...{
          mask_row: coachItem.row_num + mask_info.mask_x - 1,
          mask_col: coachItem.col_num + mask_info.mask_y - 1,
        },
      }));

      mask_info.model[index].seat.forEach((maskItem) => {
        maskItem.value.forEach((itemValue, indexMask) => {
          if (itemValue !== 0) {
            const seatPosition = find(
              maskSeatResult, { mask_row: maskItem.row, mask_col: indexMask + 1 },
            )
            if (!seatPosition) {
              maskSeatResult.push({
                mask_row: maskItem.row,
                mask_col: indexMask + 1,
                seat_type: SEAT_TYPE_VALUE[MASK_SEAT_TYPE[itemValue]],
              })
            }
          }
        })
      })

      return {
        ...templateItem,
        ...{
          mask_row: mask_info.row, // templateItem.num_rows + mask_info.mask_x - 1,
          mask_col: mask_info.col, // templateItem.num_cols + mask_info.mask_y - 1,
          seats: maskSeatResult,
        },
      }
    });
    return maskTemplateResult;
  }
  return get(response, 'data.online_info.coach_seat_template');
};

const sortListPointByTime = listPoint => listPoint.sort((a, b) => {
  const time1 = moment(a.real_time, 'HH:mm DD-MM-YYYY');
  const time2 = moment(b.real_time, 'HH:mm DD-MM-YYYY');
  return time1.diff(time2);
});

const formatAreaPoints = (response, lang) => {
  const listPickupPoints = get(response, 'data.online_info.pickup_points', []).map(pickUpPoint => ({
    ...pickUpPoint,
    isEdit: false,
    time: getTimeValue(get(pickUpPoint, 'real_time', '')),
    limitTicket: pickUpPoint.min_customer || 1,
  }));

  const listTransferPickupPoints = get(response, 'data.online_info.transfer_points', []).map(
    transferPoint => ({
      ...transferPoint,
      isEdit: false,
      time: getTimeValue(get(transferPoint, 'real_time', '')),
      limitTicket: transferPoint.min_customer || 1,
      transfer: 1,
    }),
  );

  const listDropOffPoints = get(response, 'data.online_info.drop_off_points_at_arrive', []).map(
    dropOffPoint => ({
      ...dropOffPoint,
      isEdit: false,
      time: getTimeValue(get(dropOffPoint, 'real_time', '')),
      limitTicket: dropOffPoint.min_customer || 1,
    }),
  );

  const listTransferDropOffPoints = get(
    response,
    'data.online_info.transfer_points_at_arrive',
    [],
  ).map(transferDropOffPoint => ({
    ...transferDropOffPoint,
    isEdit: false,
    time: getTimeValue(get(transferDropOffPoint, 'real_time', '')),
    limitTicket: transferDropOffPoint.min_customer || 1,
    transfer: 1,
  }));
  const is_concat_two_list_point = lang === LANG.EN && get(response, 'data.online_info.is_hide_pickup_version_english')
  return {
    pickupPoints: is_concat_two_list_point
      ? sortListPointByTime(listPickupPoints)
      : sortListPointByTime(listPickupPoints.concat(listTransferPickupPoints)),
    dropOffPoints: is_concat_two_list_point
      ? sortListPointByTime(listDropOffPoints)
      : sortListPointByTime(listDropOffPoints.concat(listTransferDropOffPoints)),
  };
};

const formatSeatBookingData = response => ({
  totalPrice: get(response, 'data.online_info.fare'),
  totalTickets: 1,
  ticketPrice: get(response, 'data.online_info.fare'),
  maxBookingTicket: get(response, 'data.online_info.max_total_seats'),
  minBookingTicket: 1,
  original: get(response, 'data.online_info.coach_seat_template[0].seats[0].fares.original'),
});

const formatBookingData = (response, state) => {
  const areaSelectionValue = get(state, 'bookingData.areaSelectionValue')
    ? get(state, 'bookingData.areaSelectionValue')
    : {};
  initState.bookingData.areaSelectionValue = areaSelectionValue;
  const seatData = get(state, 'bookingData.seatData') ? get(state, 'bookingData.seatData') : [];
  const seatBookingDataObj = get(state, 'bookingData.seatBookingData')
    ? get(state, 'bookingData.seatBookingData')
    : formatSeatBookingData(response);
  return Object.assign(
    {},
    initState.bookingData,
    { seatData },
    { areaSelectionValue },
    { seatBookingData: seatBookingDataObj },
  );
};

export default (state = {}, action) => {
  switch (action.type) {
    case GET_TRIP_CODE_INFO_SUCCESS: {
      const booking_type = formatBookingType(action.response);
      const tripInfo = formatTripInfo(action.response);
      const seatTemplate = formatSeatTemplate(action.response);
      const areaPoints = formatAreaPoints(action.response, action.payload.lang);
      const bookingData = formatBookingData(action.response, state);

      return Object.assign({}, state, {
        tripInfo,
        booking_type,
        seatTemplate,
        areaPoints,
        bookingData,
        vxrHotline: {},
        openAlertMessage: get(action.response, 'data.online_info.unchoosable'),
        error: {},
      });
    }
    case GET_TRIP_CODE_INFO_ERROR: {
      const error = get(action, 'error');
      return Object.assign({}, state, { error });
    }
    case UPDATE_BOOKING_DATA: {
      return Object.assign({}, state, { bookingData: action.payload });
    }
    case UPDATE_OPEN_ALERT_MESSAGE: {
      return Object.assign({}, state, { openAlertMessage: action.payload });
    }
    case RESET_BOOKING_DATA: {
      return {};
    }
    case SUBMIT_TICKET_SUCCESS: {
      return Object.assign({}, state, { bookingCreated: action.payload });
    }
    case SUBMIT_TICKET_ERROR: {
      const error = get(action, 'error');
      return Object.assign({}, state, { error });
    }
    case GET_VXR_HOTLINE_SUCCESS: {
      return Object.assign({}, state, { vxrHotline: action.response.data });
    }
    case GET_VXR_HOTLINE_ERROR: {
      const error = get(action, 'error');
      return Object.assign({}, state, { error });
    }
    case RESET_TRIP_INFO_DATA: {
      return Object.assign({}, state, { tripInfo: null });
    }
    case GET_COUNTRY_CODE_RESOURCE_SUCCESS: {
      return Object.assign({}, state, { contryCodeResource: action.payload });
    }
    case GET_COUNTRY_CODE_RESOURCE_ERROR: {
      const error = get(action, 'error');
      return Object.assign({}, state, { error });
    }
    case GET_TRIP_INFO_DETAIL_SUCCESS: {
      return Object.assign({}, state, { tripInfoDetail: action.payload });
    }
    case GET_TRIP_INFO_DETAIL_ERROR: {
      const error = get(action, 'error');
      return Object.assign({}, state, { error });
    }
    case GET_TRIP_REVIEWS_SUCCESS: {
      const reviewsItems = get(action, 'payload.items', []);
      const oldReviews = get(state, 'tripInfoDetail.companyReviews');
      const newReviewsItems = oldReviews.items.concat(reviewsItems);
      const newReviews = Object.assign({}, get(action, 'payload'), { items: newReviewsItems });
      return Object.assign(
        {},
        state,
        {
          tripInfoDetail: {
            ...state.tripInfoDetail,
            ...{ companyReviews: newReviews },
          },
        },
      );
    }
    case GET_TRIP_REVIEWS_ERROR: {
      const error = get(action, 'error');
      return Object.assign({}, state, { error });
    }
    case RESET_TRIP_DETAIL_DATA: {
      return Object.assign(
        {},
        state,
        {
          tripInfoDetail: {},
        },
      );
    }
    default:
      return state;
  }
};
