import get from 'lodash.get';
import moment from 'moment';
import { TICKET_STATUS } from '#/utils/constants';
import { findAreaById } from '#/utils/searchUtils';

export const mapFromAPI = (response) => {
  if (!response) return {};
  const pickupTime = moment(get(response, 'pickup_date'));
  let expiredTimePaymentMethod = get(response, 'expired_time');
  const status = get(response, 'status')
  if (expiredTimePaymentMethod) {
    if (status === TICKET_STATUS.NEW) {
      if (moment(expiredTimePaymentMethod).diff(moment(), 'minute') > 9) {
        expiredTimePaymentMethod = moment().add(10, 'minute')
      } else {
        expiredTimePaymentMethod = moment(expiredTimePaymentMethod)
      }
    } else {
      expiredTimePaymentMethod = undefined
    }
  } else {
    // TODO: neu khong co thi lam gi do
  }

  let date = pickupTime
  if (date.isBefore(moment())) {
    date = moment();
  }
  const fromState = findAreaById(get(response, 'area_search.from'));
  const toState = findAreaById(get(response, 'area_search.to'));
  const rs = {
    code: get(response, 'code'),
    companyName: get(response, 'company_name'),
    pickupInfo: {
      pickupTime: `${pickupTime.hours()}:${
        pickupTime.minutes() !== 0 ? pickupTime.minutes() : '00'
      }`,
      pickupDate: pickupTime.format('DD/MM/YYYY'),
    },
    trip: {
      name: `${get(fromState, 'name')} - ${get(toState, 'name')}`, // get(response, 'trip_name'),
    },
    tripCode: get(response, 'trip_code'),
    totalPrice: get(response, 'total_price'),
    totalFare: get(response, 'total_fare'),
    expiredTimePaymentMethod,
    customer: get(response, 'customer'),
    ticketIds: get(response, 'ticket_ids'),
    companyId: get(response, 'company_id'),
    from: get(response, 'area_search.from'),
    to: get(response, 'area_search.to'),
    status: get(response, 'status'),
    date,
    tripVehicleQuality: get(response, 'trip_vehicle_quality'),
    tripVehicleType: get(response, 'trip_vehicle_type'),
    isDeposit: get(response, 'is_deposit'),
    pickupDate: moment(get(response, 'pickup_date')),
  };

  return rs;
};
