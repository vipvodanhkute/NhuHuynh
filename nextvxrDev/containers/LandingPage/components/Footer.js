import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import styled from 'styled-components';

const Icon = styled.a`
  background: url(${props => props.background});
  display: block;
    width: 34px;
    height: 34px;
    float: left;
    margin-right: 15px;
    font-size: 0;
    text-indent: -9999px;
`


const DownloadLogoWrapper = styled.a`
  display: inline-block;
  padding: 3px;
`
const DownloadLogo = styled.img`
    max-width: 150px;
`


const FooterTitle = styled.div`
    color: #1867aa !important;
    font-size: 22px !important;
    margin: 0;
    border-bottom: none;
    font-weight: 700!important;    margin-bottom: 10px!important;
    margin-top: 20px!important;
`

const FooterList = styled.div`
    list-style-type: none;
`

const FooterItem = styled.a`
    display: block;
    margin: 4px 0;
`

const FooterLogo = styled.img`
    width: 55px;
    height: 55px;
`

const FooterLogoWrapper = styled.div`
    display: inline-block;
    margin-bottom: 0.5em;
`

const Divider = styled.div`
    width: 100%;
    margin-top: 30px;
    border-top: 1px solid #f0f0f0;
    padding-top: 20px;
`

const LogoCol = styled(Col)`
  text-align: center;
`

class Footer extends PureComponent {
    static defaultProps = {
    };

    static propTypes = {
      lang: PropTypes.oneOf(['vi-VN', 'en-US']).isRequired,
    };

    render() {
      const { intl, lang } = this.props;
      return (
            <>
              <Row className="Footer__top">
                <Col span={6}>
                  <FooterTitle>
                    {intl.formatMessage({ id: 'footer.about.title' })}
                  </FooterTitle>
                  <FooterList>
                    <li>
                      <FooterItem href="/vi-vn/tuyen-dung">
                        {intl.formatMessage({ id: 'footer.about.allJobs' })}
                      </FooterItem>
                    </li>
                    <li><FooterItem href="/vi-VN/tin-tuc">{intl.formatMessage({ id: 'footer.about.news' })}</FooterItem></li>
                    <li><FooterItem rel="nofollow" href={`/${lang}/gioi-thieu.html`}>{intl.formatMessage({ id: 'footer.about.introduction' })}</FooterItem></li>
                    <li><FooterItem rel="nofollow" href={`/${lang}/lien-he.html`}>{intl.formatMessage({ id: 'footer.about.contact' })}</FooterItem></li>
                    <li>
                      <FooterItem href="https://vexere.com/vi-VN/ve-xe-gia-re-ho-tro-tan-sinh-vien-nhap-hoc">
                        <img
                          alt="Vexere - Chắp cánh ước "
                          src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=206"
                        />
                                    Chắp Cánh Ước Mơ
                      </FooterItem>
                    </li>
                  </FooterList>
                </Col>
                <Col span={6}>
                  <FooterTitle>
                    {intl.formatMessage({ id: 'footer.support.title' })}
                  </FooterTitle>
                  <FooterList>
                    <li>
                      <FooterItem rel="nofollow" href={`/${lang}/huong-dan-thanh-toan-tren-website.html`}>
                        {intl.formatMessage({ id: 'footer.support.guide' })}
                      </FooterItem>
                    </li>
                    <li>
                      <FooterItem rel="nofollow" href={`/${lang}/quy-che.html`}>
                        {' '}
                        {intl.formatMessage({ id: 'footer.support.term&Conditions' })}
                      </FooterItem>
                    </li>
                    <li>
                      <FooterItem rel="nofollow" href={`/${lang}/nhung-cau-hoi-thuong-gap.html`}>
                        {intl.formatMessage({ id: 'footer.support.FAQs' })}
                      </FooterItem>
                    </li>
                    <li>
                      <FooterItem href="/">
                        {' '}
                        {intl.formatMessage({ id: 'footer.support.booking' })}
                      </FooterItem>
                    </li>
                  </FooterList>
                </Col>
                <Col span={6}>
                  <FooterTitle>
                    {intl.formatMessage({ id: 'footer.follow.title' })}
                  </FooterTitle>
                  <span>
                    <link itemProp="url" rel="nofollow" href="https://vexere.com/en-US" />
                    <Icon
                      background="https://storage.googleapis.com/fe-production/images/icon-facebook.svg"
                      itemProp="sameAs"
                      rel="nofollow noopener noreferrer"
                      title="Facebook"
                      href="https://www.facebook.com/Vexere"
                      target="_blank"
                    >
                      Facebook
                    </Icon>
                    <Icon
                      background="https://storage.googleapis.com/fe-production/images/icon-youtube.svg"
                      itemProp="sameAs"
                      rel="nofollow noopener noreferrer"
                      title="Youtube"
                      href="http://www.youtube.com/channel/UCyUfbHAH0X_CXF4n2Zg2WSA"
                      target="_blank"
                    >
                      Youtube
                    </Icon>
                    <Icon
                      background="https://storage.googleapis.com/fe-production/images/icon-google-plus.svg"
                      itemProp="sameAs"
                      rel="nofollow noopener noreferrer"
                      title="Google+"
                      href="https://plus.google.com/+VexereVN"
                      target="_blank"
                    >
                     Google+
                    </Icon>
                  </span>
                  <br />
                  <FooterTitle>
                    {intl.formatMessage({ id: 'footer.partners.title' })}
                  </FooterTitle>
                  <span>
                    <DownloadLogoWrapper
                      target="_blank"
                      href="http://csip.vn/"
                      rel="nofollow"
                    >
                      <img
                        alt="Vexere - Download on App Store"
                        src="https://storage.googleapis.com/fe-production/images/logo-csip.png?v=2"
                      />
                    </DownloadLogoWrapper>
                    <DownloadLogoWrapper
                      target="_blank"
                      href="http://bssc.vn/"
                      rel="nofollow"
                    >
                      <img
                        alt="Vexere - Download on Google Play"
                        src="https://storage.googleapis.com/fe-production/images/logo-bssc.png?v=2"
                      />
                    </DownloadLogoWrapper>
                    <br />
                    <DownloadLogoWrapper
                      target="_blank"
                      href="http://shtpic.org/"
                      rel="nofollow"
                    >
                      <img
                        alt=""
                        src="https://storage.googleapis.com/fe-production/images/logo-shtp-ic.png?v=2"
                      />
                    </DownloadLogoWrapper>
                    <DownloadLogoWrapper
                      target="_blank"
                      href="https://www.payoo.vn"
                      rel="nofollow"
                    >
                      <img
                        alt=""
                        src="https://storage.googleapis.com/fe-production/images/logo-payoo.png?v=1"
                      />
                    </DownloadLogoWrapper>
                  </span>
                </Col>
                <Col span={6}>
                  <FooterTitle>
                    {intl.formatMessage({ id: 'footer.download.title' })}
                  </FooterTitle>
                  <span>
                    <DownloadLogoWrapper
                      target="_blank"
                      href="https://itunes.apple.com/vn/app/vexere/id1183279479 "
                      rel="nofollow"
                    >
                      <DownloadLogo
                        src="https://storage.googleapis.com/fe-production/images/landingpagetet2018/AP-icon.png?v=2"
                      />
                    </DownloadLogoWrapper>
                    <br />
                    <DownloadLogoWrapper
                      target="_blank"
                      href="https://play.google.com/store/apps/details?id=com.vexere.vexere"
                      rel="nofollow"
                    >
                      <DownloadLogo
                        src="https://storage.googleapis.com/fe-production/images/landingpagetet2018/GP-icon.png?v=2"
                      />
                    </DownloadLogoWrapper>
                  </span>
                </Col>
              </Row>
              <Divider />
              <Row type="flex" className="Footer__bottom">
                <LogoCol xs={6} sm={4} md={2} lg={2}>
                  <FooterLogoWrapper>
                    <a
                      itemProp="url"
                      href="/"
                      title="Cổng thông tin vé xe khách lớn nhất Việt Nam"
                    >
                      <FooterLogo
                        itemProp="logo"
                        src="https://storage.googleapis.com/fe-production/images/Home/icon-vxr.svg"
                        alt=""
                      />
                    </a>
                  </FooterLogoWrapper>
                </LogoCol>
                <Col xs={18} sm={20} md={14} lg={16}>
                  <div>
                    {intl.formatMessage({ id: 'footer.copyright' })}
                    <span itemProp="name">VeXeRe.Com</span>
                  </div>
                  <div>
                    {intl.formatMessage({ id: 'footer.company' })}
                    <br />
                    {intl.formatMessage({ id: 'footer.registeredAddress' })}
                  </div>
                  <p>
                    {intl.formatMessage({ id: 'footer.contactAddress.name' })}
                      :&nbsp;
                    <a
                      href="https://goo.gl/maps/ED2ndGo1Sn52"
                      rel="nofollow noopener noreferrer"
                      title="Xem bản đồ"
                      target="_blank"
                    >
                      <span
                        itemProp="address"
                        itemScope=""
                        itemType="http://schema.org/PostalAddress"
                      >
                        <span
                          itemProp="streetAddress"
                        >
                          {intl.formatMessage({ id: 'footer.contactAddress.value' })}
                        </span>
                      </span>
                    </a>
                    <br />
                    {intl.formatMessage({ id: 'footer.businessRegistration' })}
                  </p>
                </Col>
                <LogoCol xs={12} sm={12} md={4} lg={3}>
                  <FooterLogoWrapper>
                    <img alt="Vexere - Certificate" src="https://storage.googleapis.com/fe-production/images/Home/certificate0.png" />
                  </FooterLogoWrapper>
                  <FooterLogoWrapper>
                    <a href="http://online.gov.vn/HomePage/WebsiteDisplay.aspx?DocId=773">
                      <img
                        alt="Vexere - Certificate"
                        src="https://storage.googleapis.com/fe-production/images/Home/certificate2.png"
                      />
                    </a>
                  </FooterLogoWrapper>
                </LogoCol>
                <LogoCol xs={12} sm={12} md={4} lg={3}>
                  <FooterLogoWrapper>
                    <img alt="Vexere - Certificate" src="https://storage.googleapis.com/fe-production/images/Home/certificate1.png" />
                  </FooterLogoWrapper>
                  <FooterLogoWrapper>
                    <a href="http://online.gov.vn/HomePage/WebsiteDisplay.aspx?DocId=773">
                      <img
                        alt="Vexere - Certificate"
                        src="https://storage.googleapis.com/fe-production/images/Home/certificate3.png"
                      />
                    </a>
                  </FooterLogoWrapper>
                </LogoCol>
              </Row>
            </>
      );
    }
}

export default Footer;
