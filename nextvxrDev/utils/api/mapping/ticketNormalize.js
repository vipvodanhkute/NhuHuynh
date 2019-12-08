import get from 'lodash.get';
import moment from 'moment';
import { equalString } from '#/utils/stringUtils';

export const mapFromAPI = (ticketsResponse) => {
  const arr = [];
  ticketsResponse.data.forEach((ticket) => {
    const schedules = get(ticket, 'route.schedules');
    if (schedules) {
      const schedule = schedules[0];
      const pickup_date = moment(schedule.pickup_date);
      const arrival_time = moment(schedule.arrival_time);
      const isPromotion = get(schedule, 'fare.original') > get(schedule, 'fare.discount')
        && get(schedule, 'fare.discount') !== -1;
      const isDeposit = get(schedule, 'deposit_selling', false);
      const image = get(ticket, 'company.images[0]', undefined);
      let subTickets;
      if (schedules.length > 1) {
        subTickets = [];
        schedules.forEach((item) => {
          const itemDepartureTime = moment(item.pickup_date);
          const itemArrivalTime = moment(item.arrival_time);
          subTickets.push({
            fromTime: itemDepartureTime.format('HH:mm'),
            toTime: itemArrivalTime.format('HH:mm'),
            tripCode: item.trip_code,
            isSameDate: itemDepartureTime.isSame(itemArrivalTime, 'day'),
            bookingType: item.config,
            arrival_time: item.arrival_time,
            departure_date: get(ticket, 'route.departure_date'),
          });
        });
      }
      let fareLarge = get(schedule, 'fare.original');
      if (isPromotion) {
        fareLarge = get(schedule, 'fare.discount');
      }
      if (isDeposit) {
        fareLarge = get(schedule, 'fare.deposit') === -1
          ? get(schedule, 'fare.original')
          : get(schedule, 'fare.deposit');
      }
      let imgURL;
      if (image) {
        const keys = Object.keys(image.files);
        imgURL = image.files[keys.sort(equalString)[0]];
      }

      const ticketResult = {
        tripCode: schedule.trip_code,
        bookingType: schedule.config,
        promotion: isPromotion,
        fromTime: pickup_date.format('HH:mm'),
        toTime: arrival_time.format('HH:mm'),
        isSameDate: pickup_date.isSame(arrival_time, 'day'),
        arrival_time,
        ticketType: schedule.config,
        seatType: get(schedule, 'seat_type'),
        vehicleQuanlity: get(ticket, 'route.vehicle_quality'),
        numberSeatAvailable: schedule.available_seats,
        busName: get(ticket, 'company.name', ''),
        vehicleTypeStr: schedule.vehicle_type,
        totalSeats: get(schedule, 'total_seats'),
        fareLarge,
        fareSmall: isPromotion ? get(schedule, 'fare.original') : undefined,
        haveMaxFare: get(schedule, 'fare.max') > get(schedule, 'fare.original'),
        originalFare: get(schedule, 'fare.original'),
        services: schedule.services || [],
        rateValue: get(ticket, 'company.ratings.overall', 0),
        countRate: get(ticket, 'company.ratings.comments', ''),
        imgURL,
        schedules: subTickets,
        isDeposit,
        fromName: get(ticket, 'route.from.name'),
        toName: get(ticket, 'route.to.name'),
        isUpdatingFare: get(ticket, 'route.is_updating_fare'),
        notification: get(ticket, 'notification'),
        departure_date: get(ticket, 'route.departure_date'),
      };
      arr.push(ticketResult);
    }
  });
  return arr;
};
