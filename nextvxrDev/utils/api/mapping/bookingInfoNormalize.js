import get from 'lodash.get';
// import isEmpty from 'lodash.isEmpty';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
import { LANG, API_MAP_KEY } from '#/utils/constants';
import Areas from '#/static/json/search_area';

const LOCALE_NAME = {
  'vi-VN': 'name',
  'en-US': 'english_name',
};

const LANG_FORMAT = {
  'vi-VN': 'vi',
  'en-US': 'en',
}

const VXR_OFFICE_TYPE = {
  '1': 'SOUTH',
  '2': 'NORTH',
}

// const LOCALE_ADDRESS = {
//   'vi-VN': 'address',
//   'en-US': 'english_address',
// }
function formatLocationUrl(locationStr) {
  return locationStr.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    '-',
  );
}

function locdau(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // str = str.replace(
  //   /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
  //   '-'
  // );
  /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
  // str = str.replace(/-+-/g, '-'); //thay thế 2- thành 1-
  // str = str.replace(/^\-+|\-+$/g, '');
  // cắt bỏ ký tự - ở đầu và cuối chuỗi
  return str;
}

export const getTripRouteUrl = (fromState, toState, lang, date, isReturn) => {
  let startPointValue = formatLocationUrl(locdau(fromState.Name));
  let stopPointValue = formatLocationUrl(locdau(toState.Name));
  const numberOfTicket = 1;
  let searchTicketUrl = '';
  if (startPointValue === 'ho-chi-minh') {
    startPointValue = 'sai-gon';
  }
  if (stopPointValue === 'ho-chi-minh') {
    stopPointValue = 'sai-gon';
  }
  // Build search url
  if (lang === LANG.EN) {
    searchTicketUrl += `bus-ticket-booking-from-${startPointValue}-to-${stopPointValue}-`;
  } else {
    searchTicketUrl += `ve-xe-khach-tu-${startPointValue}-di-${stopPointValue}-`;
  }
  const fromStateType = fromState.Type;
  const toStateType = toState.Type;

  searchTicketUrl += `${fromStateType}${fromState.Id}t${toStateType}${toState.Id}${numberOfTicket}`;
  searchTicketUrl += '.html';
  if (isReturn) {
    searchTicketUrl += '?isreturn=1';
  }
  const dateUrl = date.replace(/\//g, '-');
  return `${searchTicketUrl}?date=${dateUrl}`;
};

const formatBookingByLocale = (dataResponse, locale) => {
  let paymentTypeId;
  try {
    paymentTypeId = Number(get(dataResponse, 'payment_info_obj.type'))
      || Number(get(dataResponse, 'payment_info').split(':')[0]);
  } catch {
    paymentTypeId = -1;
  }
  const roundTripDate = moment(dataResponse.trip_date.split(' ')[1], 'DD/MM/YYYY')
    .add(3, 'day')
    .format('DD/MM/YYYY');
  const pickUpDateTime = dataResponse.pickup_time_expected_full || dataResponse.pickup_date;
  const pickupTime = moment(pickUpDateTime, 'HH:mm DD/MM/YYYY');
  const dropOffDateTime = get(dataResponse, 'arrival_date', '');
  const dropOffDate = dropOffDateTime.split(' ')[1] || '';

  const namePickupPoint = locale === LANG.VN
    ? get(dataResponse, 'pickup_info_obj.pickup_name')
        || get(dataResponse, 'pickup_info_obj.transfer_name')
    : get(dataResponse, 'pickup_info_obj.pickup_english_name')
        || get(dataResponse, 'pickup_info_obj.transfer_english_name');
  const addressPickupPoint = locale === LANG.VN
    ? get(dataResponse, 'pickup_info_obj.pickup_address')
        || get(dataResponse, 'pickup_info_obj.transfer_address')
    : get(dataResponse, 'pickup_info_obj.pickup_english_address')
        || get(dataResponse, 'pickup_info_obj.transfer_english_address');
  const nameDropOffPoint = locale === LANG.VN
    ? get(dataResponse, 'drop_off_info_obj.dropoff_name')
        || get(dataResponse, 'drop_off_info_obj.dropoff_transfer_name')
    : get(dataResponse, 'drop_off_info_obj.dropoff_english_name')
        || get(dataResponse, 'drop_off_info_obj.dropoff_transfer_english_name');
  const addressDropOffPoint = locale === LANG.VN
    ? get(dataResponse, 'drop_off_info_obj.dropoff_address')
        || get(dataResponse, 'drop_off_info_obj.dropoff_transfer_address')
    : get(dataResponse, 'drop_off_info_obj.dropoff_english_address')
        || get(dataResponse, 'drop_off_info_obj.dropoff_transfer_english_address');

  const fromId = get(dataResponse, 'trip_code_info.search_from');
  const toId = get(dataResponse, 'trip_code_info.search_to');
  const fromState = Areas.find(state => state.id === fromId);
  const toState = Areas.find(state => state.id === toId);

  const vxrOfficeType = get(dataResponse, 'payment_info') ? get(dataResponse, 'payment_info').split(':')[1] : '1';
  const seats = dataResponse.is_not_seat_code || dataResponse.bus_operator_status ? dataResponse.seats : dataResponse.seat_codes.join(', ');
  return {
    bookingCode: dataResponse.code,
    type: dataResponse.type,
    bookingStatus: dataResponse.status,
    numOfTicket: dataResponse.seats,
    companyName: dataResponse.company,
    customer: { ...dataResponse.customer, ...{ note: dataResponse.note } },
    paymentTypeId,
    trip: {
      // name: dataResponse.trip_name,
      name: `${get(fromState, 'name')} - ${get(toState, 'name')}`,
      tripDepDateTime: dataResponse.trip_date,
      id: dataResponse.trip_id,
      trip_code: dataResponse.trip_code,
    },
    seats,
    is_not_seat_code: dataResponse.is_not_seat_code,
    bus_operator_status: dataResponse.bus_operator_status,
    compListBranchAndAgent: dataResponse.comp_list_branch_and_agent,
    coordinates: dataResponse.coordinates,
    mapFromUrl: !isEmpty(get(dataResponse, 'coordinates.from'))
      ? `http://maps.google.com?q=${get(dataResponse, 'coordinates.from.lat')},${get(
        dataResponse,
        'coordinates.from.log',
      )}`
      : '',
    mapToUrl: !isEmpty(get(dataResponse, 'coordinates.to'))
      ? `http://maps.google.com?q=${get(dataResponse, 'coordinates.to.lat')},${get(
        dataResponse,
        'coordinates.to.log',
      )}`
      : '',
    pickupInfo: {
      pickupTime: `${pickupTime.hours()}:${
        pickupTime.minutes() !== 0 ? pickupTime.minutes() : '00'
      }`,
      pickupDate: pickupTime.format('DD/MM/YYYY'),
      namePickupPoint: namePickupPoint || get(dataResponse, 'pickup_info_obj.pickup_name'),
      addressPickupPoint: addressPickupPoint || get(dataResponse, 'pickup_info_obj.pickup_address'),
      suggestion:
        locale === LANG.VN
          ? get(dataResponse, 'pickup_info_obj.suggestion')
          : get(dataResponse, 'pickup_info_obj.english_suggestion'),
      introduction:
        locale === LANG.VN
          ? get(dataResponse, 'pickup_info_obj.introduction')
          : get(dataResponse, 'pickup_info_obj.english_introduction'),
    },
    dropOffInfo: {
      dropOffDate,
      dropOffTime: moment(dropOffDateTime, 'hh:mmA DD/MM/YYYY').format('HH:mm'),
      nameDropOffPoint: nameDropOffPoint || get(dataResponse, 'drop_off_info_obj.dropoff_name'),
      addressDropOffPoint:
        addressDropOffPoint || get(dataResponse, 'drop_off_info_obj.dropoff_address'),
    },
    expiredTime: dataResponse.expired_time,
    // moment(dataResponse.expired_time, 'HH:mm DD/MM/YYYY').toISOString(),
    receiveTicketDate: dataResponse.receive_ticket_date
      ? moment(dataResponse.receive_ticket_date, 'DD-MM-YYYY HH:mm').format('HH:mm DD/MM/YYYY')
      : '',
    storesInfo: get(dataResponse, 'store_info', []),
    isDeposit: dataResponse.is_deposit,
    convenienceStoreAddress: get(dataResponse, 'shop_address'),
    vxrAddress: get(dataResponse, 'vxr_info.address'),
    bank: {
      name: get(dataResponse, `vxr_info.bank.${[LOCALE_NAME[locale]]}`),
      branch: get(dataResponse, 'vxr_info.bank.branch'),
      numberAccount: get(dataResponse, 'vxr_info.bank.account'),
    },
    tripVehicleQuality: dataResponse.trip_vehicle_quality,
    tripVehicleType: dataResponse.trip_vehicle_type,
    isRefundable: dataResponse.refundable,
    ticketIds: get(dataResponse, 'ticket.ids', []),
    discount:
      get(dataResponse, 'amount_obj.all_discount')
      || get(dataResponse, 'cancelled_amount_obj.all_discount'),
    surcharge:
      get(dataResponse, 'amount_obj.all_surcharge')
      || get(dataResponse, 'cancelled_amount_obj.all_surcharge'),
    totalPrice:
      get(dataResponse, 'amount_obj.bus_total_cost')
      || get(dataResponse, 'cancelled_amount_obj.bus_total_cost'),
    totalFare:
      get(dataResponse, 'amount_obj.all_fare')
      || get(dataResponse, 'cancelled_amount_obj.all_fare'),
    totalEating: dataResponse.eating_fare,
    totalCoupon:
      get(dataResponse, 'amount_obj.coupon_value')
      || get(dataResponse, 'cancelled_amount_obj.coupon_value'),
    coupon: dataResponse.coupon,
    redirectUrl: {
      bookNewTicket: getTripRouteUrl(
        {
          Id: fromState.idUrl,
          Name: fromState.name,
          Type: fromState.type,
        },
        {
          Id: toState.idUrl,
          Name: toState.name,
          Type: toState.type,
        },
        locale,
        dataResponse.trip_date.split(' ')[1],
        false,
      ),
      bookRoundTripTicket: getTripRouteUrl(
        {
          Id: toState.idUrl,
          Name: toState.name,
          Type: toState.type,
        },
        {
          Id: fromState.idUrl,
          Name: fromState.name,
          Type: fromState.type,
        },
        locale,
        roundTripDate,
        false,
      ),
    },
    from: get(dataResponse, 'trip_code_info.search_from'),
    to: get(dataResponse, 'trip_code_info.search_to'),
    ticketManamentUrl: `https://vexere.com/${locale}/booking/ticketinfo?code=${dataResponse.code}&&phone=${get(dataResponse, 'customer.phone')}&&source=redirect`,
    displayMapUrl: `https://www.google.com/maps/embed/v1/place?q=${get(dataResponse, 'coordinates.from.lat')},${get(dataResponse, 'coordinates.from.log')}&key=${API_MAP_KEY}`,
    fromState,
    toState,
    vxrOffice: get(dataResponse, `vxr_info.office.${VXR_OFFICE_TYPE[vxrOfficeType]}.ADDRESS.${LANG_FORMAT[locale].toUpperCase()}`),
    vxrWorkingHours: get(dataResponse, `vxr_info.office.${VXR_OFFICE_TYPE[vxrOfficeType]}.WORKING_TIME.${LANG_FORMAT[locale].toUpperCase()}`),
    boPhoneInfo: get(dataResponse, 'bo_phone_info', '') ? get(dataResponse, 'bo_phone_info', '').split(', ') : [],
    pickupDate: get(dataResponse, 'pickup_date'),
  };
};

export const normalizeBookingInfoData = (dataResponse, locale) => formatBookingByLocale(
  dataResponse, locale,
);
