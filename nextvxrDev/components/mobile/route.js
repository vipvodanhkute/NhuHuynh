import React from 'react';
import some from 'lodash.some'
import Navbar from 'vxrd/components/Layout/Navbar';
import HeadroomFilter from 'vxrd/components/RouteComponent/HeadroomFilter';
import ButtonFilter from 'vxrd/components/RouteComponent/ButtonFilter';
import TicketGroupTitle from 'vxrd/components/RouteComponent/TicketGroupTitle';
import AutocompleteSearch from 'vxrd/components/RouteComponent/AutocompleteSearch';
import CalendarModal from 'vxrd/components/RouteComponent/CalendarModal';
import Calendar from 'vxrd/components/RouteComponent/Calendar';
import Button from 'vxrd/components/Antd/Button';
import ModalFullScreen from 'vxrd/components/Antd/ModalFullScreen';
import message from 'vxrd/components/Antd/Message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Router } from '#/routes';
// import Router from 'next/router'
import moment from 'moment';
// import Router from 'next/router';
import withReduxSaga from 'next-redux-saga';
import dotProp from 'dot-prop-immutable-chain';
import styled from 'styled-components';
import get from 'lodash.get';
import pluralize from 'pluralize';
import Carousel from 'antd/lib/carousel';
import { LANG } from '#/utils/constants';
import {
  DESTINATION_SWAP,
  SELECT_FROM_SUGGESTION,
  SELECT_DATE,
  SEARCH_BUSES,
  LUNA_CALENDAR_BUTTON,
  FROM_TYPE,
  TO_TYPE,
  LOGO_MENU,
  ROUTE_NAME,
  LANGUAGE_CHANGE,
  CALENDAR,
  SORT_BY_TIME,
  SORT_BY_PRICE,
  FILTER_OPEN,
  SEE_MORE_TRIPS,
  PRODUCT_CLICK,
  PRODUCT_IMPRESSION,
} from '#/containers/Route/constants';
// import pageWithIntl from '../components/PageWithIntl'
import {
  getRoutes,
  updateStateRedux,
  getRoute,
  postNewBusOperator,
  clearFilter,
} from '#/containers/Route/actions';
import { sendEventTracking } from '#/containers/Device/actions';
import { resetBookingData } from '#/containers/Booking/actions';
import { getSEOData, getSEOCompanies } from '#/containers/SEO/actions';
import * as apiSEO from '#/utils/api/seo';
import {
  GROUPS, ROUTE_STATUS, TIME_GROUPS, INIT_GROUPS,
} from '#/containers/Route/reducer';
import {
  createUrl,
  payloadToQuery,
} from '#/utils/pathUtils';
import { payloadToParams } from '#/utils/api/route';
import TicketWrapper from '#/containers/Route/TicketWrapper';
import ModalSendRequest from '#/containers/Route/ModalSendRequest';
// import MapCompany from '#/static/json/mapCompany';
import { search } from '#/utils/searchUtils';
import Filter from '#/containers/Route/Filter/Filter';
import NotFoundResults from '#/containers/Route/NotFoundResults';
import RouteStorage from '#/utils/routeStorage';
import { hideBodyScroll, showBodyScroll } from '#/utils/vanillaJS/dialogFuncs';
import { BANNER_PAGE } from '#/containers/Banner/constants';
import { getBanners } from '#/containers/Banner/actions';

const TicketGroupContainer = styled.div`
  > div:first-child {
    margin-top: 124px;
  }
`;

const HeaderStyled = styled.div`
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
`;

const LoadMoreStyled = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0px 16px 0px;
`;
const ContentContainer = styled.div`
  padding: 0 16px;
  font-color: #484848;
  > div {
    margin-bottom: 16px;
  }
`;

const ImgPromotionStyled = styled.img`
  width: 100%;
  height: 117px;
`
const BannerContainer = styled.div`
  background: #f4f4f4;
  height: 123px;
`;

const SORT_ITEM = {
  FARE: 'fare',
  TIME: 'time',
};

class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOpenSearchLocation: false,
      isOpenCalendar: false,
      isOpenFilter: false,
      isOpenModalReview: false,
      isOpenSendRequestModal: false,
      searchLocations: [],
      recentLocations: [],
      headroomDisabled: false,
      payload: {
        from: props.payload.from || {},
        to: props.payload.to || {},
      },
    };
  }

  componentWillMount() {
    this.mounted = true;
    this.props.resetBookingData();
  }

  componentDidMount() {
    const {
      payload: { from, to },
    } = this.state;
    setTimeout(() => {
      this.props.stopLoading();
    }, 0);
    setTimeout(() => {
      window.scrollTo(0, this.props.infoScreenRoute.scrollY);
      this.props.updateStateRedux('infoScreenRoute', { dataLoaded: true, scrollY: 0 });
    }, 0);

    // GTM
    const tickets = [];
    Object.keys(INIT_GROUPS).forEach((group) => {
      const groupTickets = get(this.props, `groups.${group}.tickets`);
      if (groupTickets) {
        tickets.push(...groupTickets);
      }
    });
    if (tickets.length) {
      this.props.sendEventTracking({
        type: PRODUCT_IMPRESSION,
        tickets,
        from,
        to,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.payloadRequest.isLoading && this.props.payloadRequest.isLoading) {
      this.onCloseModal('isOpenSendRequestModal');
      if (nextProps.payloadRequest.success) {
        message.success(
          this.props.intl.formatMessage({ id: 'route.modalSendRequest.successText' }),
        );
      } else {
        // cho dù lỗi cũng gửi thành công cho người dùng
        message.success(
          this.props.intl.formatMessage({ id: 'route.modalSendRequest.successText' }),
        );
      }
    }
    if (nextProps.payload.groups.error) {
      message.error(
        this.props.intl.formatMessage({
          id: `err.FromAPI.${get(nextProps, 'payload.groups.error.code')}`,
        }),
      );
      this.props.updateStateRedux('payload.groups.error', undefined);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  changeLanguage = () => {
    this.props.sendEventTracking({ type: LANGUAGE_CHANGE });
    const {
      payload: { lang },
    } = this.props;
    const langSwitch = {
      [LANG.VN]: LANG.EN,
      [LANG.EN]: LANG.VN,
    };

    const url = createUrl({ ...payloadToQuery(this.props.payload), lang: langSwitch[lang] });
    window.location.href = url;
  };

  onClickTicket = (index, ticket, schedule) => {
    if (ticket.numberSeatAvailable !== 0) {
      const {
        payload: { lang },
        currentUrl,
        query,
      } = this.props;
      const { tripCode, bookingType } = schedule || ticket;
      const { fareLarge } = ticket;
      const {
        payload: { from, to },
      } = this.state;
      this.props.sendEventTracking({
        type: PRODUCT_CLICK,
        ticket,
        index,
        from,
        to,
      });
      this.props.updateStateRedux('infoScreenRoute', { dataLoaded: true, scrollY: window.scrollY });
      this.props.loading();
      RouteStorage.setRoutePageUrl(currentUrl);
      const params = {
        lang,
        trip_code: tripCode,
        booking_type: bookingType,
        step: 1,
        from: from.id,
        to: to.id,
        fare: fareLarge.replace(/,/g, ''),
      }
      if (query.aid) {
        params.aid = query.aid;
      }
      Router.pushRoute('booking', params);
    }
  };

  onClickFilter = () => {
    this.props.sendEventTracking({ type: FILTER_OPEN });
    this.onOpenModal('isOpenFilter');
  };

  onSearchLocation = (value, elementFocused) => {
    if (elementFocused === 'FROM') {
      this.props.sendEventTracking({ type: FROM_TYPE });
    }
    if (elementFocused === 'TO') {
      this.props.sendEventTracking({ type: TO_TYPE });
    }
    if (!this.mounted) return;
    if (value && value.replace(/^\s+/g, '').length > 1) {
      this.setState({ searchLocations: search(value) });
    }
  };

  onSubmit = (payload, filters) => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      const newPayload = { ...this.props.payload, ...payload };
      const query = payloadToQuery(newPayload);
      this.props.getRoutes(newPayload, filters);
      this.props.getSEOCompanies(apiSEO.payloadToParams(newPayload));
      this.props.getBanners({
        page: BANNER_PAGE.ROUTE_PAGE,
        scope: `${get(newPayload, 'from.id')}|${get(newPayload, 'to.id')}`,
      });
      // isGetSEOData && this.props.getSEOData(apiSEO.payloadToParams(newPayload))
      const {
        from, to, date, numOfTickets,
      } = newPayload
      localStorage.setItem('index.payload', JSON.stringify({
        from, to, date, numOfTickets,
      }))
      Router.pushRoute('route', query, { shallow: true });
    }, 0)
  };

  onLocationChange = ({ from, to }) => {
    this.props.sendEventTracking({ type: SEARCH_BUSES });

    if (!from.name || !to.name) {
      return;
    }
    this.setState(
      prevState => ({
        payload: {
          ...prevState.payload,
          from,
          to,
          groups: this.resetPagination(),
          suggestion: GROUPS,
          sort: {},
        },
      }),
      () => {
        this.onCloseModal('isOpenSearchLocation');
        this.onSubmit(this.state.payload, this.props.defaultFilters);
      },
    );
  };

  onDateChange = (date) => {
    this.props.sendEventTracking({ type: SELECT_DATE });
    const newDate = date.startOf('day');
    this.props.updateStateRedux('payload.date', newDate);
    this.setState(
      {
        isOpenCalendar: false,
      },
      () => {
        if (!this.state.isOpenSearchLocation) {
          this.onSubmit(
            {
              ...this.props.payload,
              ...this.state.payload,
              newDate,
              groups: this.resetPagination(),
              suggestion: GROUPS,
              sort: {},
            },
            this.props.defaultFilters,
          );
        }
        this.onCloseModal('isOpenCalendar');
      },
    );
  };

  onOpenSearchLocation = () => {
    this.props.sendEventTracking({ type: ROUTE_NAME });
    if (!this.state.recentLocations.length) {
      let recentLocations = localStorage.getItem('recentLocations');
      recentLocations = JSON.parse(recentLocations);
      this.setState({ recentLocations: recentLocations || [] });
    }
    this.onOpenModal('isOpenSearchLocation');
    this.prevState = {
      date: this.props.payload.date,
      from: this.state.payload.from,
      to: this.state.payload.to,
    };
  };

  onDatePickerClick = () => {
    this.props.sendEventTracking({ type: CALENDAR });
    this.onOpenModal('isOpenCalendar');
  };

  onCloseSearchLocation = () => {
    this.setState({
      isOpenSearchLocation: false,
      payload: { from: this.prevState.from, to: this.prevState.to },
    });
    this.props.updateStateRedux('payload.date', this.prevState.date);
    this.onCloseModal('isOpenSearchLocation');
  };

  onItemClickLocationSearch = (item, element) => {
    this.props.sendEventTracking({ type: SELECT_FROM_SUGGESTION })
    this.state.payload[element] = item
    this.setState({ searchLocations: [] })
    const index = this.state.recentLocations.findIndex(x => x.id === item.id)
    const newRecentLocations = this.state.recentLocations;
    if (index >= 0) {
      newRecentLocations.splice(index, 1)
    }
    this.setState(() => ({
      recentLocations: [item, ...newRecentLocations],
    }), () => { localStorage.setItem('recentLocations', JSON.stringify(this.state.recentLocations)) })
  }

  onSwapLocationSearch = ({ from, to }) => {
    this.props.sendEventTracking({ type: DESTINATION_SWAP });
    this.state.payload.from = from;
    this.state.payload.to = to;
  };

  onClickLunaCalendar = (isShowLuna) => {
    if (isShowLuna) {
      this.props.sendEventTracking({ type: LUNA_CALENDAR_BUTTON });
    }
  };

  onClickSort = (item) => {
    const sortSwitch = {
      fare: 'asc',
      time: 'asc',
    };

    const suggestionSwitch = {
      fare: GROUPS,
      time: Object.keys(TIME_GROUPS),
    };

    if (get(this.props, `payload.sort[${item}]`)) {
      const newPayload = {
        ...this.props.payload,
        sort: {},
        suggestion: GROUPS,
      };
      this.props.updateStateRedux('payload', newPayload);
      this.onSubmit(newPayload, this.props.payloadFilter.filters);
    } else {
      const newPayload = {
        ...this.props.payload,
        sort: {
          [item]: sortSwitch[item],
        },
        suggestion: suggestionSwitch[item],
        groups: this.resetPagination(),
      };
      this.props.updateStateRedux('payload', newPayload);
      this.onSubmit(newPayload, this.props.payloadFilter.filters);
    }
  };

  resetPagination = () => {
    const groups = {};
    GROUPS.forEach((item) => {
      groups[item] = dotProp.set(this.props.payload.groups[item], 'page', 1);
    });
    return groups;
  };

  onLoadMore = (groupName) => {
    this.props.sendEventTracking({ type: SEE_MORE_TRIPS });
    const groups = { ...this.props.payload.groups };
    groups[groupName].page += 1;
    const params = payloadToParams({
      ...this.props.payload,
      suggestion: [groupName],
      groups,
    }, get(this.props, 'payloadFilter.filters', {}));
    params[0].isLoadMore = true;
    this.props.getRoute(params[0]);
  };

  handleOnChangeFilter = ({ totalFilterApplied, filters }) => {
    this.props.updateStateRedux('payloadFilter', {
      ...this.props.payloadFilter,
      filters,
      totalFilterApplied,
    });
    this.props.getRoutes(this.props.payload, filters);
    this.onCloseModal('isOpenFilter');
  };

  handleOnCloseFilter = () => {
    this.onCloseModal('isOpenFilter');
  };

  onReviewClick = () => {
    // this.onOpenModal('isOpenModalReview')
  };

  onOpenModal = (typeOpen) => {
    if (typeOpen) {
      this.setState({ [typeOpen]: true, headroomDisabled: true });
    }
    hideBodyScroll();
  }

  onCloseModal = (typeClose) => {
    if (typeClose) {
      this.setState({ [typeClose]: false, headroomDisabled: false }, () => {
        const {
          isOpen,
          isOpenCalendar,
          isOpenFilter,
          isOpenModalReview,
          isOpenSearchLocation,
          isOpenSendRequestModal,
        } = this.state
        if (!some([isOpen,
          isOpenCalendar,
          isOpenFilter,
          isOpenModalReview,
          isOpenSearchLocation,
          isOpenSendRequestModal])) {
          showBodyScroll();
        }
      });
    }
  }

  onClickMenuNavbar = () => {
    const { isOpen } = this.state;
    if (!isOpen) {
      this.props.sendEventTracking({ type: LOGO_MENU });
    }
    if (isOpen) {
      this.onCloseModal('isOpen');
    } else {
      this.onOpenModal('isOpen');
    }
  };

  onSortTime = () => {
    this.props.sendEventTracking({ type: SORT_BY_TIME });
    this.onClickSort(SORT_ITEM.TIME);
  };

  onSortFare = () => {
    this.props.sendEventTracking({ type: SORT_BY_PRICE });
    this.onClickSort(SORT_ITEM.FARE);
  };

  getDescription = (group, intl, date) => {
    if (TIME_GROUPS[group]) {
      return intl.formatMessage(
        { id: 'route.ticketGroup.description.departureTime' },
        { min: TIME_GROUPS[group].time.min, max: TIME_GROUPS[group].time.max },
      );
    }
    return moment(date).format(
      intl.formatMessage({
        id: 'route.ticketGroup.description.default',
      }),
    );
  };

  onSubmitNewBusOperator = (value) => {
    const { payload } = this.props;
    this.props.postNewBusOperator({
      ...value,
      from_id: get(payload, 'from.id'),
      to_id: get(payload, 'to.id'),
    });
  };

  clearFilter = () => {
    this.props.clearFilter();
    this.props.getRoutes(this.props.payload, this.props.defaultFilters);
  };

  renderTickets = () => {
    const rs = [];
    const {
      groups,
      intl,
      payload: { suggestion, date },
      banners,
      query: { lang },
    } = this.props;
    if (groups.isLoading) {
      Array(5).map((value, index) => {
        rs.push(<TicketWrapper key={index} isLoading data={{}} />);
        return null;
      });

      return rs;
    }

    suggestion.forEach((groupName, indexGroup) => {
      if (!groups[groupName]) return;
      if (indexGroup > 0) {
        for (let i = indexGroup; i > 1; i -= 1) {
          if (groups[suggestion[i - 1]].isLoading) return;
        }
      }
      const {
        tickets, page, pagesize, total, isLoading, totalAvailableTrips,
      } = groups[groupName];
      if (tickets && tickets.length) {
        rs.push(
          <div key={indexGroup}>
            <TicketGroupTitle
              title={`${intl.formatMessage(
                { id: `route.ticketGroup.title.${groupName}` },
                { number: totalAvailableTrips, trip: pluralize('trip', totalAvailableTrips) },
              )}`}
              description={this.getDescription(groupName, intl, date)}
            />
            {!!tickets
              && !!tickets.length
              && tickets.map((ticketData, index) => (index === 0 && get(banners, 'main', []).length > 0
                ? (
                  <>
                    <TicketWrapper
                      key={index}
                      data={ticketData}
                      intl={intl}
                      onClick={this.onClickTicket.bind(this, index)}
                      onReviewClick={this.onReviewClick}
                      lang={lang}
                    />
                    <BannerContainer key={index}>
                      <Carousel
                        autoplay
                      >
                        {
                                get(banners, 'main', []).map((banner, indexImg) => (
                                  <a href={banner.Url} key={indexImg}>
                                    <ImgPromotionStyled src={`//${banner.Source}`} />
                                  </a>
                                ))
                              }
                      </Carousel>
                    </BannerContainer>
                  </>
                )
                : (
                  <TicketWrapper
                    key={index}
                    data={ticketData}
                    intl={intl}
                    onClick={this.onClickTicket.bind(this, index)}
                    onReviewClick={this.onReviewClick}
                    lang={lang}
                  />
                )))}
            {isLoading
              && Array(3)
                .fill(3)
                .map((item, index) => (
                  <TicketWrapper key={index} isLoading={isLoading} data={{}} />
                ))}
            {page * pagesize < total && !isLoading && (
            <LoadMoreStyled>
              <Button ghost type="primary" onClick={this.onLoadMore.bind(this, groupName)}>
                {intl.formatMessage({ id: 'route.ticket.loadmore' })}
              </Button>
            </LoadMoreStyled>
            )}
          </div>,
        )
      } else if (isLoading) {
        [1, 2, 3].forEach((index) => {
          rs.push(<TicketWrapper key={index + groupName} isLoading data={{}} />);
        });
      }
    });

    return rs;
  };

  renderDeparted = () => {
    const { intl } = this.props;
    return (
      <NotFoundResults
        title={intl.formatMessage({ id: 'route.departed.title' })}
        description={intl.formatMessage({ id: 'route.departed.description' })}
      >
        <ContentContainer>
          <Calendar
            date={moment(this.props.payload.date)}
            onDateChange={this.onDateChange}
            isDayBlocked={day => moment.isMoment(day) && day.diff(moment(), 'days', false) < 0}
            todayText={intl.formatMessage({ id: 'route.datepicker.today' })}
            lunarText={intl.formatMessage({ id: 'route.datepicker.lunarText' })}
          />
        </ContentContainer>
      </NotFoundResults>
    );
  };

  renderNoBusOperators = () => {
    const {
      intl,
      payloadRequest: { isLoading },
    } = this.props;
    const { isOpenSendRequestModal } = this.state;
    return (
      <NotFoundResults
        title={intl.formatMessage({ id: 'route.notExists.title' })}
        description={intl.formatMessage({ id: 'route.notExists.description' })}
      >
        <ContentContainer>
          <div>{intl.formatMessage({ id: 'route.notExists.question' })}</div>
          <Button type="primary" onClick={this.onOpenModal.bind(this, 'isOpenSendRequestModal')}>
            {intl.formatMessage({ id: 'route.notExists.sendRequest' })}
          </Button>
          {isOpenSendRequestModal && (
            <ModalSendRequest
              onSubmit={this.onSubmitNewBusOperator}
              isLoading={isLoading}
              intl={intl}
              visible={isOpenSendRequestModal}
              onCancel={this.onCloseModal.bind(this, 'isOpenSendRequestModal')}
            />
          )}
        </ContentContainer>
      </NotFoundResults>
    );
  };

  renderSoldOutTickets = () => {
    const { intl } = this.props;
    return (
      <NotFoundResults
        key={999}
        title={intl.formatMessage({ id: 'route.soldOutTickets.title' })}
        description={intl.formatMessage({ id: 'route.soldOutTickets.description' })}
      >
        <ContentContainer>
          <Calendar
            date={moment(this.props.payload.date)}
            onDateChange={this.onDateChange}
            isDayBlocked={day => moment.isMoment(day) && day.diff(moment(), 'days', false) < 0}
            todayText={intl.formatMessage({ id: 'route.datepicker.today' })}
            lunarText={intl.formatMessage({ id: 'route.datepicker.lunarText' })}
          />
        </ContentContainer>
      </NotFoundResults>
    );
  };

  renderNoResultsByFilter = () => {
    const {
      intl,
      payload: {
        groups: { preTotal },
      },
    } = this.props;
    return (
      <NotFoundResults
        title={intl.formatMessage({ id: 'route.noResultByFilter.title' })}
        description={intl.formatMessage({ id: 'route.noResultByFilter.description' })}
      >
        <ContentContainer>
          <div>
            {intl.formatMessage(
              { id: 'route.noResultByFilter.clearFilterContent' },
              { total: preTotal },
            )}
          </div>
          <Button type="primary" onClick={this.clearFilter}>
            {intl.formatMessage({ id: 'route.noResultByFilter.clear' })}
          </Button>
        </ContentContainer>
      </NotFoundResults>
    );
  };

  renderLoading = () => Array(5)
    .fill(5)
    .map((value, index) => <TicketWrapper key={index} isLoading data={{}} />);

  renderBody = () => {
    const {
      groups,
      groups: { total: totalTicket },
      payloadFilter: { totalFilterApplied },
    } = this.props;
    if (groups.isLoading) {
      return this.renderLoading();
    }
    if (totalTicket === 0 && totalFilterApplied) {
      return this.renderNoResultsByFilter();
    }
    switch (this.props.payload.status) {
      case ROUTE_STATUS.NORMAL: {
        return this.renderTickets();
      }
      case ROUTE_STATUS.SOLD_OUT: {
        return [this.renderSoldOutTickets(), this.renderTickets()];
      }
      case ROUTE_STATUS.DEPARTED: {
        return this.renderDeparted();
      }
      case ROUTE_STATUS.NOT_EXIST: {
        return this.renderNoBusOperators();
      }
      default: {
        return null;
      }
    }
  };

  render() {
    const {
      query: { lang },
      menu,
      intl,
      payload: { status, from, to },
      payloadFilter: { totalFilterApplied },
    } = this.props;
    const {
      isOpen,
      isOpenSearchLocation,
      searchLocations,
      payload,
      isOpenFilter,
      isOpenModalReview,
    } = this.state;
    return (
      <>
        <HeaderStyled>
          <Navbar
            data={{ menuLeftItems: menu[lang], title: `${from.name || payload.from.name} - ${to.name || payload.to.name}` }}
            isOpen={isOpen}
            onClickMenu={this.onClickMenuNavbar}
            onClickItem={({ url }) => {
              window.location.href = url;
            }}
            onClickLanguage={this.changeLanguage}
            isLanguageVN={lang !== LANG.VN}
            onClickTitle={this.onOpenSearchLocation}
          />
        </HeaderStyled>
        <HeadroomFilter top={32} disabled={this.state.headroomDisabled}>
          <ButtonFilter onClick={this.onOpenModal.bind(this, 'isOpenCalendar')}>
            {moment(this.props.payload.date).format(
              intl.formatMessage({ id: 'route.search.dateText' }),
            )}
          </ButtonFilter>
          <ButtonFilter
            disabled={status !== ROUTE_STATUS.NORMAL}
            onClick={this.onSortTime}
            active={get(this.props, 'payload.sort.time', false)}
          >
            {intl.formatMessage({ id: 'route.filter.time' })}
          </ButtonFilter>
          <ButtonFilter
            disabled={status !== ROUTE_STATUS.NORMAL}
            onClick={this.onSortFare}
            active={get(this.props, 'payload.sort.fare', false)}
          >
            {intl.formatMessage({ id: 'route.filter.fare' })}
          </ButtonFilter>
          <ButtonFilter
            disabled={status !== ROUTE_STATUS.NORMAL}
            onClick={this.onClickFilter}
            active={totalFilterApplied}
          >
            {intl.formatMessage({ id: 'route.filter.filter' })}
            {!!totalFilterApplied && <>&nbsp;•&nbsp;{totalFilterApplied}</>}
          </ButtonFilter>
        </HeadroomFilter>
        <TicketGroupContainer>{this.renderBody()}</TicketGroupContainer>
        <AutocompleteSearch
          placeholderFrom={intl.formatMessage({ id: 'route.search.placeholderFrom' })}
          placeholderTo={intl.formatMessage({ id: 'route.search.placeholderTo' })}
          dataSearch={searchLocations}
          itemClick={this.onItemClickLocationSearch}
          searchText={intl.formatMessage({ id: 'route.search.searchText' })}
          debounceTime={200}
          onChange={this.onSearchLocation}
          closeText={intl.formatMessage({ id: 'route.search.closeText' })}
          dateText={moment(this.props.payload.date).format(
            intl.formatMessage({ id: 'route.search.dateText' }),
          )}
          numberSeatText={intl.formatMessage({ id: 'route.search.numberSeatText' })}
          isOpen={isOpenSearchLocation}
          onSubmit={this.onLocationChange}
          onClose={this.onCloseSearchLocation}
          onDatePickerClick={this.onDatePickerClick}
          data={payload}
          dataSearchRecent={this.state.recentLocations}
          onSwap={this.onSwapLocationSearch}
        />
        <CalendarModal
          onClickLunaCalendar={this.onClickLunaCalendar}
          isOpen={this.state.isOpenCalendar}
          onClickModal={this.onCloseModal.bind(this, 'isOpenCalendar')}
          date={moment(this.props.payload.date)}
          onDateChange={this.onDateChange}
          isDayBlocked={day => moment.isMoment(day) && day.diff(moment(), 'days', false) < 0}
          todayText={intl.formatMessage({ id: 'route.datepicker.today' })}
          lunarText={intl.formatMessage({ id: 'route.datepicker.lunarText' })}
          initialVisibleMonth={() => moment(this.props.payload.date)}
          focused
        />
        {isOpenFilter && (
          <Filter onChange={this.handleOnChangeFilter} onClose={this.handleOnCloseFilter} />
        )}
        <ModalFullScreen
          title="abc"
          visible={isOpenModalReview}
          onCancel={this.onCloseModal.bind(this, 'isOpenModalReview')}
        >
          {Array(50)
            .fill(0)
            .map((item, index) => (
              <div key={index}>content</div>
            ))}
        </ModalFullScreen>
      </>
    );
  }
}

const mapStateToProps = state => ({
  payload: state.routeReducer.payload,
  groups: state.routeReducer.payload.groups,
  menu: state.homeReducer.menu,
  infoScreenRoute: state.routeReducer.infoScreenRoute,
  payloadRequest: state.routeReducer.payloadRequest,
  payloadFilter: state.routeReducer.payloadFilter,
  defaultFilters: state.routeReducer.defaultFilters,
  banners: state.bannerReducer.banners,
});

const mapDispatchToProps = dispatch => ({
  getRoutes: bindActionCreators(getRoutes, dispatch),
  getRoute: bindActionCreators(getRoute, dispatch),
  getSEOData: bindActionCreators(getSEOData, dispatch),
  updateStateRedux: bindActionCreators(updateStateRedux, dispatch),
  postNewBusOperator: bindActionCreators(postNewBusOperator, dispatch),
  clearFilter: bindActionCreators(clearFilter, dispatch),
  sendEventTracking: bindActionCreators(sendEventTracking, dispatch),
  resetBookingData: bindActionCreators(resetBookingData, dispatch),
  getSEOCompanies: bindActionCreators(getSEOCompanies, dispatch),
  getBanners: bindActionCreators(getBanners, dispatch),
});
// export default connect(state => state)(Route)
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withReduxSaga({ async: true })(Route))
