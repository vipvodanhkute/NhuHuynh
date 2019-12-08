import React from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import get from 'lodash.get';

const PaymentCompletedContentContainer = styled.div`
  .iframe-map {
    iframe {
      width: 100%;
      height: 255px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
  .payment-completed-note {
    div {
      margin-bottom: 10px;
    }
  }
`;

class PaymentCompletedContent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {

    };
  }

  render() {
    const {
      bookingInfo,
      intl,
    } = this.props;

    return (
      <PaymentCompletedContentContainer>
        <div className="instruction-title">
          {intl.formatHTMLMessage({ id: 'paymentResults.successContent.paymentCompletedContent.boardingIntruction.title' })}
        </div>
        {
          get(bookingInfo, 'pickupInfo.suggestion') || get(bookingInfo, 'pickupInfo.introduction')
            ? (
              <div>
                {
                  get(bookingInfo, 'pickupInfo.introduction')
                  && (
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: get(bookingInfo, 'pickupInfo.introduction'),
                        }}
                      />
                    </div>
                  )
                }
                {
                  get(bookingInfo, 'pickupInfo.suggestion')
                  && (
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: get(bookingInfo, 'pickupInfo.suggestion'),
                        }}
                      />
                    </div>
                  )
                }
              </div>
            )
            : (
              <div
                dangerouslySetInnerHTML={{
                  __html: intl.formatHTMLMessage(
                    { id: 'paymentResults.successContent.paymentCompletedContent.boardingIntruction.guideDefault' },
                    { mapFromUrl: get(bookingInfo, 'mapFromUrl') },
                  ),
                }}
              />
            )
        }
        <div className="iframe-map">
          <iframe
            title="iframe-google-map"
            frameBorder={0}
            style={{ border: 0 }}
            src={get(bookingInfo, 'displayMapUrl')}
            allowFullScreen
          />
        </div>
        <div
          className="payment-completed-note"
          dangerouslySetInnerHTML={{
            __html: intl.formatHTMLMessage({ id: 'paymentResults.successContent.paymentCompletedContent.note' }),
          }}
        />
      </PaymentCompletedContentContainer>
    );
  }
}

export default injectIntl(PaymentCompletedContent);
