import React from 'react'
import get from 'lodash.get'
import styled from 'styled-components'
import TicketInfo from 'vxrd/components/Payment/TicketInfo'

const PlaceInfo = ({
  data: {
    time, date, name, address, mapUrl,
  },
  intl,
}) => (
  <div>
    <div>
      <span>{`${time} · ${date} `}</span>
      <span>{intl.formatMessage({ id: 'ticketInfo.info.estLabel' })}</span>
    </div>
    <div>{name}</div>
    <div>
      {mapUrl ? <a href={mapUrl} target="_blank" rel="noopener noreferrer">{address}</a> : address }
    </div>
  </div>
)

const TotalStyled = styled.div`
  color: #484848;
  font-size: 14px;
  font-weight: bold;
  padding: 4px 0px 8px;
`
const TotalLabelStyled = styled(TotalStyled)`
  text-align: right;

`

const RightStyled = styled.div`
  text-align: right;
`

export default ({ bookingInfo, intl, ...props }) => {
  const data = {}
  data.header = {
    label: intl.formatMessage({ id: 'ticketInfo.header.label' }),
    code: {
      label: intl.formatMessage({ id: 'ticketInfo.header.code' }),
      value: get(bookingInfo, 'bookingCode'),
    },
  }
  const pickupData = {
    time: get(bookingInfo, 'pickupInfo.pickupTime'),
    date: get(bookingInfo, 'pickupInfo.pickupDate'),
    name: get(bookingInfo, 'pickupInfo.namePickupPoint'),
    address: get(bookingInfo, 'pickupInfo.addressPickupPoint'),
    mapUrl: get(bookingInfo, 'mapFromUrl'),
  }
  const dropOffData = {
    time: get(bookingInfo, 'dropOffInfo.dropOffTime'),
    date: get(bookingInfo, 'dropOffInfo.dropOffDate'),
    name: get(bookingInfo, 'dropOffInfo.nameDropOffPoint'),
    address: get(bookingInfo, 'dropOffInfo.addressDropOffPoint'),
    mapUrl: get(bookingInfo, 'mapToUrl'),
  }
  data.info = {
    route: {
      trip: {
        label: intl.formatMessage({ id: 'ticketInfo.info.tripName' }),
        value: get(bookingInfo, 'trip.name'),
        alwayDisplay: true,
      },
      company: {
        label: intl.formatMessage({ id: 'tickedInfo.info.company' }),
        value: get(bookingInfo, 'companyName'),
        alwayDisplay: true,
      },
      pickup: {
        label: intl.formatMessage({ id: 'ticketInfo.info.pickup' }),
        value: <PlaceInfo intl={intl} data={pickupData} />,
        alwayDisplay: true,
      },
      dropOff: {
        label: intl.formatMessage({ id: 'ticketInfo.info.dropOff' }),
        value: <PlaceInfo intl={intl} data={dropOffData} />,
        alwayDisplay: true,
      },
      seatCodes: {
        label: get(bookingInfo, 'is_not_seat_code') ? intl.formatMessage({ id: 'ticketInfo.info.seatQuantity' }) : intl.formatMessage({ id: 'ticketInfo.info.seatCodes' }),
        value: get(bookingInfo, 'seats'),
        alwayDisplay: true,
      },
    },
    customer: {
      name: {
        label: intl.formatMessage({ id: 'ticketInfo.customer.name' }),
        value: get(bookingInfo, 'customer.name'),
        alwayDisplay: true,
      },
      phone: {
        label: intl.formatMessage({ id: 'ticketInfo.customer.phone' }),
        value: get(bookingInfo, 'customer.phone'),
        alwayDisplay: true,
      },
      email: {
        label: intl.formatMessage({ id: 'ticketInfo.customer.email' }),
        value: get(bookingInfo, 'customer.email'),
        alwayDisplay: true,
      },
      otherContact: {
        label: intl.formatMessage({ id: 'ticketInfo.customer.otherContact' }),
        value: get(bookingInfo, 'customer.other_contact'),
        alwayDisplay: true,
      },
      note: {
        label: intl.formatMessage({ id: 'ticketInfo.customer.note' }),
        value: get(bookingInfo, 'customer.note'),
        alwayDisplay: true,
      },
    },
    payment: {
      total: {
        label: <TotalStyled>{intl.formatMessage({ id: 'ticketInfo.payment.total' })}</TotalStyled>,
        value: (
          <TotalLabelStyled>
            {new Intl.NumberFormat().format(get(bookingInfo, 'totalPrice'))}
            <small>đ</small>
          </TotalLabelStyled>),
        alwayDisplay: true,
      },
      fare: {
        label: intl.formatMessage({ id: 'ticketInfo.payment.fare' }),
        value: (
          <RightStyled>
            {new Intl.NumberFormat().format(get(bookingInfo, 'totalFare'))}
            <small>đ</small>
          </RightStyled>),
      },
      surcharge: {
        label: intl.formatMessage({ id: 'ticketInfo.payment.surcharge' }),
        value: (
          <RightStyled>
            {new Intl.NumberFormat().format(get(bookingInfo, 'surcharge'))}
            <small>đ</small>
          </RightStyled>),
      },
      discount: {
        label: intl.formatMessage({ id: 'ticketInfo.payment.discount' }),
        value: (
          <RightStyled>
            {`-${new Intl.NumberFormat().format(get(bookingInfo, 'discount'))}`}
            <small>đ</small>
          </RightStyled>),
      },
      coupon: {
        label: intl.formatMessage({ id: 'ticketInfo.payment.coupon' }),
        value: get(bookingInfo, 'coupon') ? (
          <RightStyled>
            <div>
              {`-${new Intl.NumberFormat().format(get(bookingInfo, 'totalCoupon'))}`}
              <small>đ</small>
            </div>
            <div>
              {`(${get(bookingInfo, 'coupon.code')})`}
            </div>
          </RightStyled>
        ) : '',
      },
    },
  }

  return (
    <TicketInfo
      data={data}
      footer={{
        seeMoreText: intl.formatMessage({ id: 'ticketInfo.footer.expand' }),
        collapseText: intl.formatMessage({ id: 'ticketInfo.footer.collapse' }),
      }}
      {...props}
    />
  )
}
