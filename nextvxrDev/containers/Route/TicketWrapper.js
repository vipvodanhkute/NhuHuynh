import React from 'react';
import Ticket from 'vxrd/components/RouteComponent/Ticket';
import moment from 'moment';
import pluralize from 'pluralize';
import styled from 'styled-components';
import {
  TICKET_NOTIFICATION_TYPE,
  SEAT_TYPE_LANG,
  VEHICLE_QUALITY_LANG,
} from '#/utils/constants';

const TicketContainer = styled.div`
  padding-bottom: 5px;
  background: #f4f4f4;
`

const NotiStyle = '#007AFF';

const PromotionStyle = '#F6511D';

const LANG_PREFIX = {
  'vi-VN': '',
  'en-US': 'english_',
}

export default ({
  intl,
  lang,
  data: {
    arrival_time,
    isSameDate,
    ticketType,
    fareLarge,
    fareSmall,
    services,
    toTime,
    numberSeatAvailable,
    promotion,
    schedules,
    haveMaxFare,
    isDeposit,
    originData,
    isUpdatingFare,
    notification,
    seatType,
    vehicleQuanlity,
    vehicleTypeStr,
    totalSeats,
    ...dataProps
  },
  isLoading,
  ...otherProps
}) => {
  if (isLoading) {
    return (
      <TicketContainer>
        <Ticket
          {...otherProps}
          isLoading={isLoading}
          data={{}}
        />
      </TicketContainer>
    )
  }

  const localizeServices = services ? services.map(service => intl.formatMessage({ id: `route.ticket.services.${service}` })) : []
  let newSchedules;
  if (schedules) {
    newSchedules = schedules.map(schedule => ({
      ...schedule,
      timeNote: schedule.isSameDate ? intl.formatMessage({ id: 'route.ticket.timeNote' }) : moment(schedule.arrival_time).format('DD/MM/YYYY'),
      toTime: intl.formatMessage({ id: 'route.ticket.toTime' }, { time: schedule.toTime }),
    }))
  }
  // console.log('lang={lang}', lang)
  let notificationData = {};
  if (notification) {
    let title = '';
    switch (notification.category) {
      case TICKET_NOTIFICATION_TYPE.ALERT:
        title = intl.formatMessage({ id: 'route.ticket.notification.alert.title' });
        break;
      case TICKET_NOTIFICATION_TYPE.DISCOUNT:
        title = intl.formatMessage({ id: 'route.ticket.notification.discount.title' });
        break;
      case TICKET_NOTIFICATION_TYPE.PROMOTION:
        title = intl.formatMessage({ id: 'route.ticket.notification.promotion.title' });
        break;
      default:
    }
    notificationData = {
      style: notification.category === TICKET_NOTIFICATION_TYPE.ALERT ? NotiStyle : PromotionStyle,
      title,
      label: notification[`${LANG_PREFIX[lang]}label`],
    }
  }

  let seatTypeValue = vehicleTypeStr
  if (seatType && vehicleQuanlity && totalSeats) {
    seatTypeValue = `${SEAT_TYPE_LANG[seatType][lang]} ${VEHICLE_QUALITY_LANG[vehicleQuanlity]} ${totalSeats} ${intl.formatMessage({ id: 'route.ticket.seatLabel' })}`;
  }

  return (
    <TicketContainer>
      <Ticket
        {...otherProps}
        data={{
          ...dataProps,
          numberSeatAvailable,
          timeNote: isSameDate ? intl.formatMessage({ id: 'route.ticket.timeNote' }) : moment(arrival_time).format('DD/MM/YYYY'),
          ticketType: ticketType ? intl.formatMessage({ id: `route.ticket.type.${ticketType}` }) : undefined,
          fareLarge: fareLarge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          fareSmall: fareSmall ? fareSmall.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined,
          services: localizeServices,
          seatText: intl.formatMessage({ id: 'route.ticket.seatText' }, { seat: pluralize('seat', numberSeatAvailable) }),
          toTime: intl.formatMessage({ id: 'route.ticket.toTime' }, { time: toTime }),
          schedules: newSchedules,
          rateText: intl.formatMessage({ id: 'route.ticket.noRateText' }),
          fareText: haveMaxFare ? intl.formatMessage({ id: 'route.ticket.fareText' }) : undefined,
          depositText: isDeposit ? intl.formatMessage({ id: 'route.ticket.depositText' }) : undefined,
          notification: notificationData,
          originData,
          isUpdatingFare,
          upDatingFareLabel: isUpdatingFare ? intl.formatMessage({ id: 'route.ticket.updatingFare' }) : null,
          seatType: seatTypeValue,
        }}
      />
    </TicketContainer>
  )
}
