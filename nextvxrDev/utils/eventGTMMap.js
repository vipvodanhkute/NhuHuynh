import moment from 'moment';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import {
  PRODUCT_CLICK,
  PRODUCT_IMPRESSION,
} from '#/containers/Route/constants';
import {
  GTM_PRODUCT_DETAIL_VIEW,
  GTM_ADD_TO_CARD,
  BOOKING_TYPE,
} from '#/containers/Booking/constants';
import {
  GTM_PURCHASE_COMPLETE,
} from '#/containers/PaymentResults/constants';
import { formatEnglishLocation } from '#/utils/langUtils';
import {
  SEAT_TYPE,
  VEHICLE_QUALITY,
  TICKET_SOURCE_TYPE,
} from './constants';
import {
  GTM_PAYMENT_ORDER_STEP_1,
  GTM_PAYMENT_ORDER_STEP_2,
} from '#/containers/Payment/constants';
import Areas from '#/static/json/search_area';

const calculateUnitFare = (totalFare, quantity) => {
  let priceUnit = totalFare / quantity;
  if (!Number.isInteger(priceUnit)) {
    priceUnit = priceUnit.toFixed(3);
  }

  return priceUnit;
}

const formatPrice = price => (typeof price === 'string' ? Number(price.replace(',', '')) : price);

const generateProductGTM = (ticket, index, from, to) => {
  const category = `${formatEnglishLocation(get(from, 'name'))}_${formatEnglishLocation(get(to, 'name'))}`;
  const name = `${category}_${moment(get(ticket, 'departure_date')).format('DD-MM-YYYY')}_${get(ticket, 'fromTime')}`;
  const price = formatPrice(get(ticket, 'fareLarge'));
  const event = {
    id: get(ticket, 'tripCode'),
    name,
    category,
    brand: formatEnglishLocation(ticket.busName),
    variant: `${VEHICLE_QUALITY[get(ticket, 'originData.route.vehicle_quality') || 2]} - ${SEAT_TYPE[get(ticket, 'originData.route.schedules[0].seat_type') || 1]}`,
    list: `Route_${category}`,
    price,
    position: index + 1,
  };
  // console.log('event', event)
  return event;
}

export default {
  [PRODUCT_CLICK]: ({
    payload: {
      ticket,
      index,
      from,
      to,
    },
  }) => {
    const event = ({
      event: 'productClick',
      ecommerce: {
        click: {
          actionField: {
            list: `Route_${formatEnglishLocation(get(from, 'name'))} - ${formatEnglishLocation(get(to, 'name'))}`,
          },
          products: [generateProductGTM(ticket, index, from, to)],
        },

      },
    })
    // console.log('ticket', ticket)
    // console.log('event', event)
    return event;
  },
  [PRODUCT_IMPRESSION]: ({ payload: { tickets, from, to } }) => {
    const event = ({
      event: 'productImpress',
      ecommerce: {
        currencyCode: 'VND',
        impressions: tickets.map((ticket, index) => generateProductGTM(
          ticket, index, null, from, to,
        )),
      },
    })
    return event;
  },
  [GTM_PRODUCT_DETAIL_VIEW]: (action) => {
    const tripInfo = get(action, 'payload.tripInfo');
    const category = `${formatEnglishLocation(get(tripInfo, 'area.from.name'))}_${formatEnglishLocation(get(tripInfo, 'area.to.name'))}`;
    const event = ({
      event: 'productdetailview',
      ecommerce: {
        detail: {
          actionField: { list: `Route_${formatEnglishLocation(get(tripInfo, 'area.from.name'))} - ${formatEnglishLocation(get(tripInfo, 'area.to.name'))}` },
          products: [{
            id: get(action, 'payload.trip_code'),
            name: `${category}_${moment(get(tripInfo, 'route.departure_date')).format('DD-MM-YYYY')}_${get(tripInfo, 'route.departure.time')}`,
            category,
            brand: formatEnglishLocation(get(tripInfo, 'operator.name')),
            variant: `${get(action, 'payload.vehicleQuanlity')} - ${get(action, 'payload.seatType')}`,
            price: formatPrice(get(action, 'payload.fare')),
          }],
        },
      },
    })
    // console.log(event)
    return event;
  },
  [GTM_ADD_TO_CARD]: (action, prevState, nextState) => {
    const tripInfo = get(nextState, 'bookingReducer.tripInfo');
    const booking_type = get(nextState, 'bookingReducer.booking_type');
    const category = `${formatEnglishLocation(get(tripInfo, 'area.from.name'))}_${formatEnglishLocation(get(tripInfo, 'area.to.name'))}`;
    const price = calculateUnitFare(get(action, 'payload.totalTicketsPrice'), get(action, 'payload.quantity'));
    const event = ({
      event: 'addToCart',
      ecommerce: {
        currencyCode: 'VND',
        add: {
          products: [{
            id: get(action, 'payload.trip_code'),
            name: `${category}_${moment(get(tripInfo, 'route.departure_date')).format('DD-MM-YYYY')}_${get(tripInfo, 'route.departure.time')}`,
            category,
            brand: formatEnglishLocation(get(tripInfo, 'operator.name')),
            variant: `${get(tripInfo, 'vehicleQuanlity')} - ${get(tripInfo, 'seatType')}`,
            list: `Route_${formatEnglishLocation(get(tripInfo, 'area.from.name'))} - ${formatEnglishLocation(get(tripInfo, 'area.to.name'))}`,
            price,
            quantity: get(action, 'payload.quantity'),
          }],
        },
      },
    })
    if (booking_type === BOOKING_TYPE.CALLING) {
      event.actionField = {
        affiliation: 'cs',
      };
    }
    // console.log('event', event)
    return event;
  },
  [GTM_PURCHASE_COMPLETE]: (action, prevState, nextState) => {
    const bookingInfo = get(nextState, 'paymentResultsReducer.bookingInfo');
    const quantity = get(bookingInfo, 'numOfTicket');
    const revenue = get(bookingInfo, 'totalPrice');
    const price = calculateUnitFare(revenue, quantity);
    const fromState = get(bookingInfo, 'fromState');
    const toState = get(bookingInfo, 'toState');
    const tripDepDateTime = moment(get(bookingInfo, 'pickupDate'), 'HH:mm DD/MM/YYYY').format('DD-MM-YYYY_HH:mm');

    const event = ({
      event: 'complete',
      ecommerce: {
        currencyCode: 'VND',
        purchase: {
          actionField: {
            id: get(bookingInfo, 'bookingCode'),
            affiliation: TICKET_SOURCE_TYPE[get(bookingInfo, 'type')],
            revenue,
            coupon: get(bookingInfo, 'coupon.code', ''),
          },
          products: [
            {
              id: get(bookingInfo, 'trip.trip_code'),
              name: `${formatEnglishLocation(fromState.name)}_${formatEnglishLocation(toState.name)}_${tripDepDateTime}`,
              category: `${formatEnglishLocation(fromState.name)}_${formatEnglishLocation(toState.name)}`,
              brand: formatEnglishLocation(get(bookingInfo, 'companyName')),
              variant: `${VEHICLE_QUALITY[get(bookingInfo, 'tripVehicleQuality')]} - ${SEAT_TYPE[get(bookingInfo, 'tripVehicleType')]}`,
              list: `Route_${formatEnglishLocation(fromState.name)} - ${formatEnglishLocation(toState.name)}`,
              price,
              quantity,
              coupon: get(bookingInfo, 'coupon.code', ''),
            },
          ],
        },
      },
    });
    return event;
  },
  [GTM_PAYMENT_ORDER_STEP_1]: (action) => {
    const bookingInfo = get(action, 'payload.booking');
    if (!isEmpty(bookingInfo)) {
      const fromId = get(bookingInfo, 'from');
      const toId = get(bookingInfo, 'to');
      const fromState = Areas.find(state => state.id === fromId);
      const toState = Areas.find(state => state.id === toId);
      const quantity = get(bookingInfo, 'ticketIds', []).length;
      const price = calculateUnitFare(get(bookingInfo, 'totalPrice'), quantity);
      const fromName = get(fromState, 'name');
      const toName = get(toState, 'name');
      const event = ({
        event: 'checkout1',
        ecommerce: {
          checkout_option: {
            actionField: { step: 1 },
            products: [{
              id: get(bookingInfo, 'trip.tripCode'),
              name: `${formatEnglishLocation(fromName)}_${formatEnglishLocation(toName)}_${moment(get(bookingInfo, 'pickupDate'), 'HH:mm DD/MM/YYYY').format('DD-MM-YYYY_HH:mm')}`,
              category: `${formatEnglishLocation(fromName)}_${formatEnglishLocation(toName)}`,
              brand: formatEnglishLocation(get(bookingInfo, 'companyName')),
              variant: `${VEHICLE_QUALITY[get(bookingInfo, 'tripVehicleQuality')]} - ${SEAT_TYPE[get(bookingInfo, 'tripVehicleType')]}`, // 'normal - ac sleeper',
              list: `Route_${formatEnglishLocation(fromState.name)} - ${formatEnglishLocation(toState.name)}`,
              price,
              quantity,
            }],
          },
        },
      });
      return event;
    }
  },
  [GTM_PAYMENT_ORDER_STEP_2]: (action, prevState, nextState) => {
    const bookingInfo = get(nextState, 'paymentReducer.booking');
    const pickupDate = get(nextState, 'paymentReducer.pickupDate');
    const fromId = get(bookingInfo, 'from');
    const toId = get(bookingInfo, 'to');
    const fromState = Areas.find(state => state.id === fromId);
    const toState = Areas.find(state => state.id === toId);
    const quantity = get(bookingInfo, 'ticketIds', []).length;
    const price = calculateUnitFare(get(bookingInfo, 'totalPrice'), quantity);
    const event = ({
      event: 'checkout2',
      ecommerce: {
        checkout_option: {
          actionField: { step: 2, option: get(action, 'payload.paymentMethod') },
          products: [{
            id: get(bookingInfo, 'tripCode'),
            name: `${formatEnglishLocation(fromState.name)}_${formatEnglishLocation(toState.name)}_${moment(pickupDate, 'HH:mm DD/MM/YYYY').format('DD-MM-YYYY_HH:mm')}`,
            category: `${formatEnglishLocation(fromState.name)}_${formatEnglishLocation(toState.name)}`,
            brand: formatEnglishLocation(get(bookingInfo, 'companyName')),
            variant: `${VEHICLE_QUALITY[get(bookingInfo, 'tripVehicleQuality')]} - ${SEAT_TYPE[get(bookingInfo, 'tripVehicleType')]}`, // 'normal - ac sleeper',
            list: `Route_${formatEnglishLocation(fromState.name)} - ${formatEnglishLocation(toState.name)}`,
            price,
            quantity,
          }],
        },
      },
    });
    return event;
  },
};
