import React from 'react';

import { connect } from 'react-redux';
import styled from 'styled-components';
import get from 'lodash.get';
import { injectIntl } from 'react-intl';
import withReduxSaga from 'next-redux-saga';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Modal from 'vxrd/components/Base/Modal';
import Button from 'vxrd/components/Antd/Button';
import { bindActionCreators } from 'redux';
import CouponSection from './components/CouponSection';
import SelectBank from './components/SelectBank';
import SelectOffice from './components/SelectOffice';
import {
  updateIBBank, updateTransferBank, updateOffice, removeCoupon,
} from './actions';
import { PAYMENT_METHOD_CODE } from '#/utils/constants';
import {
  GTM_PAYMENT_ORDER_STEP_2,
} from '#/containers/Payment/constants';

const ModalStyled = styled(Modal)`
`;
const Container = styled.div``;
const MethodDetailWrapper = styled.div`
  padding: 10px 20px;
  background: white;
  margin-bottom: 8px;
  img {
    margin: 12px 0px;
  }
`;
const MethodContent = styled.div`
  text-align: center;
  // margin-bottom: 10px;
  white-space: pre-wrap;
  span {
    color: #ffb400;
    font-weight: bold;
  }
`;
const MethodExtend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SelectStyled = styled(Input)`
  width: 70%;
  margin: auto;
  height: 36px;
  max-width: 255px;
  input {
    text-align: left;
  }
`;
const PaymentMethodContainer = styled.div`
  margin-top: -10px;
`;
const TransferMethodContainer = styled.div`
  margin-top: 10px;
`;
class PaymentMethodDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupSelectBank: false,
      isOpenNotiForTransactionAmount: false,
    };
  }

  componentWillMount() {
    const code = get(this.props, 'method.code');
    this.props.sendEventTracking({
      type: GTM_PAYMENT_ORDER_STEP_2,
      paymentMethod: code,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedIBBank
      && nextProps.bookingWithCoupon.totalPrice < this.props.selectedIBBank.gateway[0].minimum
    ) {
      this.setState({
        isOpenNotiForTransactionAmount: true,
      });
      this.props.updateIBBank(null);
    }
  }

  componentWillUnmount() {
    this.props.removeCoupon();
  }

  onToggleModal = (visible) => {
    this.setState(
      {
        showPopupSelectBank: visible,
      },
      () => {
        this.selectBankInput.blur();
      },
    );
  };

  onSelectIBBank = (e) => {
    this.props.updateIBBank(e.target.value);
    this.onToggleModal(false);
  };

  onSelectTransferBank = (e) => {
    this.props.updateTransferBank(e.target.value);
    this.onToggleModal(false);
  };

  onUpdateOffice = (e) => {
    this.props.updateOffice(e.target.value);
    this.onToggleModal(false);
  };

  onCloseModal = () => {
    this.setState({
      isOpenNotiForTransactionAmount: false,
    })
  }

  filterBankingByTotalPrice = (IBs, totalPrice) => IBs.filter(bank => bank.gateway[0].minimum <= totalPrice)

  renderVISA() {
    const {
      intl: { formatMessage },
      method: { code },
    } = this.props;
    return (
      <MethodDetailWrapper>
        <MethodContent>{formatMessage({ id: `payment.method.${code}.description` })}</MethodContent>
        <MethodExtend>
          <img
            src="https://storage.googleapis.com/fe-production/httpImage/httt_quocte.jpg"
            alt="visa logo"
          />
        </MethodExtend>
      </MethodDetailWrapper>
    );
  }

  renderIB() {
    const {
      intl: { formatMessage },
      method: { code },
      method,
      selectedIBBank,
      internetBankingBanks,
      bookingWithCoupon,
    } = this.props;
    return (
      <>
        <MethodDetailWrapper>
          <MethodContent>
            {formatMessage(
              { id: `payment.method.${code}.description` },
              { expiredTime: get(method, 'info.expiredTime') },
            )}
          </MethodContent>
          <TransferMethodContainer>
            <MethodExtend>
              <SelectStyled
                ref={(component) => {
                  this.selectBankInput = component;
                }}
                placeholder={formatMessage({ id: 'payment.selectbank' })}
                suffix={<Icon type="down" style={{ color: 'rgba(0,0,0,.45)' }} />}
                onClick={() => this.onToggleModal(true)}
                readOnly
                value={get(selectedIBBank, 'label', '')}
              />
            </MethodExtend>
          </TransferMethodContainer>
        </MethodDetailWrapper>
        <ModalStyled
          title={formatMessage({ id: 'payment.selectbank.popup.title' })}
          visible={this.state.showPopupSelectBank}
          onCancel={() => this.onToggleModal(false)}
          footer={null}
        >
          <SelectBank
            intl={this.props.intl}
            onChange={this.onSelectIBBank}
            value={selectedIBBank}
            options={this.filterBankingByTotalPrice(internetBankingBanks, bookingWithCoupon.totalPrice)}
          />
        </ModalStyled>
      </>
    );
  }

  renderZALO() {
    const {
      intl: { formatMessage },
      method: { code },
    } = this.props;
    return (
      <MethodDetailWrapper>
        <MethodContent>{formatMessage({ id: `payment.method.${code}.description` })}</MethodContent>
        <MethodExtend>
          <img
            src="https://storage.googleapis.com/fe-production/httpImage/http_zalo.jpg"
            alt="zalo logo"
          />
        </MethodExtend>
      </MethodDetailWrapper>
    );
  }

  renderCASH() {
    const {
      intl: { formatMessage },
      method: { code },
      method,
    } = this.props;
    return (
      <MethodDetailWrapper>
        <MethodContent
          dangerouslySetInnerHTML={{
            __html: formatMessage(
              { id: `payment.method.${code}.description` },
              { expiredTime: get(method, 'info.expiredTime') },
            ),
          }}
        />
        <MethodExtend>
          <img
            src="https://storage.googleapis.com/fe-production/httpImage/httt_cash.jpg"
            alt="CASH logo"
          />
        </MethodExtend>
      </MethodDetailWrapper>
    );
  }

  renderTRANSFER() {
    const {
      intl: { formatMessage },
      method: { code },
      method,
      transferBanks,
      selectedTransferBank,
    } = this.props;
    return (
      <>
        <MethodDetailWrapper>
          <MethodContent
            dangerouslySetInnerHTML={{
              __html: formatMessage(
                { id: `payment.method.${code}.description` },
                { expiredTime: get(method, 'info.expiredTime') },
              ),
            }}
          />
          <TransferMethodContainer>
            <MethodExtend>
              <SelectStyled
                ref={(component) => {
                  this.selectBankInput = component;
                }}
                placeholder={formatMessage({ id: 'payment.selectbank' })}
                suffix={<Icon type="down" style={{ color: 'rgba(0,0,0,.45)' }} />}
                onClick={() => this.onToggleModal(true)}
                readOnly
                value={get(selectedTransferBank, 'label', '')}
              />
            </MethodExtend>
          </TransferMethodContainer>
        </MethodDetailWrapper>
        <ModalStyled
          title={formatMessage({ id: 'payment.selectbank.popup.title' })}
          visible={this.state.showPopupSelectBank}
          onCancel={() => this.onToggleModal(false)}
          footer={null}
        >
          <SelectBank
            intl={this.props.intl}
            onChange={this.onSelectTransferBank}
            value={selectedTransferBank}
            options={transferBanks}
          />
        </ModalStyled>
      </>
    );
  }

  renderCOP() {
    const {
      intl: { formatMessage },
      method: { code },
      method,
    } = this.props;
    return (
      <MethodDetailWrapper>
        <MethodContent
          dangerouslySetInnerHTML={{
            __html: get(method, 'info.expiredTime')
              ? formatMessage(
                { id: `payment.method.${code}.description` },
                { expiredTime: get(method, 'info.expiredTime') },
              )
              : formatMessage({ id: `payment.method.${code}.description2` }),
          }}
        />
      </MethodDetailWrapper>
    );
  }

  renderVXR() {
    const {
      intl,
      intl: { formatMessage },
      method: { code },
      method,
      selectedOffice,
    } = this.props;
    return (
      <>
        <MethodDetailWrapper>
          <MethodContent
            dangerouslySetInnerHTML={{
              __html: formatMessage(
                { id: `payment.method.${code}.description` },
                { expiredTime: get(method, 'info.expiredTime') },
              ),
            }}
          />
          <MethodExtend>
            <SelectStyled
              ref={(component) => {
                this.selectBankInput = component;
              }}
              placeholder={formatMessage({ id: 'payment.selectOffice' })}
              suffix={<Icon type="down" style={{ color: 'rgba(0,0,0,.45)' }} />}
              onClick={() => this.onToggleModal(true)}
              readOnly
              value={get(selectedOffice, 'name', '')}
            />
          </MethodExtend>
        </MethodDetailWrapper>
        <ModalStyled
          title={formatMessage({ id: 'payment.selectOffice.title' })}
          visible={this.state.showPopupSelectBank}
          onCancel={() => this.onToggleModal(false)}
          footer={null}
        >
          <SelectOffice onChange={this.onUpdateOffice} value={selectedOffice} intl={intl} />
        </ModalStyled>
      </>
    );
  }

  render() {
    let content;
    const code = get(this.props, 'method.code');
    const { isOpenNotiForTransactionAmount } = this.state;
    const { intl: { formatMessage } } = this.props;
    switch (code) {
      case PAYMENT_METHOD_CODE.VISA:
        content = this.renderVISA();
        break;
      case PAYMENT_METHOD_CODE.INTERNET_BANKING:
        content = this.renderIB();
        break;
      case PAYMENT_METHOD_CODE.ZALO:
        content = this.renderZALO();
        break;
      case PAYMENT_METHOD_CODE.CASH:
        content = this.renderCASH();
        break;
      case PAYMENT_METHOD_CODE.TRANSFER:
        content = this.renderTRANSFER();
        break;
      case PAYMENT_METHOD_CODE.COP:
        content = this.renderCOP();
        break;
      case PAYMENT_METHOD_CODE.VXR:
        content = this.renderVXR();
        break;
      default:
        break;
    }
    return (
      <Container>
        {
          <PaymentMethodContainer>
            {content}
          </PaymentMethodContainer>
        }
        {
          code !== PAYMENT_METHOD_CODE.COP && (
            <CouponSection
              onApplyCoupon={this.props.onApplyCoupon}
              onRemoveCoupon={this.props.onRemoveCoupon}
              spinning={this.props.couponLoading}
              couponInfo={this.props.couponInfo}
            />
          )
        }
        <ModalStyled
          visible={isOpenNotiForTransactionAmount}
          maskClosable={false}
          closable={false}
          centered
          title={formatMessage({ id: 'payment.transactionAmount.title' })}
          footer={[
            <Button type="link" key="accept" onClick={this.onCloseModal}>
              {formatMessage({ id: 'payment.popup.ok' })}
            </Button>,
          ]}
        >
          {formatMessage({ id: 'payment.transactionAmount.content' })}
        </ModalStyled>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  transferBanks: state.paymentReducer.transferBanks,
  internetBankingBanks: state.paymentReducer.internetBankingBanks,
  selectedIBBank: state.paymentReducer.selectedIBBank,
  selectedTransferBank: state.paymentReducer.selectedTransferBank,
  selectedOffice: state.paymentReducer.selectedOffice,
  paymentLoading: state.paymentReducer.paymentLoading,
  bookingWithCoupon: state.paymentReducer.bookingWithCoupon,
});

const mapsDispatchToProps = dispatch => bindActionCreators(
  {
    updateIBBank,
    updateTransferBank,
    updateOffice,
    removeCoupon,
  },
  dispatch,
);

export default injectIntl(
  connect(
    mapStateToProps,
    mapsDispatchToProps,
  )(withReduxSaga({ async: true })(PaymentMethodDetail)),
);
