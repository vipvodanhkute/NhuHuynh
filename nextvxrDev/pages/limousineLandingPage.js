import React from 'react'
import { getBanners } from '#/containers/Banner/actions';
import { getSEOLimousine } from '#/containers/SEO/actions'
import { BANNER_PAGE } from '#/containers/Banner/constants';

import dynamicImport from '#/utils/dynamicImport'

class LimousineLandingPage extends React.Component {
  static async getInitialProps({ ctx }) {
    const { isServer, store } = ctx;
    // store.dispatch(getBanners({ page: BANNER_PAGE.HOME_PAGE }));
    store.dispatch(getSEOLimousine({ lang: store.getState().device.locale }));
    return {
      isServer,
    };
  }

  render() {
    const Component = dynamicImport('limousineLandingPage', { userAgent: this.props.ua })
    return <Component {...this.props} />
  }
}

export default LimousineLandingPage
