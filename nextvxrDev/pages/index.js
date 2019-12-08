import React from 'react'
import { getBanners } from '#/containers/Banner/actions';
import { getSEOHome } from '#/containers/SEO/actions'
import { BANNER_PAGE } from '#/containers/Banner/constants';

import dynamicImport from '#/utils/dynamicImport';

class Index extends React.Component {
  static async getInitialProps({ ctx }) {
    const { isServer, store } = ctx;
    store.dispatch(getBanners({ page: BANNER_PAGE.HOME_PAGE }));
    store.dispatch(getSEOHome({ lang: store.getState().device.locale }));
    return {
      isServer,
    };
  }

  render() {
    const Component = dynamicImport('homepage', { userAgent: this.props.ua })
    return <Component {...this.props} />
  }
}

export default Index
