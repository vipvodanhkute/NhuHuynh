import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withReduxSaga from 'next-redux-saga';
import { injectIntl } from 'react-intl';
import pluralize from 'pluralize';
import Header from 'vxrd/components/Layout/Header';
import CompanyInfo from 'vxrd/components/Layout/Header/CompanyInfo';
import BackIcon from 'vxrd/components/Layout/Header/BackIcon';
import Title from 'vxrd/components/Layout/Header/Title';
import BookingFooter from 'vxrd/components/Layout/Footer/BookingFooter';
import BookingPriceInfo from 'vxrd/components/Layout/Footer/BookingPriceInfo';
import BookingTicket from 'vxrd/components/BookingTicket';
import BookingContactInfo from 'vxrd/components/BookingContactInfo';
import BookingSummaryButton from 'vxrd/components/SeatTemplate/BookingSummary';
import CircleDotIcon from 'vxrd/components/BookingContactInfo/CircleIcon';
import Currency from 'vxrd/components/Base/Currency';
import BookingAlertMessage from 'vxrd/components/BookingContactInfo/StatusMessage';
import CloseIcon from 'vxrd/components/Base/CloseIcon';
import Modal from 'antd/lib/modal';
import Checkbox from 'antd/lib/checkbox';
import get from 'lodash.get';
import styled from 'styled-components';
import isEmpty from 'lodash.isempty';
import sumBy from 'lodash.sumby';
import cloneDeep from 'lodash.clonedeep';
import forOwn from 'lodash.forown';
import moment from 'moment';
import { Router } from '#/routes';
import SeatTemplateSelection from './SeatTemplateSelection';
import AreaPointSelection from './AreaPointSelection';
import CustomerInfoForm from './CustomerInfoForm';
import BookingSummary from './BookingSummary';
import TripInfoDetail from './TripInfoDetail';
import {
  TAB_KEYS,
  GA_BUS_INFO_EVENT_CLICK,
} from '#/containers/BookingCompanyDetail/constants';
import {
  BOOKING_STEP,
  BOOKING_TYPE,
  VXR_CONTACT_INFO,
  DAY_OF_WEEK,
  GA_MAIN_BOOKING_EVENT,
  GA_MAIN_REGISTER_BOOKING_EVENT,
  GA_MAIN_PHONE_CALL_BOOKING_EVENT,
  GA_BOOKING_BOARDING_POINT_SELECTION_EVENT,
  GA_BOOKING_BOARDING_POINT_SELECTION_TYPE_EVENT,
  GA_BOOKING_DROPPING_POINT_SELECTION_EVENT,
  GA_BOOKING_DROPPING_POINT_SELECTION_TYPE_EVENT,
  GA_BOOKING_SERVICE_EVENT,
  GA_BOOKING_CONTACT_INFO_EVENT,
  GA_BOOKING_CONTACT_INFO_TYPE_EVENT,
  GA_BOOKING_EDIT_EVENT,
  GTM_ADD_TO_CARD,
} from '../constants';
import {
  updateBookingData as updateBookingDataAction,
  updateOpenAlertMessage,
  submitTicket,
  getTripInfoDetail,
  getTripReviews,
  resetTripDetailData,
} from '../actions';
import {
  clearCompanyReviewData,
} from '#/containers/BookingCompanyDetail/actions';
import { sendEventTracking } from '#/containers/Device/actions';
import { hideBodyScroll, showBodyScroll } from '#/utils/vanillaJS/dialogFuncs';

const BookingWizardContent = styled.div`
  margin-top: -20px;
  overflow: ${props => (props.isOpenTripDetailModal ? 'hidden' : '')};
`;

const BookingStepContainer = styled.div`
  padding-top: ${props => (props.calling && '65px')};
  margin-top: 20px;
  margin-bottom: ${props => (props.calling && '70px')};
  .service-info {
    padding-left: 15px;
    font-size: 14px;
    .title {
      color: #484848;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .checkbox-content {
      padding-left: 15px;
    }
  }
  .is-display-footer {
    margin-bottom: 135px;
  }
  .select-seat-content {
    margin-bottom: 80px;
  }
`;
const BookingFooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  div.booking-footer-content {
    border: 1px solid #CCCCCC;
  }
  .booking-seat-data-summary {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .route-info-menu {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #f5f1f1;
    background-color: #fff;
    box-shadow: 0 -4px 4px 0 rgba(163, 163, 163, 0.2);
    .route-info-item {
      color: #007AFF;
      width: 100%;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .route-info-item:not(:last-child) {
      border-right: 1px solid #f4f4f4;
    }
  }
`;

const BookingTicketContainer = styled.div`
  padding: 30px 15px 50px 15px;
`;

const FooterContainer = styled.div`
  position: fixed;
  bottom: ${props => (props.isBottom ? '60px' : '0')};
  width: 100%;
  border-top: ${props => (props.hiddenBorder ? 'none' : '1px solid #e4e4e4')};
  z-index: 2;
`;
const ModalContainer = styled(Modal)`
  max-width: 100% !important;
  max-height: 100%;
  margin: 0px !important;
  top: 0px !important;
  .ant-modal-content {
      height: auto;
      min-height: 100vh;
  }
  .ant-modal-body {
      padding: 0px;
  }
  .ant-modal-title {
      text-align: center;
  }
  .ant-modal-close {
    display: none;
  }
`;

const DepositOnlineMessage = styled.div`
  font-size: 12px;
  padding: 15px 0 20px 15px;
  color: #484848;
`;

const DepositRegisterMessage = styled.div`
  font-size: 12px;
  font-weight: normal;
  color: #484848;
`;

const CompanyInfoContainer = styled.div`
  // margin-top: -10px;
  width: 100%;
`

const getPointName = (point, isTransfer = 0) => {
  if (!isTransfer) {
    if (get(point, 'transfer')) {
      return null;
    }

    return get(point, 'unfixed_point') ? get(point, 'address') : get(point, 'name');
  }

  if (get(point, 'transfer')) {
    return get(point, 'unfixed_point') ? get(point, 'address') : get(point, 'name');
  }

  return null;
}

class BookingForm extends Component {
  state = {
    listSeatBookedState: get(this.props, 'bookingData.seatData.listSeatBooked', []).slice(0),
    seatBookingDataState: cloneDeep(get(this.props, 'bookingData.seatBookingData', {})),
    visibleBookingSumary: false,
    isSelectEatingState: get(this.props, 'bookingData.isSelectEating', null),
    isOpenTripDetailModal: false,
    tripDetailTab: TAB_KEYS.AMENITIES,
  }

  componentDidMount() {
    this.props.resetTripDetailData();
  }

  getNextStep = () => {
    const {
      query: {
        step,
      },
    } = this.props;
    const numStep = step ? Number(step) : 1;
    return numStep + 1;
  };

  nextPage = () => {
    const {
      query: {
        lang,
        trip_code,
        from,
        to,
        fare,
      },
      booking_type,
    } = this.props;
    const nextStep = this.getNextStep();
    const params = {
      lang,
      trip_code,
      booking_type,
      step: nextStep,
      from,
      to,
      fare,
    }
    const { query } = this.props;
    if (query.aid) {
      params.aid = query.aid;
    }
    Router.pushRoute('booking', params)
  };

  sendGABackEvent = () => {
    const {
      query: {
        step,
      },
      booking_type,
    } = this.props;
    const numStep = step ? Number(step) : 1;
    let gaEvent;
    if (numStep === BOOKING_STEP.REGISTER && booking_type === BOOKING_TYPE.REGISTER) {
      gaEvent = GA_MAIN_REGISTER_BOOKING_EVENT;
    } else {
      switch (numStep) {
        case BOOKING_STEP.SELECT_PICK_UP_AREA:
          gaEvent = GA_BOOKING_BOARDING_POINT_SELECTION_EVENT;
          break;
        case BOOKING_STEP.SELECT_DROP_OFF_AREA:
          gaEvent = GA_BOOKING_DROPPING_POINT_SELECTION_EVENT;
          break;
        case BOOKING_STEP.SELECT_AREA_SUMMARY:
          gaEvent = GA_BOOKING_SERVICE_EVENT;
          break;
        case BOOKING_STEP.CUSTOMER_INFO:
          gaEvent = GA_BOOKING_CONTACT_INFO_EVENT;
          break;
        default:
          gaEvent = GA_MAIN_BOOKING_EVENT;
      }
    }
    this.sendGAEventTracking(gaEvent, 'Back button');
  }

  previousPage = () => {
    const {
      query: {
        step,
      },
    } = this.props;
    const numStep = step ? Number(step) : 1;
    this.sendGABackEvent();
    if (numStep === BOOKING_STEP.SELECT_SEAT) {
      this.props.loading();
    }
    Router.back();
  };

  updateOpenAlertMessage = (value) => {
    this.props.updateOpenAlertMessage(value)
  };

  getHeaderInfo = () => {
    const {
      tripInfo,
      intl,
      query: { step },
      booking_type,
    } = this.props;
    const companyInfoProps = {
      companyName: get(tripInfo, 'operator.name'),
      tripName: get(tripInfo, 'tripName'),
    };
    if (booking_type === BOOKING_TYPE.REGISTER
      || booking_type === BOOKING_TYPE.ONLINE) {
      switch (Number(step)) {
        case BOOKING_STEP.SELECT_SEAT_TEMPLATE:
          return (
            <CompanyInfoContainer>
              <CompanyInfo {...companyInfoProps} />
            </CompanyInfoContainer>
          );
        case BOOKING_STEP.SELECT_PICK_UP_AREA:
          return (
            <Title
              title={intl.formatMessage({ id: 'booking.titleStep.selectPickUpArea' })}
            />
          );
        case BOOKING_STEP.SELECT_DROP_OFF_AREA:
          return (
            <Title
              title={intl.formatMessage({ id: 'booking.titleStep.selectDropOffArea' })}
            />
          );
        case BOOKING_STEP.SELECT_AREA_SUMMARY:
          return (
            <Title
              title={intl.formatMessage({ id: 'booking.titleStep.selectAreaSummary' })}
            />
          );
        case BOOKING_STEP.CUSTOMER_INFO:
          return (
            <Title
              title={intl.formatMessage({ id: 'booking.titleStep.inpuUserContactInfo' })}
            />
          );
        default:
          return (
            <CompanyInfoContainer>
              <CompanyInfo {...companyInfoProps} />
            </CompanyInfoContainer>
          );
      }
    } else {
      return (
        <CompanyInfoContainer>
          <CompanyInfo {...companyInfoProps} />
        </CompanyInfoContainer>
      );
    }
  };

  updateSeatTemplateData = (seats) => {
    this.setState({
      listSeatBookedState: seats,
    })
  };

  updateSeatBookingData = (numTickets) => {
    const { seatBookingDataState } = this.state;
    const { ticketPrice } = seatBookingDataState;
    const totalPrice = ticketPrice * numTickets;
    this.setState({
      seatBookingDataState: {
        ...seatBookingDataState,
        ...{
          totalPrice,
          totalTickets: numTickets,
        },
      },
    }, () => {
      this.sendGAEventTracking(GA_MAIN_REGISTER_BOOKING_EVENT, 'Seat number selection');
    })
  };

  updateAreaPointsValue = (areaSelectionValueSelect) => {
    const {
      bookingData,
      query: {
        step,
      },
    } = this.props;
    const { areaSelectionValue } = bookingData;
    const numStep = step ? Number(step) : 1;
    const areaToUpdate = Object.assign(
      {},
      areaSelectionValue,
      { [areaSelectionValueSelect.key]: areaSelectionValueSelect[areaSelectionValueSelect.key] },
    );
    this.props.updateBookingData(
      Object.assign(
        {},
        bookingData,
        { areaSelectionValue: areaToUpdate },
      ),
    );
    if (numStep === BOOKING_STEP.SELECT_PICK_UP_AREA) {
      this.sendGAEventTracking(GA_BOOKING_BOARDING_POINT_SELECTION_EVENT, 'Select pick-up point');
    } else {
      this.sendGAEventTracking(GA_BOOKING_DROPPING_POINT_SELECTION_EVENT, 'Select drop-off point');
    }
    if (numStep !== BOOKING_STEP.SELECT_AREA_SUMMARY) {
      this.nextPage();
    }
  };

  updateCustomerInfoValue = (customerInfo, hasError) => {
    const { bookingData } = this.props;
    this.props.updateBookingData(Object.assign({}, bookingData,
      { customerInfo: { ...customerInfo, hasError } }));
  };

  generateAreaPointData = (listPoints, step) => {
    const { intl } = this.props;
    const totalTickets = this.getTotalTickets();
    if (listPoints) {
      return listPoints.map((item) => {
        let modalLabel = {};
        let inputAddressLabel = '';
        let transferlabel = '';
        let surchargeLabel = '';
        let surchargeMethod = '';
        let surchargeUnit = '';
        if (item.unfixed_point) {
          if (step === BOOKING_STEP.SELECT_PICK_UP_AREA) {
            modalLabel = {
              title: intl.formatMessage({ id: 'booking.selectArea.pickupSelection.inputAddressmodal.title' }),
              placeholder: intl.formatMessage({ id: 'booking.selectArea.pickupSelection.inputAddressmodal.placeHolder' }, { areaName: '' }),
              button: intl.formatMessage({ id: 'booking.selectArea.pickupSelection.inputAddressmodal.button' }),
            };
            inputAddressLabel = intl.formatMessage({ id: 'booking.selectArea.pickupSelection.inputAddressLabel' });
          } else {
            modalLabel = {
              title: intl.formatMessage({ id: 'booking.selectArea.dropOffSelection.inputAddressmodal.title' }),
              placeholder: intl.formatMessage({ id: 'booking.selectArea.dropOffSelection.inputAddressmodal.placeHolder' }, { areaName: '' }),
              button: intl.formatMessage({ id: 'booking.selectArea.dropOffSelection.inputAddressmodal.button' }),
            };
            inputAddressLabel = intl.formatMessage({ id: 'booking.selectArea.dropOffSelection.inputAddressLabel' });
          }
        }
        if (item.transfer) {
          transferlabel = intl.formatMessage({ id: 'booking.selectArea.transferlabel' })
        }
        if (item.surcharge && item.surcharge > 0) {
          surchargeLabel = intl.formatMessage({ id: 'booking.selectArea.surchargeLabel' });
          surchargeUnit = intl.formatMessage({ id: 'booking.selectArea.surchargeUnit' });
        }
        if (item.surcharge_type && item.surcharge_description === 'Operator') {
          surchargeMethod = intl.formatMessage({ id: 'booking.selectArea.surchargeMethod.driver' });
        }
        return {
          ...item,
          ...{
            disable: totalTickets < item.limitTicket,
            disableMessage: intl.formatMessage({ id: 'booking.selectArea.limitTicket' }, { limitTicket: item.limitTicket }),
          },
          ...{ modalLabel },
          ...{ inputAddressLabel },
          ...{
            transferlabel, surchargeLabel, surchargeUnit, surchargeMethod,
          },
        }
      });
    }

    return [];
  }

  formatAgents = () => {
    const {
      tripInfo,
      booking_type,
      locale,
      intl,
    } = this.props;
    if (booking_type === BOOKING_TYPE.CALLING) {
      const listHotline = get(tripInfo, 'hotline', []);
      const southAgentNumbers = [];
      const northAgentNumbers = [];
      let southAgent;
      let northAgent;
      for (let i = 0; i < listHotline.length; i += 1) {
        if (listHotline[i].region === 'SOUTH') {
          southAgentNumbers.push(listHotline[i].number);
          southAgent = listHotline[i];
        } else if (listHotline[i].region === 'NORTH') {
          northAgentNumbers.push(listHotline[i].number);
          northAgent = listHotline[i];
        }
      }
      return [
        {
          name: VXR_CONTACT_INFO.SOUTH.NAME[locale],
          hotline: southAgentNumbers,
          workingDayInfo: intl.formatMessage(
            { id: 'booking.contactInfo.workingDayInfo' },
            {
              fromDay: DAY_OF_WEEK[southAgent.working_time[0].days[0]][locale],
              toDay: DAY_OF_WEEK[southAgent.working_time[0]
                .days[southAgent.working_time[0].days.length - 1]][locale],
            },
          ),
          workingTimeInfo: `${southAgent.working_time[0].from} - ${southAgent.working_time[0].to}`,
        },
        {
          name: VXR_CONTACT_INFO.NORTH.NAME[locale],
          hotline: northAgentNumbers,
          workingDayInfo: intl.formatMessage(
            { id: 'booking.contactInfo.workingDayInfo' },
            {
              fromDay: DAY_OF_WEEK[northAgent.working_time[0].days[0]][locale],
              toDay: DAY_OF_WEEK[northAgent.working_time[0]
                .days[southAgent.working_time[0].days.length - 1]][locale],
            },
          ),
          workingTimeInfo: `${northAgent.working_time[0].from} - ${northAgent.working_time[0].to}`,
        },
      ];
    } if (booking_type === BOOKING_TYPE.DEFAULT) {
      return get(tripInfo, 'hotline', []).map(item => (
        {
          name: item.name,
          hotline: item.phone_info ? item.phone_info.split(/[,–]/).filter(el => el !== '') : [],
          workingDayInfo: (item.working_from_time && item.working_to_time) ? intl.formatMessage(
            { id: 'booking.contactInfo.workingDayInfo' },
            {
              fromDay: item.working_from_time,
              toDay: item.working_to_time,
            },
          ) : null,
        }
      )).filter(el => el.hotline.length > 0);
    }

    return null;
  }

  sendShowModalEvent = (numStep) => {
    let gaEvent = GA_BOOKING_BOARDING_POINT_SELECTION_EVENT;
    if (numStep === BOOKING_STEP.SELECT_DROP_OFF_AREA) {
      gaEvent = GA_BOOKING_DROPPING_POINT_SELECTION_EVENT;
    }
    this.sendGAEventTracking(gaEvent, 'Enter pick-up point address');
  }

  sendTypeAddressEvent = (numStep) => {
    let gaEvent = GA_BOOKING_BOARDING_POINT_SELECTION_TYPE_EVENT;
    if (numStep === BOOKING_STEP.SELECT_DROP_OFF_AREA) {
      gaEvent = GA_BOOKING_DROPPING_POINT_SELECTION_TYPE_EVENT;
    }
    this.sendGAEventTracking(gaEvent, 'Fill address');
  }

  sendGATrackingCustomerInfo = (value) => {
    this.sendGAEventTracking(GA_BOOKING_CONTACT_INFO_TYPE_EVENT, value);
  }

  sendGATrackingContactInfo = () => {
    const {
      booking_type,
      query: { fare, trip_code },
    } = this.props;
    this.sendGAEventTracking(GA_MAIN_PHONE_CALL_BOOKING_EVENT, 'Phone call');
    if (booking_type === BOOKING_TYPE.CALLING) {
      this.props.sendEventTracking({
        type: GTM_ADD_TO_CARD,
        trip_code,
        totalTicketsPrice: Number(fare),
        quantity: 1,
      });
    }
  };

  getAreaSelectionProps = (step) => {
    const {
      bookingReducer: { tripInfo, areaPoints },
      intl,
    } = this.props;
    let key;
    let area;
    let labelTitleId;
    let listPointsData;
    if (step === BOOKING_STEP.SELECT_PICK_UP_AREA) {
      key = 'pickupPoint';
      labelTitleId = 'booking.selectArea.pickupSelection.title';
      area = get(tripInfo, 'area.from.name');
      listPointsData = this.generateAreaPointData(get(areaPoints, `${key}s`), step);
    } else {
      key = 'dropOffPoint';
      labelTitleId = 'booking.selectArea.dropOffSelection.title';
      area = get(tripInfo, 'area.to.name');
      listPointsData = this.generateAreaPointData(get(areaPoints, `${key}s`), step);
    }

    return {
      area,
      labelTitle: intl.formatMessage(
        { id: labelTitleId },
        { pointText: pluralize('point', listPointsData.length) },
      ),
      listPoints: listPointsData,
      key,
      showModalEvent: () => { this.sendTypeAddressEvent(step) },
      typeAddressEvent: () => { this.sendTypeAddressEvent(step) },
    }
  }

  updateEating = (e) => {
    const {
      bookingData,
    } = this.props;

    this.sendGAEventTracking(GA_BOOKING_SERVICE_EVENT, 'Select reserved meal');
    this.props.updateBookingData(
      Object.assign(
        {},
        bookingData,
        { isSelectEating: e.target.checked },
      ),
    );
  }

  updateEatingState = (e) => {
    this.setState({
      isSelectEatingState: e.target.checked,
    })
  }

  getBookingContent = () => {
    const {
      bookingData,
      bookingReducer: { seatTemplate, tripInfo },
      query: { step },
      openAlertMessage,
      intl,
      booking_type,
    } = this.props;
    const {
      customerInfo,
      areaSelectionValue,
    } = bookingData;
    const {
      listSeatBookedState,
      seatBookingDataState,
      isSelectEatingState,
    } = this.state;
    const { maxBookingTicket, minBookingTicket } = seatBookingDataState;
    const numStep = Number(step);
    const { route } = tripInfo;
    const agents = this.formatAgents();
    const contactInfoProps = {
      statusMessage: intl.formatMessage({ id: 'booking.contactInfo.statusMessage' }),
      listDepartureInfos: [
        {
          time: intl.formatMessage({ id: 'booking.contactInfo.boardingAt' }, { time: route.departure.time }),
          fromName: intl.formatMessage({ id: 'booking.contactInfo.fromName' }, { fromName: route.departure.name }),
          address: route.departure.address,
        },
        {
          time: intl.formatMessage({ id: 'booking.contactInfo.droppingAt' }, { time: route.destination.time }),
          fromName: intl.formatMessage({ id: 'booking.contactInfo.toName' }, { toName: route.destination.name }),
          address: route.destination.address,
        },
      ],
      listAgents: booking_type !== BOOKING_TYPE.CALLING ? agents : null,
      vxrHotline: {
        workingDate: intl.formatMessage({ id: 'booking.working.date' }),
        workingTime: intl.formatMessage({ id: 'booking.working.time' }),
        hotlineFee: intl.formatMessage({ id: 'booking.hotline.fee' }),
        hotline: this.props.vxrHotline.booking_hotline,
      },
      workingInfo: {
        title: booking_type === BOOKING_TYPE.CALLING ? intl.formatMessage({ id: 'booking.contactInfo.contactVXR' }) : intl.formatMessage({ id: 'booking.contactInfo.contactBusOperator' }),
      },
      areaTitle: intl.formatMessage({ id: 'booking.servicesSelection.areaTitle' }),
      onClick: this.sendGATrackingContactInfo,
    };
    const pickUpSelectionProps = this.getAreaSelectionProps(BOOKING_STEP.SELECT_PICK_UP_AREA);
    const dropOffSelectionProps = this.getAreaSelectionProps(BOOKING_STEP.SELECT_DROP_OFF_AREA);
    const totalTicketsPrice = this.getTotalTicketsPrice();
    const totalSurcharge = this.getTotalSurchargePoint(get(areaSelectionValue, 'pickupPoint.surcharge', 0)) + this.getTotalSurchargePoint(get(areaSelectionValue, 'dropOffPoint.surcharge', 0));
    switch (booking_type) {
      case BOOKING_TYPE.ONLINE:
      case BOOKING_TYPE.REGISTER:
        return (
          <BookingStepContainer>
            <div className={!isEmpty(listSeatBookedState) || booking_type === BOOKING_TYPE.REGISTER ? 'is-display-footer' : 'select-seat-content'}>
              {
              (!step || numStep === BOOKING_STEP.SELECT_SEAT)
              && booking_type === BOOKING_TYPE.ONLINE
              && (
                <>
                  <SeatTemplateSelection
                    seatTemplate={seatTemplate}
                    getValue={this.updateSeatTemplateData}
                    listSeatBooked={listSeatBookedState}
                    updateOpenAlertMessage={this.updateOpenAlertMessage}
                    openAlertMessage={openAlertMessage}
                    sendGAEventTracking={this.sendGAEventTracking}
                    maxBookingTicket={maxBookingTicket}
                  />
                  {
                    !!get(tripInfo, 'isDeposit') && (
                      <DepositOnlineMessage>{intl.formatMessage({ id: 'booking.ticket.depositMessage' })}</DepositOnlineMessage>
                    )
                  }
                  {
                    tripInfo.eatingFare > 0
                    && (
                    <div className="service-info">
                      <div className="title">{intl.formatMessage({ id: 'booking.servicesSelection.otherServices' })}</div>
                      <div className="checkbox-content">
                        <Checkbox onChange={this.updateEatingState} checked={isSelectEatingState}>
                          <span>{intl.formatMessage({ id: 'booking.servicesSelection.otherServices.eatingLabel' })}</span>
                          <Currency number={tripInfo.eatingFare} />
                          <span>{intl.formatMessage({ id: 'booking.servicesSelection.otherServices.unit' })}</span>
                        </Checkbox>
                      </div>
                    </div>
                    )
                  }
                </>
              )
            }
              {
              (!step || numStep === BOOKING_STEP.SELECT_SEAT)
              && booking_type === BOOKING_TYPE.REGISTER
              && (
                <>
                  <BookingAlertMessage message={intl.formatMessage({ id: 'booking.BookingTicket.title' })} />
                  <BookingTicketContainer>
                    <BookingTicket
                      bookingTicketLabel={intl.formatMessage({ id: 'booking.BookingTicket.bookingTicketLabel' }, { maxSeat: maxBookingTicket })}
                      getValue={this.updateSeatBookingData}
                      inputLabel={intl.formatMessage({ id: 'booking.BookingTicket.inputLabel' })}
                      defaultValue={get(this.props, 'bookingData.seatBookingData.totalTickets', 1) || minBookingTicket}
                      min={minBookingTicket}
                      max={maxBookingTicket}
                    />
                  </BookingTicketContainer>
                  {
                    tripInfo.eatingFare > 0
                    && (
                    <div className="service-info">
                      <div className="title">{intl.formatMessage({ id: 'booking.servicesSelection.otherServices' })}</div>
                      <div className="checkbox-content">
                        <Checkbox onChange={this.updateEatingState} checked={isSelectEatingState}>
                          <span>{intl.formatMessage({ id: 'booking.servicesSelection.otherServices.eatingLabel' })}</span>
                          <Currency number={tripInfo.eatingFare} />
                          <span>{intl.formatMessage({ id: 'booking.servicesSelection.otherServices.unit' })}</span>
                        </Checkbox>
                      </div>
                    </div>
                    )
                  }
                </>
              )
            }
              {
              numStep === BOOKING_STEP.SELECT_PICK_UP_AREA
              && (
                <AreaPointSelection
                  selectionProps={pickUpSelectionProps}
                  getValue={this.updateAreaPointsValue}
                />
              )
            }
              {
              numStep === BOOKING_STEP.SELECT_DROP_OFF_AREA
              && (
                <AreaPointSelection
                  selectionProps={dropOffSelectionProps}
                  getValue={this.updateAreaPointsValue}
                />
              )
            }
              {
              numStep === BOOKING_STEP.CUSTOMER_INFO
              && (
                <CustomerInfoForm
                  contryCodeResource={this.props.contryCodeResource}
                  customerInfo={customerInfo}
                  previousPage={this.previousPage}
                  getValue={this.updateCustomerInfoValue}
                  submitTicketData={this.submitTicketData}
                  sendGAEventTracking={this.sendGATrackingCustomerInfo}
                  bookingData={bookingData}
                  tripInfo={tripInfo}
                  totalTicketsPrice={totalTicketsPrice}
                  totalSurcharge={totalSurcharge}
                />
              )
            }
            </div>
          </BookingStepContainer>
        );
      case BOOKING_TYPE.DEFAULT:
        return (
          <BookingStepContainer calling>
            <BookingContactInfo {...contactInfoProps} />
          </BookingStepContainer>
        );
      case BOOKING_TYPE.CALLING: {
        return (
          <BookingStepContainer calling>
            <BookingContactInfo {...contactInfoProps} />
          </BookingStepContainer>
        );
      }

      default:
        return {}
    }
  };

  updateSeatTemplateDataReducer = () => {
    const { bookingData } = this.props;
    const { listSeatBookedState, isSelectEatingState } = this.state;
    this.props.updateBookingData(
      Object.assign(
        {},
        bookingData,
        { seatData: { listSeatBooked: listSeatBookedState } },
        {
          isSelectEating: isSelectEatingState,
        },
      ),
    );
    this.sendGAEventTracking(GA_MAIN_BOOKING_EVENT, 'Next button')
    this.nextPage();
  }

  updateSeatDataReducer = () => {
    const { bookingData } = this.props;
    const { seatBookingDataState, isSelectEatingState } = this.state;
    this.props.updateBookingData(Object.assign(
      {},
      bookingData,
      {
        seatBookingData: seatBookingDataState,
      },
      {
        isSelectEating: isSelectEatingState,
      },
    ));
    this.sendGAEventTracking(GA_MAIN_REGISTER_BOOKING_EVENT, 'Next button')
    this.nextPage();
  }

  updateBookingData = (bookingDataUpdate) => {
    const { bookingData } = this.props;
    if (bookingDataUpdate) {
      this.props.updateBookingData(
        Object.assign({}, bookingData, bookingDataUpdate),
      );
    }
    this.nextPage();
  }

  openTripDetailModal = (tabKey) => {
    const {
      tripInfo,
      query: {
        trip_code,
      },
    } = this.props;
    this.props.getTripInfoDetail({
      company_id: get(tripInfo, 'operator.id'),
      trip_code,
      timeDeparture: moment(get(tripInfo, 'route.departure_date')),
    });
    this.setState({
      isOpenTripDetailModal: true,
      tripDetailTab: tabKey,
    })
    hideBodyScroll();
  }

  hideTripDetailModal = () => {
    this.setState({
      isOpenTripDetailModal: false,
    });
    this.sendGAEventTracking(GA_BUS_INFO_EVENT_CLICK, 'X button')
    showBodyScroll();
  }

  getBookingFooter = () => {
    const {
      bookingData: {
        customerInfo,
      },
      query: { step },
      intl,
      booking_type,
      tripInfo,
    } = this.props;
    const { listSeatBookedState, seatBookingDataState, isSelectEatingState } = this.state;
    const numStep = Number(step);
    const totalPrice = this.getTotalPrice();
    const numTickets = this.getTotalTickets();
    const bookingSummaryButtonProps = {
      bookingSummaryLabel: {
        seatName: intl.formatMessage({ id: 'booking.bookingSummary.seatLabel' }, { totalTickets: '', seatLabel: pluralize('seat', numTickets) }),
        total: intl.formatMessage({ id: 'booking.seatTemplateSelection.totalLabel' }),
        buttonLabel: intl.formatMessage({ id: 'booking.titleStep.selectPickUpAndDropOff' }),
      },
      listSeatBooked: listSeatBookedState,
      getValue: this.updateSeatTemplateDataReducer,
      eatingFare: isSelectEatingState && get(tripInfo, 'eatingFare') ? get(tripInfo, 'eatingFare') : 0,
    };

    return (
      <BookingFooterContainer>
        {
          (!step || numStep === BOOKING_STEP.SELECT_SEAT)
          && booking_type === BOOKING_TYPE.REGISTER
          && (
            <FooterContainer isBottom hiddenBorder>
              <div className="booking-seat-data-summary">
                <span>
                  {intl.formatMessage({ id: 'booking.bookingSummary.seatLabel' }, { totalTickets: seatBookingDataState.totalTickets > 10 ? seatBookingDataState.totalTickets : `0${seatBookingDataState.totalTickets}`, seatLabel: pluralize('seat', seatBookingDataState.totalTickets) })}
                </span>
                <CircleDotIcon />
                <span>
                  <span>
                    {intl.formatMessage({ id: 'booking.seatTemplateSelection.totalLabel' })}
                  </span>
                  <span>:</span>
                  {' '}
                  <Currency number={totalPrice} />
                </span>
                {
                  !!get(tripInfo, 'isDeposit') && (
                    <DepositRegisterMessage>{intl.formatMessage({ id: 'booking.ticket.depositMessage' })}</DepositRegisterMessage>
                  )
                }
              </div>
              <BookingFooter
                buttonLabel={intl.formatMessage({ id: 'booking.titleStep.selectPickUpAndDropOff' })}
                isDisabled={false}
                onClick={this.updateSeatDataReducer}
              />
            </FooterContainer>
          )
        }
        {
          (!step || numStep === BOOKING_STEP.SELECT_SEAT)
          && booking_type === BOOKING_TYPE.ONLINE
          && !isEmpty(listSeatBookedState) && (
            <div className="booking-footer-content">
              <FooterContainer>
                <div className="seat-template-footer">
                  <BookingSummaryButton
                    {...bookingSummaryButtonProps}
                  />
                </div>
              </FooterContainer>
            </div>
          )
        }
        {
          numStep === BOOKING_STEP.CUSTOMER_INFO
          && (booking_type === BOOKING_TYPE.ONLINE || booking_type === BOOKING_TYPE.REGISTER)
          && (
            <FooterContainer>
              <BookingFooter
                buttonLabel={intl.formatMessage({ id: 'booking.customerInfo.reservation' })}
                isDisabled={get(customerInfo, 'hasError') === undefined ? true : get(customerInfo, 'hasError')}
                onClick={this.submitTicketData}
                leftComponent={(
                  <BookingPriceInfo
                    bookingPriceInfo={{
                      numTickets,
                      seatLabel: intl.formatMessage({ id: 'booking.bookingSummary.seatLabel' }, { totalTickets: '', seatLabel: pluralize('seat', numTickets) }),
                      totalPrice,
                      link: {
                        label: intl.formatMessage({ id: 'booking.customerInfo.linkBookingSummaryLabel' }),
                        onClick: this.showPopupBookingInfo,
                      },
                    }}
                  />
                )}
              />
            </FooterContainer>
          )
        }
        {
          numStep === BOOKING_STEP.SELECT_SEAT && (
            <div className="route-info-menu">
              <div
                className="route-info-item"
                onClick={() => this.openTripDetailModal(TAB_KEYS.AMENITIES)}
              >
                {intl.formatMessage({ id: 'booking.tripDetailInfo.tabLabel.busInfo' })}
              </div>
              <div
                className="route-info-item"
                onClick={() => this.openTripDetailModal(TAB_KEYS.REFUND_POLICY)}
              >
                {intl.formatMessage({ id: 'booking.tripDetailInfo.tabLabel.refundPolicy' })}
              </div>
              <div
                className="route-info-item"
                onClick={() => this.openTripDetailModal(TAB_KEYS.REVIEWS)}
              >
                {intl.formatMessage({ id: 'booking.tripDetailInfo.tabLabel.reviews' })}
              </div>
            </div>
          )
        }
      </BookingFooterContainer>
    );
  };

  showPopupBookingInfo = () => {
    this.sendGAEventTracking(GA_BOOKING_CONTACT_INFO_EVENT, 'Booking info');
    this.showModal();
  }

  showModal = () => {
    this.setState({
      visibleBookingSumary: true,
    })
    this.sendGAEventTracking(GA_BOOKING_CONTACT_INFO_EVENT, 'Booking info');
  };

  handleCancel = () => {
    this.setState({
      visibleBookingSumary: false,
    })
    this.sendGAEventTracking(GA_BOOKING_EDIT_EVENT, 'Close button');
  };

  getTotalTickets = () => {
    const {
      booking_type,
      query: {
        step,
      },
      bookingData: {
        seatData, seatBookingData,
      },
    } = this.props;
    const { listSeatBookedState, seatBookingDataState } = this.state;
    let numTickets = 0;
    if (Number(step) === BOOKING_STEP.CUSTOMER_INFO) {
      if (booking_type === BOOKING_TYPE.REGISTER) {
        numTickets = Number(get(seatBookingData, 'totalTickets'), 0);
      } else {
        numTickets = get(seatData, 'listSeatBooked', []).length || 0;
      }
    } else if (booking_type === BOOKING_TYPE.REGISTER) {
      numTickets = Number(get(seatBookingDataState, 'totalTickets'), 0);
    } else {
      numTickets = listSeatBookedState.length || 0;
    }

    return numTickets;
  }

  getTotalSurchargePoint = (surcharge) => {
    const totalTickets = this.getTotalTickets();
    return surcharge * totalTickets;
  }

  getTotalSurchargePrice = () => {
    const {
      bookingData: {
        areaSelectionValue,
      },
    } = this.props;
    let totalSurcharge = 0;
    forOwn(areaSelectionValue, (item) => {
      if (get(item, 'surcharge_description') !== 'Operator' && get(item, 'surcharge_type') !== 1) {
        totalSurcharge += get(item, 'surcharge', 0);
      }
    });
    return this.getTotalSurchargePoint(totalSurcharge);
  }

  getTotalTicketsPrice = () => {
    const {
      bookingData: {
        seatData,
      },
      booking_type,
    } = this.props;
    const { seatBookingDataState } = this.state;
    let totalTicketsPrice = 0
    if (booking_type === BOOKING_TYPE.REGISTER) {
      totalTicketsPrice = get(seatBookingDataState, 'totalPrice');
    } else if (booking_type === BOOKING_TYPE.ONLINE) {
      const { listSeatBooked } = seatData;
      totalTicketsPrice = sumBy(listSeatBooked, 'fare');
    }
    return totalTicketsPrice + this.getTotalEatingFare();
  }

  getTotalEatingFare = () => {
    const {
      tripInfo,
    } = this.props;
    const { isSelectEatingState } = this.state;
    const { eatingFare } = tripInfo;

    return isSelectEatingState ? this.getTotalTickets() * eatingFare : 0;
  }

  getTotalPrice = () => {
    const {
      bookingData: {
        areaSelectionValue,
      },
    } = this.props;
    const totalTicketsPrice = this.getTotalTicketsPrice();
    const totalSurchargePickUp = this.getTotalSurchargePoint(get(areaSelectionValue, 'pickupPoint.surcharge', 0));
    const totalSurchargeDropOff = this.getTotalSurchargePoint(get(areaSelectionValue, 'dropOffPoint.surcharge', 0));
    const totalSurchargePrice = totalSurchargePickUp + totalSurchargeDropOff;
    return totalTicketsPrice + totalSurchargePrice;
  }

  getListSeatCode = () => {
    const {
      bookingData: {
        seatData,
      },
      booking_type,
    } = this.props;
    let listSeatCode = '';
    if (booking_type === BOOKING_TYPE.ONLINE && get(seatData, 'listSeatBooked')) {
      listSeatCode = seatData.listSeatBooked.map(item => item.seat_code).toString();
    }

    return listSeatCode;
  }

  redirectCompanyDetailPage = () => {
    this.props.loading();
    const {
      locale,
      query: {
        trip_code,
        from,
        to,
      },
      tripInfo,
    } = this.props;
    this.sendGAEventTracking(GA_MAIN_BOOKING_EVENT, 'Info button');
    this.props.clearCompanyReviewData();
    Router.pushRoute(
      'bookingCompanyInfo',
      {
        lang: locale,
        trip_code,
        company_id: get(tripInfo, 'operator.id'),
        from,
        to,
      },
    );
  }

  submitTicketData = () => {
    this.props.loading();
    const {
      booking_type,
      query: { trip_code, aid },
      bookingData: {
        customerInfo,
        seatBookingData,
        seatData,
        isSelectEating,
        areaSelectionValue,
      },
    } = this.props;
    localStorage.setItem('customerInfo', JSON.stringify({ ...customerInfo, note: '' }))
    const ticketData = {
      trip_code,
      customer_phone: customerInfo.phone,
      customer_name: customerInfo.userName,
      customer_email: customerInfo.email,
      note: customerInfo.note || null,
      country_code: customerInfo.countryCode,
      pickup_id: get(areaSelectionValue, 'pickupPoint.transfer') ? null : get(areaSelectionValue, 'pickupPoint.id'),
      pickup: get(areaSelectionValue, 'pickupPoint.transfer') ? null : getPointName(get(areaSelectionValue, 'pickupPoint')),
      transfer_id: get(areaSelectionValue, 'pickupPoint.transfer') ? get(areaSelectionValue, 'pickupPoint.id') : null,
      transfer: get(areaSelectionValue, 'pickupPoint.transfer') ? getPointName(get(areaSelectionValue, 'pickupPoint'), 1) : null,
      drop_off_point_id: get(areaSelectionValue, 'dropOffPoint.transfer') ? null : get(areaSelectionValue, 'dropOffPoint.id'),
      drop_off_info: getPointName(get(areaSelectionValue, 'dropOffPoint')),
      drop_off_transfer_info: getPointName(get(areaSelectionValue, 'dropOffPoint'), 1),
      arrive_transfer_id: get(areaSelectionValue, 'dropOffPoint.transfer') ? get(areaSelectionValue, 'dropOffPoint.id') : null,
      have_eating: isSelectEating ? 1 : 0,
      user_agent: navigator.userAgent,
    };
    if (customerInfo.countryCode !== 'VN') {
      ticketData.other_contact = customerInfo.otherContact;
    }
    const totalTickets = this.getTotalTickets();
    if (booking_type === BOOKING_TYPE.REGISTER) {
      ticketData.amount = seatBookingData.totalTickets;
    } else if (booking_type === BOOKING_TYPE.ONLINE) {
      const { listSeatBooked } = seatData;
      ticketData.seats = listSeatBooked.map(item => `${item.seat_code}|${item.coach}|${item.row_num}|${item.col_num}`).join(',');
    }
    if (aid) {
      ticketData.affiliate_id = +aid;
    }
    const totalTicketsPrice = this.getTotalTicketsPrice();
    let revenue = totalTicketsPrice;
    if (get(areaSelectionValue, 'pickupPoint').surcharge_type && get(areaSelectionValue, 'pickupPoint').surcharge_description !== 'Operator') {
      revenue += this.getTotalSurchargePoint(get(areaSelectionValue, 'pickupPoint.surcharge', 0));
    }
    if (get(areaSelectionValue, 'dropOffPoint').surcharge_type && get(areaSelectionValue, 'dropOffPoint').surcharge_description !== 'Operator') {
      revenue += this.getTotalSurchargePoint(get(areaSelectionValue, 'dropOffPoint.surcharge', 0));
    }
    this.sendGAEventTracking(GA_BOOKING_CONTACT_INFO_EVENT, 'Reservation button');
    this.props.sendEventTracking({
      type: GTM_ADD_TO_CARD,
      trip_code,
      totalTicketsPrice: revenue,
      quantity: totalTickets,
    });
    this.props.submitTicket({
      booking_type,
      ticketData,
    });
  }

  sendGTMTracking = (type) => {
    const {
      query: { trip_code },
    } = this.props;
    this.props.sendEventTracking({
      type,
      trip_code,
    })
  }

  sendGAEventTracking = (type, value) => {
    this.props.sendEventTracking({
      type,
      value,
    })
  }

  render() {
    const {
      bookingData: {
        seatData, seatBookingData, areaSelectionValue, customerInfo,
      },
      bookingReducer: { tripInfo, booking_type },
      intl,
      tripInfoDetail,
    } = this.props;
    const {
      visibleBookingSumary,
      isSelectEatingState,
      isOpenTripDetailModal,
      tripDetailTab,
    } = this.state;
    const totalPrice = this.getTotalPrice();
    const headerInfo = this.getHeaderInfo();
    const bookingContent = this.getBookingContent();
    const bookingFooter = this.getBookingFooter();
    const numTickets = this.getTotalTickets();
    const listSeatCode = this.getListSeatCode();
    const totalTicketsPrice = this.getTotalTicketsPrice();
    return (
      <BookingWizardContent isOpenTripDetailModal={isOpenTripDetailModal}>
        <Header
          leftComponent={<BackIcon onClick={this.previousPage} />}
          fixed
          borderBottom
        >
          {
            headerInfo
          }
        </Header>
        {
          bookingContent
        }
        {
          bookingFooter
        }
        <ModalContainer
          visible={visibleBookingSumary}
          onCancel={this.handleCancel}
          footer={null}
          transparent={false}
          icon={<CloseIcon />}
        >
          <BookingSummary
            tripInfo={tripInfo}
            seatBookingData={booking_type === BOOKING_TYPE.ONLINE ? seatData : seatBookingData}
            areaSelectionValue={areaSelectionValue}
            customerInfo={customerInfo}
            totalPrice={totalPrice}
            totalSurchargePickUp={this.getTotalSurchargePoint(get(areaSelectionValue, 'pickupPoint.surcharge', 0))}
            totalSurchargeDropOff={this.getTotalSurchargePoint(get(areaSelectionValue, 'dropOffPoint.surcharge', 0))}
            totalTicketsPrice={totalTicketsPrice}
            totalTickets={numTickets}
            listSeatCode={listSeatCode}
            sendGAEventTracking={this.sendGAEventTracking}
            isSelectEating={isSelectEatingState}
            closeModal={this.handleCancel}
          />
        </ModalContainer>
        <ModalContainer
          visible={isOpenTripDetailModal}
          onCancel={this.hideTripDetailModal}
          footer={null}
          transparent={false}
          icon={<CloseIcon />}
        >
          <TripInfoDetail
            intl={intl}
            cancellationPolicy={get(tripInfoDetail, 'cancellationPolicy')}
            utilities={get(tripInfoDetail, 'utilities')}
            companyInfo={get(tripInfoDetail, 'companyInfo')}
            reviews={get(tripInfoDetail, 'companyReviews')}
            images={get(tripInfoDetail, 'companyImages')}
            sendEventTracking={this.props.sendEventTracking}
            tripDetailTab={tripDetailTab}
            getTripReviews={this.props.getTripReviews}
            tripInfo={tripInfo}
            closeModal={this.hideTripDetailModal}
          />
        </ModalContainer>
      </BookingWizardContent>
    );
  }
}

const mapStateToProps = state => ({
  bookingData: state.bookingReducer.bookingData,
  visibleBookingSumary: state.bookingReducer.visibleBookingSumary,
  payloadRoute: state.routeReducer.payload,
  infoScreenRoute: state.routeReducer.infoScreenRoute,
  openAlertMessage: state.bookingReducer.openAlertMessage,
  booking_type: state.bookingReducer.booking_type,
  tripInfo: state.bookingReducer.tripInfo,
  vxrHotline: state.bookingReducer.vxrHotline,
  contryCodeResource: state.bookingReducer.contryCodeResource,
  tripInfoDetail: state.bookingReducer.tripInfoDetail,
});

const mapDispatchToProps = dispatch => ({
  updateBookingData: bindActionCreators(updateBookingDataAction, dispatch),
  updateOpenAlertMessage: bindActionCreators(updateOpenAlertMessage, dispatch),
  clearCompanyReviewData: bindActionCreators(clearCompanyReviewData, dispatch),
  submitTicket: bindActionCreators(submitTicket, dispatch),
  sendEventTracking: bindActionCreators(sendEventTracking, dispatch),
  getTripInfoDetail: bindActionCreators(getTripInfoDetail, dispatch),
  getTripReviews: bindActionCreators(getTripReviews, dispatch),
  resetTripDetailData: bindActionCreators(resetTripDetailData, dispatch),
});

export default injectIntl((
  connect(mapStateToProps, mapDispatchToProps)(
    withReduxSaga({ async: true })(BookingForm),
  )))
