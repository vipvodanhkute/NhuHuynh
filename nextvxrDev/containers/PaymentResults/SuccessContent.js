import React from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import get from 'lodash.get';
import { BOOKING_STATUS } from '#/utils/constants';
import { GTM_PURCHASE_COMPLETE } from '#/containers/PaymentResults/constants';
import ReservedContent from '#/containers/PaymentResults/ReservedContent';
import PaymentCompletedContent from '#/containers/PaymentResults/PaymentCompletedContent';

const SuccessContentContainer = styled.div`
  padding: 15px;
  .thank-alert {
    margin-bottom: 30px;
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
    }
  }
  .instruction-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .important-info {
    color: #ffb400;
    font-weight: bold;
  }
`;

class SuccessContent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentWillMount() {
    const { sendEventTracking } = this.props;
    sendEventTracking({
      type: GTM_PURCHASE_COMPLETE,
    });
  }

  render() {
    const { bookingInfo, intl, handleSendGATracking } = this.props;
    const { bookingStatus } = bookingInfo;

    return (
      <SuccessContentContainer>
        <div className="thank-alert">
          <div className="title">
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatHTMLMessage(
                  { id: 'paymentResults.successContent.thankMessage.title' },
                  { customerName: get(bookingInfo, 'customer.name') },
                ),
              }}
            />
          </div>
          <div className="content">
            <div
              dangerouslySetInnerHTML={{
                __html: intl.formatHTMLMessage(
                  { id: 'paymentResults.successContent.thankMessage.content' },
                  {
                    customerPhone: get(bookingInfo, 'customer.phone'),
                    customerEmail: get(bookingInfo, 'customer.email'),
                  },
                ),
              }}
            />
          </div>
        </div>
        {bookingStatus === BOOKING_STATUS.RESERVED ? (
          <ReservedContent handleSendGATracking={handleSendGATracking} bookingInfo={bookingInfo} />
        ) : (
          <PaymentCompletedContent bookingInfo={bookingInfo} />
        )}
      </SuccessContentContainer>
    );
  }
}

export default injectIntl(SuccessContent);
