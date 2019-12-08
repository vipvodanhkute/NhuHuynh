import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import get from 'lodash.get'
import Navbar from 'vxrd/components/Layout/Navbar';
import SearchWidget from 'vxrd/components/HomeComponent/SearchWidget';
import SearchLocation from 'vxrd/components/HomeComponent/SearchLocation';
import BackIcon from 'vxrd/components/Layout/Header/BackIcon';
import Title from 'vxrd/components/Layout/Header/Title';
import CalendarModal from 'vxrd/components/RouteComponent/CalendarModal';
import Carousel from 'antd/lib/carousel';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import { updatePayload } from '#/containers/HomePage/actions';
import { Router } from '#/routes';
import {
  searchTicket, updateStateRedux,
} from '#/containers/Route/actions';
import { sendEventTracking } from '#/containers/Device/actions';
import {
  GA_SEARCH_BUSES_BUTTON,
  GA_DESTINATION_SWAP,
  GA_TODAY,
  GA_TOMORROW,
  GA_FROM,
  GA_TO,
  GA_SWITCH_LANGUAGE_EN,
  GA_SWITCH_LANGUAGE_VI,
} from '#/containers/HomePage/constants'

import { search } from '#/utils/searchUtils';
import { LANG } from '#/utils/constants';
import { payloadToQuery } from '#/utils/pathUtils';
import { hideBodyScroll, showBodyScroll } from '#/utils/vanillaJS/dialogFuncs';
import defaultLocations from '#/static/json/default_area';

const HeaderStyled = styled.div`
  >div {
    padding-top: 24px;
    background: transparent;
  }
  #icon_vxr{
    fill: #F8C13B;
  }
  .anticon-caret-down, .anticon-caret-up{
    color: #F8C13B;
  }
 
`

const BodyWrapper = styled.div`
  top: -64px;
  position: relative;
`

const SearchWidgetWrapper = styled.div`
  position: relative;
  min-height: 450px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  overflow: hidden;
  margin-bottom: 20px;
`
const ImageStyled = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  min-width: 100%;
`

const SearchWidgetStyled = styled.div`
  padding: 94px 16px 28px 16px;
  width: 100%;
  height: 100%; 
  position: relative;
`

const Slogan = styled.h2`
  color: white;
  font-size: 16px;
  margin-bottom: 24px;
  text-align: center;
  white-space: pre-wrap;
`

const TitleStyled = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #484848;
  margin-bottom: 12px;
  h1{
    font-size: 16px;
    font-weight: bold;
    color: #484848;
    margin-bottom: 12px;
  }
`
const ImgPromotionStyled = styled.img`
  width: 100%;
  height: 117px;
`

const RowStyled = styled(Row)`
  padding: 0 16px;
  margin-bottom: 24px;
`

const ContentStyled = styled.h3`
  font-size: 13px;
  color: #767676;
  margin: 0;
`
const IntroStyled = styled.div`
  text-align: center;
  border: 1px solid #C0C0C0;
  border-radius: 3px;
  padding: 8px;
`

const NumberStyled = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`
const logoUrl = 'https://storage.googleapis.com/fe-production/images/header/logo_vxr_text.svg';
const routeSVGUrl = 'https://storage.googleapis.com/fe-production/images/Home/icon-kpi-road.svg';
const companySVGUrl = 'https://storage.googleapis.com/fe-production/images/Home/icon-kpi-bus.svg';
const agentSVGUrl = 'https://storage.googleapis.com/fe-production/images/Home/icon-kpi-ticket.svg';
const backgroundUrl = 'https://storage.googleapis.com/fe-production/bg-limousine.jpg';

class Index extends React.Component {
  constructor(props) {
    super(props)
    let localPayload
    if (typeof localStorage !== 'undefined') {
      localPayload = JSON.parse(localStorage.getItem('index.payload'))
      if (get(localPayload, 'date')) {
        const date = moment(localPayload.date)
        if (date.date() - moment().date() < 0) {
          localPayload.date = moment().startOf('date');
        }
      }
    }
    this.state = {
      payload: localPayload || { ...props.payload, date: moment().startOf('date') },
      searchLocations: [],
      isOpenNavbar: false,
      isOpenCalendar: false,
      isOpenSearchLocation: false,
      elementFocused: undefined,
      recentLocations: [],
      isLoadingTicket: false,
    }
  }

  componentWillMount() {
    this.mounted = true;
    this.props.updateStateRedux('infoScreenRoute', { dataLoaded: false, scrollY: 0 })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onDateChange = (date) => {
    const { payload } = this.state
    this.setState({
      payload: {
        ...payload,
        date: date.startOf('day'),
      },
    })
    this.onCloseModal('isOpenCalendar')
  }

  onCloseModal = (typeClose) => {
    if (typeClose) {
      this.setState({ [typeClose]: false })
    }
    showBodyScroll();
  }

  onOpenModal = (typeOpen) => {
    if (typeOpen) {
      this.setState({ [typeOpen]: true })
    }
    hideBodyScroll();
  }

  onClickMenuNavbar = () => {
    const { isOpenNavbar } = this.state
    // if (!isOpen) {
    //   this.props.sendEventTracking({ type: LOGO_MENU })
    // }
    if (isOpenNavbar) {
      this.onCloseModal('isOpenNavbar');
    } else {
      this.onOpenModal('isOpenNavbar')
    }
  }

  onOpenSearchLocation = (element) => {
    this.setState({ elementFocused: element })
    this.onOpenModal('isOpenSearchLocation')
    // if (!this.state.recentLocations.length) {
    let recentLocations = localStorage.getItem(`recentLocations_${element}`)
    recentLocations = JSON.parse(recentLocations)
    this.setState({ recentLocations: recentLocations || [] })
    // }
  }

  onCloseSearchLocation = () => {
    this.onCloseModal('isOpenSearchLocation')
  }

  onSearchLocation = (value) => {
    if (!this.mounted) return;
    if (value === undefined) return;
    if (value.replace(/^\s+/g, '').length > 1) {
      this.setState({ searchLocations: search(value) });
    }
  }

  onSwap = () => {
    this.props.sendEventTracking({ type: GA_DESTINATION_SWAP })
    const { payload } = this.state
    this.setState({
      payload: {
        ...payload,
        from: payload.to,
        to: payload.from,
      },
    })
  }

  onLocationChange = (item) => {
    const EVENT = {
      from: GA_FROM,
      to: GA_TO,
    }
    const { elementFocused, payload } = this.state;
    this.props.sendEventTracking({ type: EVENT[elementFocused] })
    this.setState({
      payload: {
        ...payload,
        [elementFocused]: item,
      },

    }, () => {
      const index = this.state.recentLocations.findIndex(x => x.id === item.id)
      const newRecentLocations = this.state.recentLocations;
      if (index >= 0) {
        newRecentLocations.splice(index, 1)
      }
      this.setState(() => ({
        recentLocations: [item, ...newRecentLocations],
      }), () => { localStorage.setItem(`recentLocations_${elementFocused}`, JSON.stringify(this.state.recentLocations)) })
    })
    this.onCloseSearchLocation();
  }

  validate = ({ from, to, date }) => {
    let rs = true;
    if (!from) {
      rs = false;
      this.setState({ elementFocused: 'from' }, () => { this.onOpenModal('isOpenSearchLocation') })
    } else if (!to) {
      rs = false;
      this.setState({ elementFocused: 'to' }, () => { this.onOpenModal('isOpenSearchLocation') })
    } else if (!date) {
      rs = false;
      this.setState({ elementFocused: undefined }, () => { this.onOpenModal('isOpenCalendar') })
    }

    return rs;
  }

  onSearchClick = () => {
    const { payload } = this.state
    if (this.validate(payload)) {
      this.props.sendEventTracking({ type: GA_SEARCH_BUSES_BUTTON })
      this.onSubmitSearchTicket();
    }
  }

  onTodayClick = () => {
    this.props.sendEventTracking({ type: GA_TODAY })
    const { payload } = this.state
    this.setState({
      payload: {
        ...payload,
        date: moment(),
      },
    }, this.onSubmitSearchTicket)
  }

  onTomorrowCick = () => {
    this.props.sendEventTracking({ type: GA_TOMORROW })
    const { payload } = this.state
    this.setState({
      payload: {
        ...payload,
        date: moment().add(1, 'd'),
      },
    }, this.onSubmitSearchTicket)
  }

  onSubmitSearchTicket = () => {
    const { payload } = this.state
    const { locale } = this.props
    if (this.validate(payload)) {
      this.setState({ isLoadingTicket: true })
      const query = payloadToQuery({ ...payload, lang: locale, limousine: true })
      this.props.updatePayload(payload)
      localStorage.setItem('index.payload', JSON.stringify(payload))
      console.log(query)
      // window.location.href = createUrl({ ...query, limousine: true })
      Router.pushRoute('route', query, { shallow: true })
    }
  }

  onOpenCalendar = () => {
    this.onOpenModal('isOpenCalendar')
  }

  changeLanguage = () => {
    const { locale } = this.props;
    const langSwitch = {
      [LANG.VN]: `/${LANG.EN}/limousine-bus`,
      [LANG.EN]: `/${LANG.VN}/xe-limousine`,
    };

    const EVENT = {
      [LANG.VN]: GA_SWITCH_LANGUAGE_EN,
      [LANG.EN]: GA_SWITCH_LANGUAGE_VI,
    }

    this.props.sendEventTracking({ type: EVENT[locale] })

    window.location.href = langSwitch[locale]
  }

  onClickMenu = (item) => {
    if (item.event) {
      this.props.sendEventTracking({ type: item.event })
    }
    if (item.url) {
      window.location.href = item.url
    }
  }

  render() {
    const {
      intl, menu, locale, banners,
    } = this.props
    const {
      payload,
      payload: {
        date,
      },
      searchLocations,
      isOpenNavbar,
      isOpenSearchLocation,
      recentLocations,
      elementFocused,
      isLoadingTicket,
    } = this.state;
    return (
      <>
        <HeaderStyled>
          <Navbar
            data={{ menuLeftItems: menu[locale], title: <img src={logoUrl} alt="" /> }}
            isOpen={isOpenNavbar}
            onClickMenu={this.onClickMenuNavbar}
            onClickItem={this.onClickMenu}
            onClickLanguage={this.changeLanguage}
            isLanguageVN={locale !== LANG.VN}
            onClickTitle={() => { }}
          />

        </HeaderStyled>
        <BodyWrapper>
          <SearchWidgetWrapper>
            {/* {
              get(banners, 'main.Source')
                ? <ImageStyled src={`//${get(banners, 'main.Source')}`} />
                : <ImageStyled src="backgroundUrl" />
            } */}
            <ImageStyled src={backgroundUrl} />
            <SearchWidgetStyled>
              <Slogan>{intl.formatMessage({ id: 'limousine.slogan' })}</Slogan>
              <SearchWidget
                placeholderFrom={intl.formatMessage({ id: 'home.searchWidget.from' })}
                placeholderTo={intl.formatMessage({ id: 'home.searchWidget.to' })}
                from={get(payload, 'from.name', '')}
                to={get(payload, 'to.name', '')}
                onFocusFromInput={this.onOpenSearchLocation.bind(this, 'from')}
                onFocusToInput={this.onOpenSearchLocation.bind(this, 'to')}
                onSwap={this.onSwap}
                date={moment(date).format(intl.formatMessage({ id: 'home.searchWidget.dateFormat' }))}
                todayText={intl.formatMessage({ id: 'home.searchWidget.today' })}
                tomorrowText={intl.formatMessage({ id: 'home.searchWidget.tomorrow' })}
                onTomorrowClick={this.onTomorrowCick}
                onTodayClick={this.onTodayClick}
                onSearchClick={this.onSearchClick}
                searchText={intl.formatMessage({ id: 'limousine.searchText' })}
                isLoading={isLoadingTicket}
                onFocusDateInput={this.onOpenCalendar}
              />
            </SearchWidgetStyled>
          </SearchWidgetWrapper>
          {
            !!get(banners, 'promotions.length') && (
              <RowStyled>
                <Col>
                  <TitleStyled>
                    {intl.formatMessage({ id: 'home.banner.title' })}
                  </TitleStyled>
                  <Carousel
                    autoplay
                  >
                    {
                      get(banners, 'promotions').map((banner, index) => (
                        <a href={banner.Url} key={index}>
                          <ImgPromotionStyled src={`//${banner.Source}`} />
                        </a>
                      ))
                    }
                  </Carousel>
                </Col>
              </RowStyled>
            )
          }
          <RowStyled>
            <Col>
              <TitleStyled>
                <h1>
                  {intl.formatMessage({ id: 'home.introduction.title' })}
                </h1>
              </TitleStyled>
              <Row gutter={16}>
                <Col span={8}>
                  <IntroStyled>
                    <img style={{ width: '26px', height: '40px' }} src={routeSVGUrl} alt="" />
                    <NumberStyled>5.000+</NumberStyled>
                    <ContentStyled>{intl.formatMessage({ id: 'home.introduction.route' })}</ContentStyled>
                  </IntroStyled>
                </Col>
                <Col span={8}>
                  <IntroStyled>
                    <img style={{ width: '35px', height: '40px' }} src={companySVGUrl} alt="" />
                    <NumberStyled>2.000+</NumberStyled>
                    <ContentStyled>{intl.formatMessage({ id: 'home.introduction.company' })}</ContentStyled>
                  </IntroStyled>
                </Col>
                <Col span={8}>
                  <IntroStyled>
                    <img style={{ width: '26px', height: '40px' }} src={agentSVGUrl} alt="" />
                    <NumberStyled>5.000+</NumberStyled>
                    <ContentStyled>{intl.formatMessage({ id: 'home.introduction.agent' })}</ContentStyled>
                  </IntroStyled>
                </Col>

              </Row>
            </Col>
          </RowStyled>
          <RowStyled>
            <Col>
              <TitleStyled>
                {intl.formatMessage({ id: 'home.award.title' })}
              </TitleStyled>
              <ContentStyled>{intl.formatMessage({ id: 'home.award.1' })}</ContentStyled>
              <ContentStyled>{intl.formatMessage({ id: 'home.award.2' })}</ContentStyled>
              <ContentStyled>{intl.formatMessage({ id: 'home.award.3' })}</ContentStyled>
              <ContentStyled>{intl.formatMessage({ id: 'home.award.4' })}</ContentStyled>
              <ContentStyled>{intl.formatMessage({ id: 'home.award.5' })}</ContentStyled>
            </Col>
          </RowStyled>
        </BodyWrapper>

        <SearchLocation
          header={{
            leftComponent: <BackIcon onClick={this.onCloseSearchLocation} />,
            children: <Title title={intl.formatMessage({ id: `home.searchWidget.${elementFocused || 'placeholder'}` })} />,
          }}
          isOpen={isOpenSearchLocation}
          dataSearch={searchLocations}
          dataSearchRecent={recentLocations}
          onChange={this.onSearchLocation}
          placeholder={intl.formatMessage({ id: `home.searchWidget.${elementFocused || 'placeholder'}` })}
          itemClick={this.onLocationChange}
          item={get(this.state, `payload[${elementFocused}]`)}
          debounceTime={200}
          defaultLocations={defaultLocations}
        />
        <CalendarModal
          isOpen={this.state.isOpenCalendar}
          onClickModal={() => this.onCloseModal('isOpenCalendar')}
          date={moment(date)}
          onDateChange={this.onDateChange}
          isDayBlocked={day => moment.isMoment(day) && day.diff(moment(), 'days', false) < 0}
          todayText={intl.formatMessage({ id: 'route.datepicker.today' })}
          lunarText={intl.formatMessage({ id: 'route.datepicker.lunarText' })}
          initialVisibleMonth={() => moment(date)}
          focused
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  menu: state.homeReducer.menu,
  locale: state.device.locale,
  payload: state.homeReducer.payload,
  banners: state.bannerReducer.banners,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    searchTicket,
    updatePayload,
    updateStateRedux,
    sendEventTracking,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Index)
