import React, { Component } from 'react';
import CustomerInfoForm from 'vxrd/components/Form/CustomerInfo';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import get from 'lodash.get';

const CustomerInfoContainer = styled.div`
    padding: 15px;
`;

const CustomerInfoTitleMessage = styled.div`
    p {
        font-size: 16px;
    }
`;

// const RegisterInstruction = styled.div`
//     min-height: 130px;
//     span {
//         padding: 3px;
//     }
//     .link {
//       color: #5090E9;
//       // border-bottom: 1px solid;
//     }
// `;

class CustomerInfo extends Component {
  state = {
    isSendGATrackingType: true,
  }

  updateCuctomerInfo = (customerInfo, hasError) => {
    const {
      getValue,
      sendGAEventTracking,
    } = this.props;
    const { isSendGATrackingType } = this.state;

    getValue(customerInfo, hasError);

    if (isSendGATrackingType && !hasError) {
      this.setState({
        isSendGATrackingType: false,
      }, () => {
        sendGAEventTracking('Customer info');
      })
    }
  };

  render() {
    const { intl, customerInfo } = this.props;
    const props = {
      defaultCountryCode: 'VN',
      listCountryCode: this.props.contryCodeResource,
      fields: {
        userName: {
          value: get(customerInfo, 'userName'),
          placeholder: intl.formatMessage({ id: 'booking.customerInfo.usernameField.placeholder' }),
          rules: [{ required: true, message: intl.formatMessage({ id: 'booking.customerInfo.usernameField.validateMessage' }) }],
        },
        email: {
          value: get(customerInfo, 'email'),
          placeholder: intl.formatMessage({ id: 'booking.customerInfo.emailField.placeholder' }),
          rules: [
            {
              type: 'email', message: intl.formatMessage({ id: 'booking.customerInfo.emailField.validateMessage.type' }),
            },
            {
              required: true, message: intl.formatMessage({ id: 'booking.customerInfo.emailField.validateMessage.required' }),
            },
          ],
        },
        phone: {
          value: get(customerInfo, 'phone'),
          placeholder: intl.formatMessage({ id: 'booking.customerInfo.phoneField.placeholder' }),
          rules: [
            {
              required: true,
              message: intl.formatMessage({ id: 'booking.customerInfo.phoneField.validateMessage.required' }),
            },
            {
              pattern: /^[0-9]{9,15}$/,
              message: intl.formatMessage({ id: 'booking.customerInfo.phoneField.validateMessage.wrongPattern' }),
              validationTrigger: 'onBlur',
            },
          ],
        },
        countryCode: {
          value: get(customerInfo, 'countryCode') || 'VN',
          rules: [],
        },
        otherContact: {
          value: get(customerInfo, 'otherContact'),
          placeholder: intl.formatMessage({ id: 'booking.customerInfo.otherContact.placeholder' }),
          label: intl.formatMessage({ id: 'booking.customerInfo.otherContact.label' }),
          rules: [
            {
              required: true, message: intl.formatMessage({ id: 'booking.customerInfo.otherContact.validate.required' }),
            },
            { max: 255, message: intl.formatMessage({ id: 'booking.customerInfo.otherContact.validate.maxLength' }) },
          ],
        },
        note: {
          value: get(customerInfo, 'note'),
          placeholder: intl.formatMessage({ id: 'booking.customerInfo.noteField.placeholder' }),
          rules: [{ max: 255, message: intl.formatMessage({ id: 'booking.customerInfo.noteField.validateMessage.maxLength' }) }],
        },
      },
      getValue: this.updateCuctomerInfo,
    }

    return (
      <CustomerInfoContainer>
        <CustomerInfoTitleMessage>
          <p>{intl.formatMessage({ id: 'booking.customerInfo.headerMessage' })}</p>
        </CustomerInfoTitleMessage>
        <CustomerInfoForm {...props} />
        {/* <RegisterInstruction>
          <div>
            <span>
              {intl.formatMessage({ id: 'booking.customerInfo.registerInstruction.haveAccount' })}
            </span>
            <span className="link">
              {intl.formatMessage({ id: 'booking.customerInfo.registerInstruction.login' })}
            </span>
          </div>
          <div>
            <span>{intl.formatMessage({ id: 'booking.customerInfo.registerInstruction.or' })}</span>
            <span className="link">
              {intl.formatMessage({ id: 'booking.customerInfo.registerInstruction.createAccount' })}
            </span>
            <span>
              {
                intl.formatMessage({
                  id: 'booking.customerInfo.registerInstruction.bookAndManageticket'
                })
              }
            </span>
          </div>
        </RegisterInstruction> */}
      </CustomerInfoContainer>
    );
  }
}

export default injectIntl(CustomerInfo);
