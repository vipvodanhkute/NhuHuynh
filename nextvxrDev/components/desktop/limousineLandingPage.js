import React, { PureComponent } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import moment from 'moment'
import { Breadcrumb } from 'antd';
import SearchWidget2 from '#/components/desktop/components/SearchWidget2'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Footer from '#/containers/LandingPage/components/Footer'
import { BREAK_POINT, LANG } from '#/utils/constants';
import { createUrl } from '#/utils/pathUtils'
import {
  GA_SWITCH_LANGUAGE_EN,
  GA_SWITCH_LANGUAGE_VI,
} from '#/containers/HomePage/constants'
import Navbar from '#/components/desktop/components/Navbar'
import { sendEventTracking } from '#/containers/Device/actions';

const CONTENT_LIMOUSINE = {
  'vi-VN': dynamic(import(/* webpackChunkName: 'pc-limousineContentVI' */ '#/components/desktop/limousineContentVI'), { loading: () => null }),
  'en-US': dynamic(import(/* webpackChunkName: 'pc-limousineContentEN' */ '#/components/desktop/limousineContentEN'), { loading: () => null }),
}

const SEARCH_TICKET_SIZE = 1189;

const WrapperLandingPage = styled.div`
    max-width: ${SEARCH_TICKET_SIZE}px;
    margin: auto;
`


const BannerWrapper = styled.div`
    transition: 200ms;
    width: 100%;
    height: 450px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
`

const Banner = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`

const SearchWrapper = styled.div`
    width: 100%;
    .ant-select-dropdown-menu-item-group-title{
      color: #222;
      font-weight: bold;
      font-size: 14px;
    }
`

const FooterWrapper = styled(WrapperLandingPage)`
    padding: 0 5px;
    .Footer__top {
      display: none;
      @media (min-width: ${BREAK_POINT.LG}px) {
        display: block;
      }
    }
    
    @media (min-width: ${BREAK_POINT.SM}px) {
      padding: 0 20px;
    }
    @media (min-width: ${SEARCH_TICKET_SIZE}px) {
      padding: 0;
    }
`

const FooterContainer = styled.div`
  background: #f5f5f5;
`

const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 22px;
  color: white;
  text-align: center;

`

const BodyBanner = styled.div`
  position: relative;
  width: ${props => props.minWidth}px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`


const ContentWrapper = styled.div`
  width: 100%;
`

const BodyWrapper = styled.div`
  width: ${props => props.minWidth}px;
  margin: auto;
  padding-top: 32px;
`

const BreadcrumbStyled = styled(Breadcrumb)`
  position: absolute;
  top: 32px;
  left: 0px;
  .ant-breadcrumb-link, .ant-breadcrumb-separator{
    color: white;
  }
`

const bgImgUrl = 'https://storage.googleapis.com/fe-production/bg_limousine_pc.jpg'

class LimousineLandingPage extends PureComponent {
  onChangeLanguage = () => {
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

  onSubmitSearchWidget = (query) => {
    if (query) {
      const url = createUrl({ ...query, limousine: true })
      window.location.href = url;
    }
  }

  onClickMenu = (item) => {
    if (item.url) {
      window.location.href = item.url
    }
  }

  onClickLogo = () => {
    const { locale } = this.props;
    if (locale === 'vi-VN') {
      window.location.href = '/'
    }
    if (locale === 'en-US') {
      window.location.href = '/en-US'
    }
  }

  render() {
    const {
      isServer,
      intl,
      locale,
      menu,
    } = this.props;
    const Content = CONTENT_LIMOUSINE[locale]
    return (
      <>
        <Navbar
          minWidth={SEARCH_TICKET_SIZE}
          menu={menu[locale]}
          onClickItemMenu={this.onClickMenu}
          onClickLogo={this.onClickLogo}
          onClickLanguage={this.onChangeLanguage}
        />
        <BannerWrapper>
          <Banner src={bgImgUrl} alt={intl.formatMessage({ id: 'limousine.banner.alt' })} />
          <BodyBanner minWidth={SEARCH_TICKET_SIZE}>
            <BreadcrumbStyled separator=">">
              <Breadcrumb.Item href={intl.formatMessage({ id: 'breadcrumb.home' })}>{intl.formatMessage({ id: 'route.datastructure.busTicket' })}</Breadcrumb.Item>
              <Breadcrumb.Item href={intl.formatMessage({ id: 'breadcrumb.limousine' })}>{intl.formatMessage({ id: 'limousine.breadcrumb' })}</Breadcrumb.Item>
            </BreadcrumbStyled>
            <ContentWrapper>
              <Title>{intl.formatMessage({ id: 'limousine.slogan.pc' })}</Title>
              <SearchWrapper>
                <SearchWidget2
                  isServer={isServer}
                  intl={this.props.intl}
                  onSubmit={this.onSubmitSearchWidget}
                  searchText={intl.formatMessage({ id: 'limousine.searchText' })}
                  isDayBlocked={day => moment.isMoment(day) && day.diff(moment(), 'days', false) < 0}
                  todayText={intl.formatMessage({ id: 'route.datepicker.today' })}
                  lunarText={intl.formatMessage({ id: 'route.datepicker.lunarText' })}
                  placeholderFrom={intl.formatMessage({ id: 'landing.searchTicket.from' })}
                  placeholderTo={intl.formatMessage({ id: 'landing.searchTicket.to' })}
                  placeholderDate={intl.formatMessage({ id: 'landing.searchTicket.date' })}
                />
              </SearchWrapper>
            </ContentWrapper>
          </BodyBanner>
        </BannerWrapper>
        <BodyWrapper minWidth={SEARCH_TICKET_SIZE}>
          <Content />
        </BodyWrapper>
        <FooterContainer>
          <FooterWrapper>
            <Footer lang={locale} intl={intl} />
          </FooterWrapper>
        </FooterContainer>
      </>
    );
  }
}
const mapStateToProps = state => ({
  menu: state.homeReducer.menuLimousine,
  locale: state.device.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    sendEventTracking,
  },
  dispatch,
);
export default connect(mapStateToProps, mapDispatchToProps)(LimousineLandingPage)
