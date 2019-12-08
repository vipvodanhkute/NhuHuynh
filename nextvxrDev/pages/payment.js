/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */

import React from 'react';
import get from 'lodash.get';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import withReduxSaga from 'next-redux-saga';
import { Router } from '#/routes';
import { PAYMENT_METHOD_CODE, TICKET_STATUS, LANG } from '#/utils/constants';
import RefundPolicy from 'vxrd/components/CompanyDetail/RefundPolicy';
import Header from 'vxrd/components/Layout.New/Header';
import Button from 'vxrd/components/Antd/Button';
import Icon from 'vxrd/components/Antd/Icon';
import Modal from 'vxrd/components/Base/Modal';
import Spin from 'antd/lib/spin';
import Checkbox from 'antd/lib/checkbox';
import PaymentMethodSelection from '#/containers/Payment/PaymentMethodSelection';
import PaymentMethodDetail from '#/containers/Payment/PaymentMethodDetail';
import TicketInfoWrapperPayment from '#/containers/Payment/TicketInfoWrapperPayment';
import {
  getPaymentMethods,
  checkCouponCode,
  getBookingInfoPayment,
  removeCoupon,
  getIBBanks,
  paymentOrderRequest,
  getTransferBanks,
  updatePaymentMethod,
  getTerm,
  cancelBooking,
  resetPaymentPageData,
  hidePopupIncorrectCoupon,
  hidePopupCreateOrderFailed,
} from '#/containers/Payment/actions';
import {
  getCancellationPolicy,
} from '#/containers/BookingCompanyDetail/actions';
import { getCancellationPolicyData } from '#/utils/api/mapping/cancellationPolicyNormalize';
import CountdownTimer from '#/containers/Payment/components/CountdownTimer';
import { payloadToQuery, createUrl } from '#/utils/pathUtils';
import { sendEventTracking } from '#/containers/Device/actions';
import {
  GA_PAYMENT_CHECK_OUT_EVENT,
} from '#/containers/Payment/constants';

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const StyledModal = styled(Modal)`
  .ant-modal-body{
    >div{
      border-bottom: none;
    }
  }
`;

const NotificationModal = styled(Modal)`
  .ant-modal-body{
    text-align: center;
  }
`

const Container = styled.div`
  background: #e3e3e3;
`;

const StyledFooter = styled.div`
  width: 100%;
  text-align: center;
  background-color: #fff;
  padding: 16px;
`;

const TermAndCancellationPolicyContainer = styled.div`
  background: #e3e3e3;
  padding: 16px;
  font-size: 13px;
  div {
    color: #484848;
    margin-bottom: 10px;
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #767676;
      border-color: #767676;
    }
    span {
      color: #484848;
    }
    span.link {
      color: #007aff;
      text-decoration: underline;
      padding: 0 4px;
      cursor: pointer;
    }
  }
`;

const PaymentButton = styled(Button)`
  background-color: #ffb400;
  color: #484848;
  border-color: #ffb400;
  height: 48px;
  font-size: 16px;
`;
const StyledCountdownTimer = styled(CountdownTimer)`
`

class Payment extends React.Component {
  static async getInitialProps({ ctx }) {
    const {
      isServer, query, store, res,
    } = ctx;
    const { booking_code, lang, payment_method } = query;
    if (payment_method && isServer) {
      res.redirect(`/${lang}/payment-method/${booking_code}`);
    }
    if (!payment_method && !store.getState().paymentReducer.booking.code) {
      store.dispatch(getPaymentMethods({ code: booking_code }));
    }
    return {
      isServer,
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpenTicketInfo: false,
      isOpenExpiredTime: false,
      isOpenTermAndCondition: false,
      isOpenPopupBackToRoutePage: false,
      isOpenCancellationPolicy: false,
      isSelectDepositConfirm: true,
      isSelectTermAndConditionConfirm: true,
    };
    this.bookingDataLoaded = false;
    this.bookingDataLoaded = false;
    this.cancellationPolicyDataLoaded = false;
  }

  componentDidMount() {
    this.props.stopLoading();
    Router.beforePopState(() => {
      // { url, as, options }
      const { query: { payment_method } } = this.props
      if (!payment_method) {
        this.setState({ isOpenPopupBackToRoutePage: true });
        return false;
      }
      return true;
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      payload: { bookingLoading },
    } = this.props;
    if (bookingLoading && !nextProps.payload.bookingLoading) {
      this.setState({ isOpenTicketInfo: true });
    }
  }

  onTogglePopUpExpiredTime = (toggle) => {
    this.setState({
      isOpenExpiredTime: toggle,
    });
  };

  onSelectPaymentMethod = (method) => {
    this.props.updatePaymentMethod(method);
    const { code } = method;
    if (code === PAYMENT_METHOD_CODE.INTERNET_BANKING && !this.props.internetBankingBanks.length) {
      this.props.getIBBanks();
    }
    if (code === PAYMENT_METHOD_CODE.TRANSFER && !this.props.transferBanks.length) {
      this.props.getTransferBanks();
    }
    Router.pushRoute('payment', {
      lang: this.props.query.lang,
      booking_code: this.props.query.booking_code,
      payment_method: code,
    });
  };

  onClickPayment = () => {
    this.handleSendGAEvent('Thanh toán button');
    this.props.paymentOrderRequest();
  };

  onApplyCoupon = (couponCode) => {
    const bookingCode = this.props.query.booking_code;
    this.props.checkCouponCode({ code: couponCode, booking_code: bookingCode });
    this.handleSendGAEvent('Button áp dụng coupon');
  };

  onRemoveCoupon = () => {
    this.handleSendGAEvent('Button bỏ dùng coupon');
    this.props.removeCoupon();
  };

  onClickCollapseExpand = () => {
    if (!this.state.isOpenTicketInfo && !this.bookingDataLoaded) {
      this.props.getBookingInfoPayment(this.props.query.booking_code);
      this.bookingDataLoaded = true;
    } else {
      this.setState(preState => ({ isOpenTicketInfo: !preState.isOpenTicketInfo }));
    }
  };

  onClickCancellationPolicy = () => {
    this.setState({
      isOpenCancellationPolicy: true,
    }, () => {
      this.handleSendGAEvent('Chính sách hủy vé');
    });
    if (!this.cancellationPolicyDataLoaded) {
      this.cancellationPolicyDataLoaded = true;
      this.props.getCancellationPolicy({ trip_code: get(this.props, 'booking.tripCode') })
    }
  }

  onClickTerm = () => {
    this.setState({
      isOpenTermAndCondition: true,
    }, () => {
      this.handleSendGAEvent('Quy chế');
    })
    if (!this.props.term) {
      this.props.getTerm()
    }
  }

  onOkExpiredTime = () => {
    const { booking: { from, to, date }, query: { lang } } = this.props
    const query = payloadToQuery({
      from, to, date, lang, numOfTickets: 1,
    })

    Router.push(createUrl(query))
  }

  onAcceptBack = () => {
    this.setState({ isOpenPopupBackToRoutePage: false });
    this.handleSendGAEvent('Quay trở lại popup');
    this.handleBackToRoutePage();
  }

  handleBackToRoutePage = () => {
    const { query: { booking_code }, booking: { status } } = this.props;
    if (status === TICKET_STATUS.NEW) {
      this.props.loading()
      this.props.cancelBooking({ code: booking_code, status });
    }
  }

  onCancelBack = () => {
    this.setState({ isOpenPopupBackToRoutePage: false });
    const { query: { lang, booking_code } } = this.props;
    this.handleSendGAEvent('Tiếp tục đặt vé popup');
    Router.pushRoute('payment', {
      lang,
      booking_code,
    });
  }

  onClickCheckTicket = () => {
    const { query: { lang } } = this.props;
    Router.pushRoute(`/${lang}/booking/ticketinfo`)
  }

  onClickReturnHome = () => {
    const { query: { lang } } = this.props;
    Router.pushRoute(`/${lang}`)
  }

  handleSendGAEvent = (value) => {
    this.props.sendEventTracking({
      type: GA_PAYMENT_CHECK_OUT_EVENT,
      value,
    });
  }

  handleBack = () => {
    this.handleSendGAEvent('Nút back');
    Router.back();
  }

  updateCheckbox = (stateName) => {
    this.setState({
      [stateName]: !this.state[stateName],
    })
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      query: {
        payment_method, lang,
      },
      intl,
      payload: { bookingLoading },
      bookingWithCoupon,
      method,
      cancellationPolicy,
      term,
      booking: {
        expiredTimePaymentMethod,
        status,
      },
      listPaymentMethods,
      selectedIBBank,
      selectedOffice,
      selectedTransferBank,
      isIncorrectCoupon,
      paymentOrderFailured,
    } = this.props;
    const {
      isOpenTicketInfo,
      isOpenPopupBackToRoutePage,
      isSelectDepositConfirm,
      isSelectTermAndConditionConfirm,
    } = this.state;
    let headerTitleId = 'payment.selection.title';
    const { isDeposit } = bookingWithCoupon;
    if (payment_method) {
      headerTitleId = `payment.method.${payment_method}.title`;
    }
    const refundPolicyProps = {
      id: 'cancellationPolicy',
      note: get(cancellationPolicy, 'noteId') ? intl.formatMessage({ id: cancellationPolicy.noteId }) : get(cancellationPolicy, 'note'),
      noteLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.noteLabel' }),
      fromCancelLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.fromCancelLabel' }),
      toCancelLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.toCancelLabel' }),
      cancelFeeLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.cancelFeeLabel' }),
      detail: getCancellationPolicyData({ cancellationPolicy, intl }),
      contentDefault: get(cancellationPolicy, 'contentDefaultId') ? intl.formatMessage({ id: get(cancellationPolicy, 'contentDefaultId') }) : '',
    };

    const noMethods = (listPaymentMethods !== undefined && listPaymentMethods.length === 0)
    const isExpiredTime = (this.state.isOpenExpiredTime
      || noMethods || status === TICKET_STATUS.CANCELLED)

    const isOpenPopupExpiredTime = !isOpenPopupBackToRoutePage && isExpiredTime;
    const isOpenPopupPaidTicket = !isOpenPopupBackToRoutePage && status === TICKET_STATUS.PAID

    const disabledButtonPayment = (!isSelectTermAndConditionConfirm || !isSelectDepositConfirm)
      || ((payment_method === PAYMENT_METHOD_CODE.INTERNET_BANKING && !selectedIBBank)
      || (payment_method === PAYMENT_METHOD_CODE.TRANSFER && !selectedTransferBank)
      || (payment_method === PAYMENT_METHOD_CODE.VXR && !selectedOffice))
    let submitButtonLabel = payment_method === PAYMENT_METHOD_CODE.CASH ? formatMessage({ id: 'payment.button.payment.cash' }) : formatMessage({ id: 'payment.button.payment' });
    if (isDeposit && lang === LANG.VN) {
      submitButtonLabel = formatMessage({ id: 'payment.button.payment.deposit' });
    }
    return (
      <Container>
        <Header fixed>
          <Header.Left>
            <Button label="true" onClick={this.handleBack}>
              <Icon type="left" />
            </Button>
          </Header.Left>
          <Header.Body>
            <Title>{formatMessage({ id: headerTitleId })}</Title>
          </Header.Body>
          <Header.Right />
        </Header>
        <StyledCountdownTimer
          expiredTime={expiredTimePaymentMethod}
          onTimeOut={() => this.onTogglePopUpExpiredTime(true)}
          intl={intl}
        />
        {payment_method ? (
          <PaymentMethodDetail
            method={method}
            onApplyCoupon={this.onApplyCoupon}
            onRemoveCoupon={this.onRemoveCoupon}
            couponLoading={this.props.couponLoading}
            couponInfo={this.props.couponInfo}
            sendEventTracking={this.props.sendEventTracking}
          />
        ) : (
          <PaymentMethodSelection
            onSelect={this.onSelectPaymentMethod}
            methods={listPaymentMethods}
            sendEventTracking={this.props.sendEventTracking}
          />
        )}
        <TicketInfoWrapperPayment
          intl={intl}
          bookingInfo={bookingWithCoupon}
          isOpen={isOpenTicketInfo}
          onClickCollapseExpand={this.onClickCollapseExpand}
          isLoading={bookingLoading}
        />
        {payment_method && (
          <>
            <TermAndCancellationPolicyContainer>
              <div>
                <Checkbox onChange={() => this.updateCheckbox('isSelectTermAndConditionConfirm')} checked={isSelectTermAndConditionConfirm}>
                  {formatMessage({ id: 'payment.term_and_policy.label1' })}
                  <span className="link" onClick={this.onClickCancellationPolicy}>
                    {formatMessage({ id: 'payment.term_and_policy.label2' })}
                  </span>
                  {formatMessage({ id: 'payment.term_and_policy.label3' })}
                  <span className="link" onClick={this.onClickTerm}>
                    {formatMessage({ id: 'payment.term_and_policy.label4' })}
                  </span>
                  {formatMessage({ id: 'payment.term_and_policy.label5' })}
                </Checkbox>
              </div>
              {
                !!isDeposit && (
                  <div>
                    <Checkbox onChange={() => this.updateCheckbox('isSelectDepositConfirm')} checked={isSelectDepositConfirm}>
                      {intl.formatMessage({ id: 'payment.confirmCheckbox.depositSurcharge' })}
                    </Checkbox>
                  </div>
                )
              }
            </TermAndCancellationPolicyContainer>
            <StyledFooter>
              <PaymentButton
                block
                type="default"
                loading={this.props.paymentLoading}
                onClick={this.onClickPayment}
                disabled={disabledButtonPayment}
              >
                {submitButtonLabel}
              </PaymentButton>
            </StyledFooter>
          </>
        )}
        <StyledModal
          closable={false}
          title={formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.title' })}
          visible={this.state.isOpenCancellationPolicy}
          onCancel={() => this.setState({ isOpenCancellationPolicy: false })}
          footer={<Button type="link" key="accept" onClick={() => this.setState({ isOpenCancellationPolicy: false })}>{formatMessage({ id: 'payment.popup.ok' })}</Button>}
        >
          <RefundPolicy {...refundPolicyProps} />
          {
            !this.cancellationPolicyDataLoaded && (
            <div className="loading-container">
              <Spin />
            </div>
            )
          }
        </StyledModal>
        <Modal
          closable={false}
          title={formatMessage({ id: 'payment.term_and_policy.label4' })}
          visible={this.state.isOpenTermAndCondition}
          onCancel={() => this.setState({ isOpenTermAndCondition: false })}
          footer={<Button type="link" key="accept" onClick={() => this.setState({ isOpenTermAndCondition: false })}>{formatMessage({ id: 'payment.popup.ok' })}</Button>}
        >
          <div className="term">
            <div className="term-label" dangerouslySetInnerHTML={{ __html: get(term, 'label') }} />
            <div dangerouslySetInnerHTML={{ __html: get(term, 'content') }} />
            {
            !term && (
            <div className="loading-container">
              <Spin />
            </div>
            )
          }
          </div>

        </Modal>
        <NotificationModal
          maskClosable={false}
          visible={isOpenPopupExpiredTime}
          closable={false}
          centered
          title={formatMessage({ id: 'payment.expiredTime.title' })}
          // onCancel={() => this.onTogglePopUpExpiredTime(false)}
          footer={(
            <Button type="link" onClick={this.onOkExpiredTime}>
              {formatMessage({ id: 'payment.popup.ok' })}
            </Button>
          )}
        >
          {formatMessage({ id: 'payment.expiredTime.content' })}
        </NotificationModal>
        <NotificationModal
          maskClosable={false}
          visible={isOpenPopupPaidTicket}
          closable={false}
          centered
          title={formatMessage({ id: 'payment.paidTicket.title' })}
          footer={[
            <Button type="link" key="accept" onClick={this.onClickCheckTicket}>
              {formatMessage({ id: 'payment.paidTicket.check-button' })}
            </Button>,
            <Button
              type="default"
              key="cancel"
              onClick={this.onClickReturnHome}
            >
              {formatMessage({ id: 'payment.paidTicket.return-home' })}
            </Button>,
          ]}
        >
          <div dangerouslySetInnerHTML={{ __html: formatMessage({ id: 'payment.paidTicket.content' }) }} />
        </NotificationModal>
        <NotificationModal
          visible={isIncorrectCoupon}
          closable={false}
          centered
          title={formatMessage({ id: 'payment.coupon.incorrectCoupon.title' })}
          footer={(
            <Button type="link" onClick={() => this.props.hidePopupIncorrectCoupon()}>
              {formatMessage({ id: 'payment.popup.ok' })}
            </Button>
          )}
        >
          {formatMessage({ id: 'payment.coupon.incorrectCoupon.content' })}
        </NotificationModal>
        <NotificationModal
          visible={paymentOrderFailured}
          closable={false}
          centered
          title={formatMessage({ id: 'payment.reSelectPayment.title' })}
          footer={(
            <Button type="link" onClick={() => this.props.hidePopupCreateOrderFailed()}>
              {formatMessage({ id: 'payment.popup.ok' })}
            </Button>
          )}
        >
          {formatMessage({ id: 'payment.reSelectPayment.content' })}
        </NotificationModal>
        <NotificationModal
          visible={isOpenPopupBackToRoutePage}
          maskClosable={false}
          closable={false}
          centered
          title={formatMessage({ id: 'payment.back.title' })}
          footer={[
            <Button type="link" key="accept" onClick={this.onCancelBack}>
              {formatMessage({ id: 'payment.back.continuePayment' })}
            </Button>,
            <Button
              type="default"
              key="cancel"
              onClick={this.onAcceptBack}
            >
              {formatMessage({ id: 'payment.back.backToRoute' })}
            </Button>,
          ]}
        >
          {formatMessage({ id: 'payment.back.content' })}
        </NotificationModal>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  listPaymentMethods: state.paymentReducer.listPaymentMethods,
  booking: state.paymentReducer.booking,
  couponLoading: state.paymentReducer.couponLoading,
  couponInfo: state.paymentReducer.couponInfo,
  payload: state.paymentReducer.payload,
  transferBanks: state.paymentReducer.transferBanks,
  internetBankingBanks: state.paymentReducer.internetBankingBanks,
  bookingWithCoupon: state.paymentReducer.bookingWithCoupon,
  method: state.paymentReducer.method,
  paymentLoading: state.paymentReducer.paymentLoading,
  isIncorrectCoupon: state.paymentReducer.isIncorrectCoupon,
  cancellationPolicy: state.bookingCompanyDetailReducer.cancellationPolicy,
  term: state.paymentReducer.term,
  bookingCreated: state.bookingReducer.bookingCreated,
  selectedIBBank: state.paymentReducer.selectedIBBank,
  selectedTransferBank: state.paymentReducer.selectedTransferBank,
  selectedOffice: state.paymentReducer.selectedOffice,
  paymentOrderFailured: state.paymentReducer.paymentOrderFailured,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getPaymentMethods,
    getBookingInfoPayment,
    getIBBanks,
    getTransferBanks,
    checkCouponCode,
    removeCoupon,
    paymentOrderRequest,
    updatePaymentMethod,
    getCancellationPolicy,
    getTerm,
    cancelBooking,
    resetPaymentPageData,
    hidePopupIncorrectCoupon,
    hidePopupCreateOrderFailed,
    sendEventTracking,
  },
  dispatch,
);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withReduxSaga({ async: true })(Payment)),
);
