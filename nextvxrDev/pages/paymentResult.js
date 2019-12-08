import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withReduxSaga from 'next-redux-saga';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import Header from 'vxrd/components/Layout.New/Header';
import DropdownContact from 'vxrd/components/Base/DropdownContact';
import SuccessContent from '#/containers/PaymentResults/SuccessContent';
import TicketInfoWrapper from '#/containers/PaymentResults/TicketInfoWrapper';
import { sendEventTracking } from '#/containers/Device/actions';
import AlertMessage from 'vxrd/components/Base/AlertMessage';
import TitleStatus from 'vxrd/components/Base/AlertMessage/titleStatus';
import Button from 'vxrd/components/Antd/Button';
import LogoIcon from 'vxrd/components/Base/LogoIcon';
import Section from 'vxrd/components/Layout.New/Section';
import {
  getBookingInfo,
} from '#/containers/PaymentResults/actions';
import {
  GA_PAYMENT_FAILED_EVENT,
  GA_BOOKING_CANCLED_EVENT,
  GA_PAYMENT_PROCESSING_EVENT,
  GA_PAYMENT_SUCCESS_EVENT,
  GA_RESERVED_SUCCESS_EVENT,
} from '#/containers/PaymentResults/constants';
import {
  BOOKING_STATUS,
  PAYMENT_SERVICE,
  VXR_INFO,
  URL,
  PAYMENT_METHOD,
} from '#/utils/constants';

const PaymentResultContainer = styled.div`
  background-color: #E3E3E3;
  .header {
    display: flex;
    height: 30px;
    padding: 15px;
    .icon {
      width: 10%;
    }
    .title {
      width: 80%;
      text-align: center;
    }
  }
  .note {
    .title {
      height: 40px;
      background: #F2F2F2;
      font-size: 16px;
      font-weight: bold;
      div {
        padding-left: 20px;
        padding-top: 5px;
      }
    }
    .content {
      padding: 20px;
      .ticket-management-messages {
        margin-bottom: 5px;
      }
      .messages {
        div {
          margin-bottom: 5px;
        }
      }
    }
    div {
      margin-bottom: 5px;
    }
  }
  .button-redirect {
    height: 80px;
    padding: 16px;
    background: #FFFFFF;
    border-top: 1px solid #e4e4e4;
    button {
      width: 100%;
      height: 48px;
      color: #FFFFFF;
      font-size: 16px;
    }
  }
  .redirect-home {
    button {
      background: #007AFF;
    }
  }
  .display-over {
    margin-bottom: 80px;
  }
  .redirect-route-page {
    position: fixed;
    bottom: 0;
    width: 100%;
    button {
      background: #FFB400;
      color: #484848;
    }
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const PaymentResultSection = styled.div`
  margin-bottom: 8px;
  background-color: #fff;
`;
class Index extends React.Component {
  static async getInitialProps({ ctx }) {
    const {
      isServer,
      query,
      store,
    } = ctx;
    const {
      code,
      lang,
      status,
      payment_gateway,
    } = query;
    if (code && lang) {
      store.dispatch(getBookingInfo({ bookingCode: code, lang, paymentGateway: payment_gateway }));
    }

    return {
      isServer,
      query,
      paymentStatus: Number(status),
    };
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpenTicketInfo: false,
    }
  }

  getResultMessage = () => {
    const { bookingInfo, paymentStatus, intl } = this.props;
    const { bookingStatus } = bookingInfo;
    let titleMessage = '';
    let alertMessage = '';
    if (bookingStatus === BOOKING_STATUS.PAID) {
      titleMessage = intl.formatMessage({ id: 'paymentResults.container.titlePage.paymentSuccess' });
    } else if (bookingStatus === BOOKING_STATUS.CANCELED) {
      titleMessage = intl.formatMessage({ id: 'paymentResults.container.titlePage.bookingCanceled' });
      alertMessage = intl.formatMessage({ id: 'paymentResults.container.alertMessage.bookingCanceled' });
    } else if (paymentStatus === PAYMENT_SERVICE.SUCCESS) {
      titleMessage = intl.formatMessage({ id: 'paymentResults.container.titlePage.bookingSuccess' });
    } else if (paymentStatus === PAYMENT_SERVICE.PROCESSING) {
      titleMessage = intl.formatMessage({ id: 'paymentResults.container.titlePage.paymentProcessing' });
      alertMessage = intl.formatMessage({ id: 'paymentResults.container.alertMessage.paymentProcessing' });
    } else {
      titleMessage = intl.formatMessage({ id: 'paymentResults.container.titlePage.paymentError' });
      alertMessage = intl.formatMessage({ id: 'paymentResults.container.alertMessage.paymentError' });
    }

    return { titleMessage, alertMessage };
  }

  onClickCollapseExpand = () => {
    this.setState(preState => ({ isOpenTicketInfo: !preState.isOpenTicketInfo }))
  }

  reloadPage = () => {
    this.props.sendEventTracking({
      type: GA_PAYMENT_PROCESSING_EVENT,
      value: 'Button cập nhật trạng thái vé',
    });
    window.location.reload();
  }

  getPaymentResultContent = () => {
    const {
      bookingInfo,
      paymentStatus,
      intl,
    } = this.props;
    const { bookingStatus } = bookingInfo;
    if (bookingStatus === BOOKING_STATUS.CANCELED
      || (bookingStatus === BOOKING_STATUS.RESERVED && paymentStatus !== PAYMENT_SERVICE.SUCCESS)
    ) {
      const { titleMessage, alertMessage } = this.getResultMessage();
      let buttonProps = null;
      if (paymentStatus === PAYMENT_SERVICE.PROCESSING) {
        buttonProps = {
          label: intl.formatMessage({ id: 'paymentResults.container.buttonLabel.paymentProcessing' }),
          onClick: this.reloadPage,
        }
      }

      const alertMessagqProps = {
        bookingStatus,
        paymentStatus,
        titleMessage,
        alertMessage,
        buttonProps,
      }
      return <AlertMessage {...alertMessagqProps} />
    }

    return (
      <PaymentResultSection>
        <SuccessContent
          bookingInfo={bookingInfo}
          paymentStatus={paymentStatus}
          sendEventTracking={this.props.sendEventTracking}
          handleSendGATracking={this.handleSendGATracking}
        />
      </PaymentResultSection>
    );
  }

  handleRedirectButton = (redirectUrl) => {
    const {
      locale,
      bookingInfo,
    } = this.props;
    if (!redirectUrl) {
      this.handleSendGATracking('Button về trang chủ');
    } else if (redirectUrl === get(bookingInfo, 'redirectUrl.bookNewTicket')) {
      this.handleSendGATracking('Button đặt lại vé');
    } else if (redirectUrl === get(bookingInfo, 'redirectUrl.bookRoundTripTicket')) {
      this.handleSendGATracking('Button đặt vé khứ hồi');
    }

    window.location.href = `${URL.BASE_URL}/${locale}${redirectUrl ? `/${redirectUrl}` : ''}`;
  }

  getTrackingPageEvent = () => {
    const { bookingInfo, paymentStatus } = this.props;
    const { bookingStatus } = bookingInfo;
    let eventType;
    if (bookingStatus === BOOKING_STATUS.PAID) {
      eventType = GA_PAYMENT_SUCCESS_EVENT;
    } if (bookingStatus === BOOKING_STATUS.CANCELED) {
      eventType = GA_BOOKING_CANCLED_EVENT;
    } else if (paymentStatus === PAYMENT_SERVICE.SUCCESS) {
      eventType = GA_RESERVED_SUCCESS_EVENT;
    } else if (paymentStatus === PAYMENT_SERVICE.PROCESSING) {
      eventType = GA_PAYMENT_PROCESSING_EVENT;
    } else {
      eventType = GA_PAYMENT_FAILED_EVENT;
    }
    return eventType;
  }

  handleSendGATracking = (value) => {
    const type = this.getTrackingPageEvent();
    this.props.sendEventTracking({
      type,
      value,
    })
  }

  render() {
    const {
      bookingInfo,
      paymentStatus,
      intl,
    } = this.props;
    const { isOpenTicketInfo } = this.state
    const {
      bookingStatus,
      // isDeposit,
      boPhoneInfo,
      paymentTypeId,
    } = bookingInfo;
    const { titleMessage } = this.getResultMessage();
    const patmentResultContent = this.getPaymentResultContent();
    const isDisplayBookRoundTicket = bookingStatus === BOOKING_STATUS.PAID
      || (bookingStatus === BOOKING_STATUS.RESERVED && paymentStatus === PAYMENT_SERVICE.SUCCESS);
    const isDisplayBookNewTicket = bookingStatus === BOOKING_STATUS.CANCELED;
    const listContact = [
      {
        label: intl.formatMessage({ id: 'paymentResults.container.dropdownContact.vxrLabel' }),
        phoneInfo: [VXR_INFO.HOTLINE],
      },
    ];
    if (!isEmpty(boPhoneInfo)
        && (paymentTypeId === PAYMENT_METHOD.AT_BUS_AGENT.id
          || bookingStatus === BOOKING_STATUS.PAID)
    ) {
      listContact.unshift({
        label: intl.formatMessage({ id: 'paymentResults.container.dropdownContact.boLabel' }),
        phoneInfo: boPhoneInfo,
      })
    }

    return (
      <>
        <PaymentResultContainer>
          <Header fixed>
            <Header.Left>
              <Button label="true" onClick={() => this.handleRedirectButton('')}>
                <LogoIcon type="left" />
              </Button>
            </Header.Left>
            <Header.Body>
              <Title>{titleMessage}</Title>
            </Header.Body>
            <Header.Right />
          </Header>
          <TitleStatus
            paymentStatus={paymentStatus}
            bookingStatus={bookingStatus}
            titleMessage={titleMessage}
          />
          {
            patmentResultContent
          }
          <PaymentResultSection>
            <TicketInfoWrapper
              intl={intl}
              bookingInfo={bookingInfo}
              isOpen={isOpenTicketInfo}
              onClickCollapseExpand={this.onClickCollapseExpand}
            />
          </PaymentResultSection>
          <PaymentResultSection>
            {
              (bookingStatus === BOOKING_STATUS.PAID
                || (bookingStatus === BOOKING_STATUS.RESERVED
                && paymentStatus === PAYMENT_SERVICE.SUCCESS)
              )
              && (
                <Section className="note" title={intl.formatMessage({ id: 'paymentResults.container.note.title' })}>
                  <div className="ticket-management-messages">
                    <span>{intl.formatMessage({ id: 'paymentResults.container.note.content.ticketManagent.note' })}</span>
                    <span>
                      <a href={get(bookingInfo, 'ticketManamentUrl')} onClick={() => this.handleSendGATracking('Button quản lí vé')} target="_blank">{intl.formatMessage({ id: 'paymentResults.container.note.content.ticketManagent.linkLabel' })}</a>
                    </span>
                  </div>
                  <div
                    className="messages"
                    dangerouslySetInnerHTML={{
                      __html: intl.formatHTMLMessage(
                        { id: 'paymentResults.container.note.content' },
                      ),
                    }}
                  />
                  {/* {
                    !!isDeposit && (
                      <div>
                        {intl.formatMessage({ id: 'paymentResults.container.note.isDepositContent' })}
                      </div>
                    )
                  } */}
                </Section>
              )
            }
          </PaymentResultSection>
          <PaymentResultSection>
            <DropdownContact
              title={intl.formatMessage({ id: 'paymentResults.container.dropdownContact.title' })}
              contactLabel={intl.formatMessage({ id: 'paymentResults.container.dropdownContact.contactLabel' })}
              dropdownOnClick={() => this.handleSendGATracking('Button liên hệ tổng đài')}
              linkOnClick={() => this.handleSendGATracking('Button gọi hotline')}
              data={listContact}
            />
          </PaymentResultSection>
          <div className={`button-redirect redirect-home ${isDisplayBookRoundTicket || isDisplayBookNewTicket ? 'display-over' : ''}`}>
            <Button onClick={() => this.handleRedirectButton('')}>
              {intl.formatMessage({ id: 'paymentResults.container.button.backToHome' })}
            </Button>
          </div>
          {
            isDisplayBookRoundTicket
            && (
              <div className="button-redirect redirect-route-page">
                <Button onClick={() => this.handleRedirectButton(get(bookingInfo, 'redirectUrl.bookRoundTripTicket'))}>
                  {intl.formatMessage({ id: 'paymentResults.container.button.bookRoundTicket' })}
                </Button>
              </div>
            )
          }
          {
            isDisplayBookNewTicket
            && (
              <div className="button-redirect redirect-route-page">
                <Button onClick={() => this.handleRedirectButton(get(bookingInfo, 'redirectUrl.bookNewTicket'))}>
                  {intl.formatMessage({ id: 'paymentResults.container.button.bookTicketAgain' })}
                </Button>
              </div>
            )
          }
        </PaymentResultContainer>
      </>
    );
  }
}

const mapStateToProps = state => ({
  bookingInfo: state.paymentResultsReducer.bookingInfo,
});

const mapDispatchToProps = dispatch => ({
  getBookingInfo: bindActionCreators(getBookingInfo, dispatch),
  sendEventTracking: bindActionCreators(sendEventTracking, dispatch),
})

export default injectIntl((
  connect(mapStateToProps, mapDispatchToProps)(
    withReduxSaga({ async: true })(Index),
  )))
