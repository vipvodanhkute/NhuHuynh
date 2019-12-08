import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import _get from 'lodash.get';
import { injectIntl } from 'react-intl';
import DataStructure from '#/containers/SEO/components/DataStructure';
// import { formatEnglishLocation } from '#/utils/langUtils';
// import { LANG } from '#/utils/constants';

const renderTagsComponent = (listTag, name) => (listTag
  ? listTag.map((item, index) => {
    const TagName = name;
    const props = item;
    const keys = Object.keys(props)
    keys.forEach((key) => {
      if (!props[key]) {
        delete props[key]
      }
    });

    return <TagName key={index} {...props} />;
  })
  : '');

class SEOContainer extends React.PureComponent {
  static async getInitialProps(props) {
    const { isServer } = props.ctx;

    return { isServer };
  }

  generateDatastructure = () => [this.props.seo.richSnippet, ...this.props.seo.dataStructures];

  generateHomeDatastructure = () => [...this.props.seo.dataStructures];

  generateDatastructureEl = (pathUrl) => {
    let dataStructure;
    switch (true) {
      case /\/((ve-xe-)|(bus-ticket-booking-))(.*)/.test(pathUrl):
        dataStructure = this.generateDatastructure();
        break;
      case /^((\/vi-VN)|(\/en-US)|\/)$/.test(pathUrl):
        dataStructure = this.generateHomeDatastructure();
        break;
      case /((\/vi-VN)|(\/en-US))\/partnership\/(.*)/.test(pathUrl):
        dataStructure = this.props.seo.dataStructures
        break;
      case /\/(vi-VN|en-US)\/((xe-limousine)|(limousine-bus))$/.test(pathUrl):
        dataStructure = this.generateDatastructure();
        break;
      default:
        // Statements executed when none of
        // the values match the value of the expression
        break;
    }

    return dataStructure
      ? dataStructure.map((item, index) => (item
        ? <DataStructure key={index} data={item} /> : null))
      : null;
  };

  generateMetas = (pathUrl) => {
    const {
      seoReducer,
    } = this.props;
    let metas;
    switch (true) {
      case /\/((ve-xe-)|(bus-ticket-booking-))(.*)/.test(pathUrl):
        metas = _get(seoReducer, 'seo.metas');
        break;
      case /((\/vi-VN)|(\/en-US)|\/)$/.test(pathUrl):
        metas = _get(seoReducer, 'seo.metas');
        break;
      case /((\/vi-VN)|(\/en-US))\/partnership\/(.*)/.test(pathUrl):
        metas = _get(seoReducer, 'seo.metas');
        break;
      case /\/(vi-VN|en-US)\/ticketbooking/.test(pathUrl):
        metas = _get(seoReducer, 'seoBooking.metas')
        break;
      case /\/(vi-VN|en-US)\/payment-method/.test(pathUrl):
        metas = _get(seoReducer, 'seoPayment.metas')
        break;
      case /\/(vi-VN|en-US)\/payment-result/.test(pathUrl):
        metas = _get(seoReducer, 'seoPaymentResult.metas')
        break;
      default:
        // Statements executed when none of
        // the values match the value of the expression
        break;
    }
    return metas
  }

  generateLinks = (pathUrl) => {
    const {
      seoReducer,
    } = this.props;
    let links;
    switch (true) {
      case /\/((ve-xe-)|(bus-ticket-booking-))(.*)/.test(pathUrl):
        links = _get(seoReducer, 'seo.links')
        break;
      case /((\/vi-VN)|(\/en-US)|\/)$/.test(pathUrl):
        links = _get(seoReducer, 'seo.links')
        break;
      case /((\/vi-VN)|(\/en-US))\/partnership\/(.*)/.test(pathUrl):
        links = _get(seoReducer, 'seo.links');
        break;
      case /\/(vi-VN|en-US)\/ticketbooking/.test(pathUrl):
        links = _get(seoReducer, 'seoBooking.links')
        break;
      case /\/(vi-VN|en-US)\/payment-method/.test(pathUrl):
        links = _get(seoReducer, 'seoPayment.links')
        break;
      case /\/(vi-VN|en-US)\/payment-result/.test(pathUrl):
        links = _get(seoReducer, 'seoPaymentResult.links')
        break;
      default:
        // Statements executed when none of
        // the values match the value of the expression
        break;
    }
    return links
  }

  render() {
    const {
      seo, path,
    } = this.props;
    let route
    if (typeof window !== 'undefined') {
      route = window.location.href
    } else {
      route = path
    }
    const dataStructureEl = this.generateDatastructureEl(route);
    const metas = this.generateMetas(route)
    const links = this.generateLinks(route)

    return (
      <>
        {dataStructureEl}
        <Head>
          <title>
            {seo.title}
          </title>
          {renderTagsComponent(metas, 'meta')}
          {renderTagsComponent(links, 'link')}
        </Head>
      </>
    );
  }
}

const mapStateToProps = state => ({
  seo: state.seoReducer.seo,
  seoReducer: state.seoReducer,
});

export default injectIntl(
  connect(
    mapStateToProps,
    null,
    null,
    { withRef: true },
  )(SEOContainer),
);
