import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import Modal from 'vxrd/components/Base/Modal';
import Button from 'vxrd/components/Antd/Button';
import { injectIntl } from 'react-intl';
import Router from 'next/router';
import BookingWizardForm from '#/containers/Booking/BookingWizardForm';
import { getTripCodeInfo, resetTripInfoData } from '#/containers/Booking/actions';
import { BOOKING_STEP } from '#/containers/Booking/constants';
import RouteStorage from '#/utils/routeStorage';
import { sendEventTracking } from '#/containers/Device/actions';

class Index extends React.Component {
  static async getInitialProps({ ctx }) {
    const {
      isServer,
      query,
      store, // res,
    } = ctx;
    const {
      trip_code, step, lang, from, to, next_step, fare,
    } = query;

    const payload = {
      trip_code,
      from,
      to,
      lang,
      fare,
    };
    if ((!step || Number(step) === BOOKING_STEP.SELECT_SEAT) && !next_step) {
      store.dispatch(getTripCodeInfo(payload));
    }
    // else if (isServer && Number(step) > 1) {
    //   console.log('redirect');
    //   console.log(step);
    //   // res.redirect(`/${lang}/booking/${trip_code}/ONLINE/${Number(step)}/${from}/${to}`);
    //   return { isServer, query };
    // }
    return { isServer, query };
  }

  componentDidMount() {
    const {
      query: { step, next_step },
      isServer,
      bookingReducer: { tripInfo },
    } = this.props;

    if (Number(step) > 1) {
      if (!tripInfo) {
        Router.back();
      }
      if (next_step && !tripInfo) {
        Router.back();
      }
    }
    if (next_step && isServer) {
      this.props.resetTripInfoData();
      Router.back();
    }
    setTimeout(() => {
      this.props.stopLoading();
    }, 500);
  }

  redirect = () => {
    const routePageUrl = RouteStorage.getRoutePageUrl();
    Router.push(routePageUrl);
  };

  render() {
    const { intl } = this.props;
    const tripInfo = get(this.props, 'bookingReducer.tripInfo');
    const isShowError = !isEmpty(get(this.props, 'bookingReducer.error'));
    if (isShowError) this.props.stopLoading();
    return (
      <>
        {!isEmpty(tripInfo) && <BookingWizardForm {...this.props} />}
        <Modal
          title={intl.formatMessage({ id: 'booking.error.title' })}
          visible={isShowError}
          onOk={this.redirect}
          centered
          footer={[
            <Button key="submit" type="link" onClick={this.redirect}>
              {intl.formatMessage({ id: 'booking.error.buttonLabel' })}
            </Button>,
          ]}
        >
          <p>{intl.formatMessage({ id: 'booking.error.messages' })}</p>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  sendEventTracking: bindActionCreators(sendEventTracking, dispatch),
  resetTripInfoData: bindActionCreators(resetTripInfoData, dispatch),
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Index),
);
