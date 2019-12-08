import '#/assets/styles.less';
import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
// import { Transition, animated } from 'react-spring';
import { IntlProvider, addLocaleData, injectIntl } from 'react-intl';
import useragent from 'express-useragent'

import createStore from '../store';
import Loading from './loading';
import { LANG } from '#/utils/constants';
import moment from 'moment';
import SEOContainer from '../containers/SEO';
// import { STORE_DEVICE_INFO } from '#/containers/Device/constants';
import { storeDeviceInfo } from '#/containers/Device/actions';
import PluginComponent from '#/pages/pluginComponent'

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
    addLocaleData(window.ReactIntlLocaleData[lang]);
  });
}

const langSwitch = {
  [LANG.VN]: 'vi',
  [LANG.EN]: 'en',
};

class MyApp extends App {
  static async getInitialProps(context) {
    const { Component, ctx, router } = context;
    const { asPath } = router;
    const { req, store, query } = ctx;
    let pageProps = {};
    const { locale, messages } = req || (typeof window !== 'undefined' && window.__NEXT_DATA__.props.initialProps.pageProps);

    store.dispatch(storeDeviceInfo({ locale }));

    if (Component.getInitialProps) {
      if (!ctx.req) {
        if (typeof window !== 'undefined') {
          ctx.req = {
            ua: useragent.parse(window.navigator.userAgent),
          }
        }
      }
      pageProps = await Component.getInitialProps({ ctx });
    }

    pageProps.locale = locale;
    pageProps.messages = messages;
    pageProps.now = Date.now();
    pageProps.asPath = asPath;
    pageProps.query = query;
    pageProps.ua = ctx.req.ua;

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    const { pageProps } = this.props;
    const { locale } = pageProps;
    moment.locale(langSwitch[locale], {
      meridiemParse: /am|pm/i,
      isPM(input) {
        return /^pm$/i.test(input);
      },
      meridiem(hours, minutes, isLower) {
        if (hours < 12) {
          return isLower ? 'am' : 'AM';
        }
        return isLower ? 'pm' : 'PM';
      },
    });
  }

  stopLoading = () => {
    if (document.querySelector('#loadingContainer')) {
      document.querySelector('#loadingContainer').style.overflow = '';
    }
    if (document.querySelector('#loadingWrapper')) {
      document.querySelector('#loadingWrapper').style.visibility = 'hidden';
    }
  };

  loading = () => {
    if (document.querySelector('#loadingContainer')) {
      document.querySelector('#loadingContainer').style.overflow = 'hidden';
    }
    if (document.querySelector('#loadingWrapper')) {
      document.querySelector('#loadingWrapper').style.visibility = 'unset';
    }
  };

  render() {
    const { Component, pageProps, store } = this.props;
    const IntlComponent = injectIntl(Component);

    const {
      locale, messages, now,
    } = pageProps;

    const IntlPluginComponent = injectIntl(PluginComponent);
    const ComponentWrapper = () => (
      <>
        <IntlProvider locale={locale} messages={messages} initialNow={now}>
          <>
            <SEOContainer path={pageProps.asPath} locale={locale} />
            <Loading isLoading={this.state.isLoading}>
              <IntlComponent {...pageProps} loading={this.loading} stopLoading={this.stopLoading} />
              <IntlPluginComponent {...pageProps} />
            </Loading>
          </>
        </IntlProvider>
      </>
    );

    return (
      <Container>
        <Provider store={store}>{ComponentWrapper()}</Provider>
      </Container>
    );
  }
}

export default withRedux(createStore)(withReduxSaga({ async: true })(MyApp));
