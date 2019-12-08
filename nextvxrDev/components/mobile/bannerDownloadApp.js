/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { sendEventTracking } from '#/containers/Device/actions';

import {
  GA_CLOSE_BANNER,
} from '#/containers/Device/constants'

const iconBanner = 'https://storage.googleapis.com/fe-production/banner/icon-banner.png'
const iconClose = 'https://storage.googleapis.com/fe-production/banner/icon-close.png'

const Container = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  bottom: 0;
  display: flex;
  padding: 16px 16px 16px 8px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #C0C0C0;
  z-index: 3;
`

const Title = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #484848;
`
const Content = styled.div`
  font-size: 13px;
`
const SubContent = styled.div`
  font-size: 10px;
  margin-top: 8px;
`
const Button = styled.button`
  text-transform: uppercase;
  background: #EEEEEE;
  font-weight: bold;
  color: #007AFF;
  outline: none;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
`

class BannerDownloadApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  componentDidMount() {
    if (typeof sessionStorage !== 'undefined') {
      let validUrl;
      switch (true) {
        case /^((\/vi-VN)|(\/en-US)|\/)$/.test(window.location.pathname):
        case /\/((ve-xe-)|(bus-ticket-booking-))(.*)/.test(window.location.pathname):
          validUrl = true;
          break;
        default:
          validUrl = false;
          break;
      }

      this.setState({
        isOpen: sessionStorage.getItem('bannerMobileApp') !== 'false' && validUrl,
      })
    }
  }

  closeBanner = () => {
    if (typeof sessionStorage !== 'undefined') {
      this.props.sendEventTracking({ type: GA_CLOSE_BANNER })
      sessionStorage.setItem('bannerMobileApp', false)
      this.setState({ isOpen: false })
    }
  }

  render() {
    const { intl: { formatMessage } } = this.props;
    const { isOpen } = this.state;

    if (!isOpen) {
      return null;
    }
    return (
      <Container>
        <img src={iconClose} alt="icon-close" onClick={this.closeBanner} />
        <img src={iconBanner} alt="banner-tai-app" />
        <div>
          <Title>{formatMessage({ id: 'banner.app.title' })}</Title>
          <Content>{formatMessage({ id: 'banner.app.content.1' })}</Content>
          <SubContent>{formatMessage({ id: 'banner.app.content.2' })}</SubContent>
        </div>
        <Button type="button" onClick={() => { window.location.href = 'https://vexere.page.link/mobile' }}>{formatMessage({ id: 'banner.app.button' })}</Button>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    sendEventTracking,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(BannerDownloadApp)
