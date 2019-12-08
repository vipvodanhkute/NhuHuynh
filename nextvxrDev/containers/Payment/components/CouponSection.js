import React from 'react';
import styled from 'styled-components';
import Input from 'antd/lib/input';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Button from 'vxrd/components/Antd/Button';
import { injectIntl } from 'react-intl';

const CouponContainer = styled.div`
  background: white;
  margin-bottom: 8px;
`;
const CouponTitle = styled.div`
  background-color: #f2f2f2;
  color: #000;
  padding: 8px 15px;
  font-size: 16px;
`;
const CouponBody = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: center;
`;
const StyledButtonApply = styled(Button)`
  flex: 0;
  border-radius: 2px;
  border-color: #007aff;
  height: 36px;
  color: #007aff;
`;
const StyledInputCoupon = styled(Input)`
  flex: 3;
  margin-right: 10px;
  border-radius: 2px;
  height: 36px;
  border: 1px solid #e3e3e3;
`;
const CouponInfo = styled.div`
  flex: 3;
`;
class CouponSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coupon: '',
    };
  }

  onChangeCoupon = (e) => {
    this.setState({ coupon: e.target.value });
  };

  onApplyCoupon = () => {
    this.props.onApplyCoupon(this.state.coupon);
  };

  onRemoveCoupon = () => {
    this.setState({coupon: ''})
    this.props.onRemoveCoupon();
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <CouponContainer>
        <CouponTitle>{formatMessage({ id: 'payment.coupon.title' })}</CouponTitle>
        <Spin
          spinning={this.props.spinning}
          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
        >
          {!this.props.couponInfo && (
            <CouponBody>
              <StyledInputCoupon
                placeholder={formatMessage({ id: 'payment.coupon.placeholder' })}
                onChange={this.onChangeCoupon}
                value={this.state.coupon}
              />
              <StyledButtonApply onClick={this.onApplyCoupon}>
                {formatMessage({ id: 'payment.coupon.apply' })}
              </StyledButtonApply>
            </CouponBody>
          )}
          {this.props.couponInfo && (
            <CouponBody>
              <CouponInfo>
                <img
                  src="https://storage.googleapis.com/fe-production/svgIcon/discount-sticker-with-percentage.svg"
                  alt=""
                />
                {' '}
                &nbsp;
                <span>
                  {formatMessage({ id: 'payment.coupon' })}
                  {' '}
                  {this.props.couponInfo.code}
: -
                  {this.props.couponInfo.fare_info.coupon_value
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  <sup>đ</sup>
                </span>
              </CouponInfo>
              <Button type="link" onClick={this.onRemoveCoupon}>
                {formatMessage({ id: 'payment.coupon.remove' })}
              </Button>
            </CouponBody>
          )}
        </Spin>
      </CouponContainer>
    );
  }
}

export default injectIntl(CouponSection);
