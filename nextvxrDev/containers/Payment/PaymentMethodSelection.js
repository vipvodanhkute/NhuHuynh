import React from 'react';

import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import PaymentGroup from './components/PaymentGroup';

const Container = styled.div`
  padding: 10px 15px 0px;
  margin-bottom: 8px;
  background: white;
`;

const defaultPaymentMethod = [
  {
    code: 'VISA',
    titleId: 'payment.select_method.VISA.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/credit-card.svg',
    descriptionId: 'payment.select_method.VISA.desc',
  },
  {
    code: 'IB',
    titleId: 'payment.select_method.IB.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/atm.svg',
    descriptionId: 'payment.select_method.IB.desc',
  },
  {
    code: 'ZALO_PAY_APP',
    titleId: 'payment.select_method.ZALO_PAY_APP.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/qr-code-3.svg',
    descriptionId: 'payment.select_method.ZALO_PAY_APP.desc',
  },
  {
    code: 'TRANSFER',
    titleId: 'payment.select_method.TRANSFER.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/bank-building.svg',
    descriptionId: 'payment.select_method.TRANSFER.desc',
  },
  {
    code: 'CASH_COLLECTION',
    titleId: 'payment.select_method.CASH_COLLECTION.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/savings.svg',
    descriptionId: 'payment.select_method.CASH_COLLECTION.desc',
  },
  {
    code: 'VXR',
    titleId: 'payment.select_method.VXR.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/three-buildings.svg',
    descriptionId: 'payment.select_method.VXR.desc',
  },
  {
    code: 'COP',
    titleId: 'payment.select_method.COP.title',
    imageUrl: 'https://storage.googleapis.com/fe-production/svgIcon/bus-side-view.svg',
    descriptionId: 'payment.select_method.COP.desc',
  },
];
class PaymentMethodSelection extends React.Component {
  updatePaymentFields = methods => methods.map((method) => {
    const { formatMessage } = this.props.intl;
    const fullMethodIndex = defaultPaymentMethod.findIndex(pm => pm.code === method.code);
    return {
      ...method,
      ...defaultPaymentMethod[fullMethodIndex],
      title: formatMessage({
        id: `${defaultPaymentMethod[fullMethodIndex].titleId}`,
      }),
      description: formatMessage({
        id: `${defaultPaymentMethod[fullMethodIndex].descriptionId}`,
      }),
    };
  });

  render() {
    const { formatMessage } = this.props.intl;
    const methods = this.props.methods || [];
    const online = this.updatePaymentFields(methods.filter(method => method.type === 5));
    const offline = this.updatePaymentFields(methods.filter(method => method.type !== 5));
    return (
      <Container>
        {online.length > 0 && (
          <PaymentGroup
            groupName={formatMessage({ id: 'payment.group.online' })}
            onSelect={this.props.onSelect}
            data={online}
          />
        )}
        {offline.length > 0 && (
          <PaymentGroup
            groupName={formatMessage({ id: 'payment.group.offline' })}
            onSelect={this.props.onSelect}
            data={offline}
          />
        )}
      </Container>
    );
  }
}

export default injectIntl(PaymentMethodSelection);
