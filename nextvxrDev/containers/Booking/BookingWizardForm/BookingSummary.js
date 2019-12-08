import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import InfoItem from 'vxrd/components/AreaPointSelection/Point/PointSelected';
import TripInfoItem from 'vxrd/components/Base/TripInfoItem';
import get from 'lodash.get';
import pluralize from 'pluralize';
import Header from 'vxrd/components/Layout/Header';
import Button from 'vxrd/components/Antd/Button';
import Icon from 'vxrd/components/Antd/Icon';
import Title from 'vxrd/components/Layout/Header/Title';

const BookingSummaryContainer = styled.div`
  padding: 0 15px 15px 15px;
  button {
    top: -5px;
    position: relative;
  }
  .currency-number {
    font-size: 16px;
  }
  .currency-symbol {
    font-size: 12px;
    top: -4px;
  }

  .booking-info {
    margin-top: 20px;
    .name-area {
      font-size: 14px;
    }
  }
  .services-info {
    margin-top: 20px;
  }
  .edit-ticket-info {
    color: #5090e9;
    span {
      border-bottom: 1px solid;
    }
  }
  .title-service-info {
    font-size: 16px;
    font-weight: bold;
  }
`;

const CloseIconContainer = styled.div`
  button {
    padding: 15px 0px;
    i {
      font-size: 23px !important;
    }
  }
`;

const HeaderContainer = styled.div`
  min-height: 55px;
  border-bottom: 1px solid #e7e3e3;
  margin-bottom: 10px;
  div { 
    font-size: 17px !important;
    min-height: 50px !important;
  }
  button {
    padding-top: 10px;
  }
`;

const TitleContainer = styled(Title)`
  font-size: 17px !important;
  padding-top: 15px;
`;

class BookingSummary extends Component {
  render() {
    const {
      intl,
      tripInfo,
      areaSelectionValue,
      totalTickets,
      listSeatCode,
      totalSurchargePickUp,
      totalSurchargeDropOff,
      totalTicketsPrice,
      isSelectEating,
    } = this.props;
    const strTotalTickets = totalTickets >= 10 ? totalTickets : `0${totalTickets}`;
    return (
      <>
        <HeaderContainer>
          <Header
            rightComponent={(
              <CloseIconContainer>
                <Button label="true" onClick={this.props.closeModal}>
                  <Icon type="close" />
                </Button>
              </CloseIconContainer>
            )}
          >
            <TitleContainer
              title={intl.formatMessage({ id: 'booking.bookingSummary.title' })}
            />
          </Header>
        </HeaderContainer>
        <BookingSummaryContainer>
          <TripInfoItem
            imgURL={get(tripInfo, 'operator.images[0].files.1000x600')}
            totalPrice={totalTicketsPrice + totalSurchargeDropOff + totalSurchargePickUp}
            routeName={`${get(tripInfo, 'area.from.name')} - ${get(tripInfo, 'area.to.name')}`}
            dateDeparture={get(tripInfo, 'dateDeparture')}
            totalLabel={intl.formatMessage({ id: 'booking.bookingSummary.totalLabel' })}
          />
          <div className="booking-info">
            <InfoItem
              isEdit={false}
              LabelAction={get(tripInfo, 'operator.name')}
              name={`${intl.formatMessage({ id: 'booking.bookingSummary.tripLabel' })} ${get(
                tripInfo,
                'route.departure.time',
              )}`}
              labelButton={intl.formatMessage({ id: 'booking.editLabel' })}
              fontSizeTitle="16px"
              onClick={this.setSeatTemplateStep}
              isShowBorder={false}
            />
            <InfoItem
              isEdit={false}
              LabelAction={intl.formatMessage(
                { id: 'booking.bookingSummary.seatLabel' },
                { totalTickets: strTotalTickets, seatLabel: pluralize('seat', totalTickets) },
              )}
              name={listSeatCode}
              price={totalTicketsPrice}
            />
          </div>
          <div className="services-info">
            <div className="title-service-info">{intl.formatMessage({ id: 'booking.bookingSummary.serviceInfo' })}</div>
            <InfoItem
              isEdit={false}
              LabelAction={intl.formatMessage({ id: 'booking.bookingSummary.pickUpTime' })}
              time={get(areaSelectionValue, 'pickupPoint.time')}
              name={get(areaSelectionValue, 'pickupPoint.name')}
              address={get(areaSelectionValue, 'pickupPoint.address')}
              labelButton={intl.formatMessage({ id: 'booking.editLabel' })}
              paymentMethod={get(areaSelectionValue, 'pickupPoint.surchargeMethod')}
              price={totalSurchargePickUp}
              isShowBorder={false}
            />
            <InfoItem
              isEdit={false}
              LabelAction={intl.formatMessage({ id: 'booking.bookingSummary.arriveEstimateTime' })}
              time={get(areaSelectionValue, 'dropOffPoint.time')}
              name={get(areaSelectionValue, 'dropOffPoint.name')}
              address={get(areaSelectionValue, 'dropOffPoint.address')}
              labelButton={intl.formatMessage({ id: 'booking.editLabel' })}
              paymentMethod={get(areaSelectionValue, 'dropOffPoint.surchargeMethod')}
              price={totalSurchargeDropOff}
              isShowBorder={false}
            />
            {
              isSelectEating
              && (
                <div className="eating-service">
                  <strong>{intl.formatMessage({ id: 'booking.servicesSelection.otherServices.eatingIncludedLabel' })}</strong>
                </div>
              )
            }
          </div>
        </BookingSummaryContainer>
      </>
    );
  }
}

export default injectIntl(BookingSummary);
