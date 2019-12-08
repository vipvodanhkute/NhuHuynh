import React, { Component } from 'react';
import SeatTemplate from 'vxrd/components/SeatTemplate';
import { injectIntl } from 'react-intl';
import {
  GA_MAIN_BOOKING_EVENT,
} from '../constants';
import {
  VXR_INFO,
} from '#/utils/constants';

class SelectSeatTemplate extends Component {
  closeAlertMessage = () => {
    const { updateOpenAlertMessage } = this.props;
    updateOpenAlertMessage(false);
  }

  sendSelectSeatTracking = () => {
    const { sendGAEventTracking } = this.props;
    sendGAEventTracking(GA_MAIN_BOOKING_EVENT, 'Seat selection');
  }

  render() {
    const {
      seatTemplate,
      getValue,
      listSeatBooked = [],
      intl,
      openAlertMessage,
      maxBookingTicket,
    } = this.props;
    const coach_seat_template = seatTemplate; // get(seatTemplate, 'coach_seat_template', []);
    let seatTemplateProps;
    if (coach_seat_template.length > 0) {
      const listFloorName = coach_seat_template.length > 1
        ? coach_seat_template.map((item, index) => {
          if (index === 0) {
            return intl.formatMessage({ id: 'booking.seatTemplateSelection.floorFirstLabel' },
              { coachNum: index + 1 })
          }
          return intl.formatMessage({ id: 'booking.seatTemplateSelection.floorLabel' },
            { coachNum: index + 1 })
        }) : [];
      seatTemplateProps = {
        coach_seat_template,
        seatTypeLabel: {
          available: intl.formatMessage({ id: 'booking.seatTemplateSelection.availableSeat' }),
          sold: intl.formatMessage({ id: 'booking.seatTemplateSelection.soldSeat' }),
          selected: intl.formatMessage({ id: 'booking.seatTemplateSelection.selectedSeat' }),
        },
        seatTypeGroupLabel: {
          title: intl.formatMessage({ id: 'booking.seatTemplateSelection.seatTypeGroupLabel' }),
          seatLabel: intl.formatMessage({ id: 'booking.seatTemplateSelection.seatLabel' }),
        },
        bookingSummaryLabel: {
          seatName: intl.formatMessage({ id: 'booking.seatTemplateSelection.seatLabel' }),
          total: intl.formatMessage({ id: 'booking.seatTemplateSelection.totalLabel' }),
          buttonLabel: intl.formatMessage({ id: 'booking.seatTemplateSelection.selectAreaLabel' }),
        },
        getValue,
        listSeatBooked,
        closeAlert: this.closeAlertMessage,
        listFloorName,
        selectSeatEvent: this.sendSelectSeatTracking,
        limitBooking: {
          maxBookingTicket,
          message: intl.formatMessage(
            { id: 'booking.seatTemplateSelection.limitBooking.message' },
            { maxBookingTicket, hotline: VXR_INFO.HOTLINE },
          ),
          closeButtonLabel: intl.formatMessage({ id: 'booking.seatTemplateSelection.limitBooking.closeButtonLabel.message' }),
        },
      };

      if (openAlertMessage) {
        seatTemplateProps.alertMessage = {
          title: intl.formatMessage({ id: 'booking.seatTemplateSelection.alertMessage.title' }),
          message: intl.formatMessage({ id: 'booking.seatTemplateSelection.alertMessage.message' }),
          labelButton: intl.formatMessage({ id: 'booking.seatTemplateSelection.alertMessage.agreeLabel' }),
        }
      }
    }

    return (
      <>
        {
          seatTemplateProps
          && <SeatTemplate {...seatTemplateProps} />
        }
      </>
    );
  }
}

export default injectIntl(SelectSeatTemplate);
