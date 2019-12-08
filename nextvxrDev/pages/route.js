import React from 'react'
import dynamic from 'next/dynamic';
import moment from 'moment'
import get from 'lodash.get'
import {
  getRoutes,
} from '#/containers/Route/actions';
import { getSEOData } from '#/containers/SEO/actions';
import * as apiSEO from '#/utils/api/seo';
import {
  GROUPS,
} from '#/containers/Route/reducer';
import {
  isIncorrectLanguageUrl,
  isIncorrectDate,
  getBusOperatorName,
  createUrl,
  queryToPayload,
} from '#/utils/pathUtils';
import { BANNER_PAGE } from '#/containers/Banner/constants';
import { getBanners } from '#/containers/Banner/actions';

import Loading from '#/components/base/loading'
import dynamicImport from '#/utils/dynamicImport';


class Route extends React.Component {
  static async getInitialProps({ ctx }) {
    const {
      isServer,
      query: { lang },
      query,
      res,
      store,
    } = ctx;
    if (isIncorrectLanguageUrl(query, lang)) {
      const busOperatorName = getBusOperatorName(query.ticketType);
      const correctURL = createUrl(query, busOperatorName);
      if (res) {
        res.redirect(correctURL);
      }
      return { isServer }
    }
    if (isIncorrectDate(query)) {
      const busOperatorName = getBusOperatorName(query.ticketType);
      query.date = moment().add(1, 'd').format('DD-MM-YYYY');
      const correctURL = createUrl(query, busOperatorName);
      if (res) {
        res.redirect(correctURL);
      } else {
        window.location.href = correctURL
      }
      return { isServer };
    }
    const payload = queryToPayload(query);
    payload.suggestion = GROUPS;
    if (!store.getState().routeReducer.infoScreenRoute.dataLoaded) {
      store.dispatch(getRoutes(payload, store.getState().routeReducer.defaultFilters, isServer));
      store.dispatch(getSEOData(apiSEO.payloadToParams(payload)));
      store.dispatch(getBanners({
        page: BANNER_PAGE.ROUTE_PAGE,
        scope: `${get(payload, 'from.id')}|${get(payload, 'to.id')}`,
      }));
    }
    const currentUrl = ctx.asPath;
    return {
      isServer,
      query,
      currentUrl,
    };
  }

  render() {
    const Component = dynamicImport('route', { userAgent: this.props.ua })
    return <Component {...this.props} />
  }
}

export default Route
