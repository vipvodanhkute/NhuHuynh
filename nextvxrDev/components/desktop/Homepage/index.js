import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { Button } from 'antd'
import { updatePayload } from '#/containers/HomePage/actions';
import { getSEOHome } from '#/containers/SEO/actions'
import { Router } from '#/routes';


const BodyWrapper = styled.div`
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
const routeSVGUrl = 'https://storage.googleapis.com/fe-production/images/Home/icon-kpi-road.svg';
const companySVGUrl = 'https://storage.googleapis.com/fe-production/images/Home/icon-kpi-bus.svg';
const agentSVGUrl = 'https://storage.googleapis.com/fe-production/images/Home/icon-kpi-ticket.svg';
const backgroundUrl = 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg';

class Index extends React.Component {
  componentWillMount() {
    this.mounted = true;
    // this.props.updateStateRedux('infoScreenRoute', { dataLoaded: false, scrollY: 0 })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onClickButton = () => {
    Router.push('/vi-VN/ve-xe-khach-tu-sai-gon-di-da-lat-lam-dong-129t23991.html?date=30-06-2019')
  }

  render() {
    const {
      intl,
    } = this.props
    return (
      <BodyWrapper>
        <SearchWidgetWrapper>
          <ImageStyled src={backgroundUrl} />
          <Button onClick={this.onClickButton}>Qua trang khác</Button>
        </SearchWidgetWrapper>
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
    updatePayload,
    getSEOHome,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Index)
