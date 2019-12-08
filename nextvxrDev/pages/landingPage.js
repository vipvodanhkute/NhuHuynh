import React, { PureComponent } from 'react';
import styled from 'styled-components';
import SearchWidget from '#/components/desktop/components/SearchWidget'
import Header from '#/containers/LandingPage/components/Header'
import Footer from '#/containers/LandingPage/components/Footer'
import queryString from 'query-string';
import { getLandingPageBySlug } from '#/utils/api/landingPage';
import { BREAK_POINT, LANG } from '#/utils/constants';
import { createUrl } from '#/utils/pathUtils'
import { getSEOLandingPage } from '#/containers/SEO/actions';

const SEARCH_TICKET_SIZE = 1100;

const WrapperLandingPage = styled.div`
    max-width: ${SEARCH_TICKET_SIZE}px;
    margin: auto;
    h2 {
      margin-top: 0.8em;
      margin-bottom: 0;
    }
    
    h3 {
      margin-top: 0.5em;
      margin-bottom: 0;
    }
    
    p {
      margin-top: 0.35em;
      margin-bottom: 0;
    }
`

const WrapperContent = styled(WrapperLandingPage)`
    padding: 0 10px;
    @media (min-width: ${BREAK_POINT.SM}px){
      padding: 0 20px;
    }
    @media (min-width: ${SEARCH_TICKET_SIZE}px) {
      padding: 0;
    }
`


const BannerWrapper = styled.div`
    transition: 200ms;
    width: 100%;
    height: ${props => props.height};
    position: relative;
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

const Title = styled.div`
    margin-top: 15px;
    padding: 20px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.64);
    border-radius: 5px;
    p {
      margin-bottom: 0.2em;
    }
    @media (max-width: ${BREAK_POINT.SM}px) {
      * {
        font-size: 20px !important;
      }
    }
`

const PartnerLogo = styled.img`
  max-width: 150px;
  min-width: 100px;
  width: 25%;
`

const TitleWrapper = styled(WrapperLandingPage)`
    top: 35%;
    transform: translateY(-50%);
    left: 5px;
    right: 5px;
    position: absolute;
    @media (min-width: ${BREAK_POINT.SM}px){
      left: 20px;
      right: 20px;
    }
`


const SearchWrapper = styled.div`
    position: absolute;
    left: 50%;
    bottom: 5px;
    width: 100%;
    transform: translateX(-50%);
    padding: 0px 5px;
    @media (min-width: ${BREAK_POINT.SM}px){
      bottom: 65px;
      padding: 0 20px;
    }
    @media (min-width: ${SEARCH_TICKET_SIZE}px) {
      bottom: 65px;
    }
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

class LandingPage extends PureComponent {
  static defaultProps = {};

  static propTypes = {};

  static async getInitialProps({ ctx }) {
    const {
      query: {
        slug,
        lang,
      },
      query,
      res,
      store,
    } = ctx;
    store.dispatch(getSEOLandingPage({ lang, slug }));
    try {
      const response = await getLandingPageBySlug(slug);
      const { data } = response;
      const [detail, ...contents] = data;
      if (!detail.is_active) {
        return res.redirect('/')
      }
      const langMap = {
        vi: LANG.VN,
        en: LANG.EN,
      }
      const content = contents.find(c => langMap[c.language] === lang);
      if (!content) {
        return res.redirect('/')
      }
      return {
        detail,
        content,
        query,
        languages: contents.map(c => langMap[c.language]).filter(Boolean),
      }
    } catch (e) {
      return res.redirect('/')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      height: '100vh',
    }
  }

  componentDidMount() {
    this.setState({
      height: `${window.innerHeight}px`,
    });
  }


  onChangeLanguage = () => {
    const { locale } = this.props;
    const langSwitch = {
      [LANG.VN]: LANG.EN,
      [LANG.EN]: LANG.VN,
    };
    window.location.href = window.location.href.replace(locale, langSwitch[locale]);
  }

  onSubmitSearchWidget = (query) => {
    if (query) {
      const { detail } = this.props
      let url = createUrl(query)
      const params = { aid: detail.affiliate_id }
      if (params) {
        url += `&${queryString.stringify(params)}`
      }
      window.location.href = url;
    }
  }

  render() {
    const {
      isServer,
      intl,
      locale,
      content,
      detail,
      languages,
    } = this.props;
    const { height } = this.state;
    return (
      <>
        <BannerWrapper height={height}>
          <Header
            size={SEARCH_TICKET_SIZE}
            partnerLogo={detail.logo_img_url}
            languages={languages}
            language={locale}
            onChangeLanguage={this.onChangeLanguage}
          />
          <Banner src={content.image_url} />
          <TitleWrapper>
            <PartnerLogo src={detail.logo_img_url} alt="" />
            <Title>
              <div dangerouslySetInnerHTML={{ __html: content.title }} />
            </Title>
          </TitleWrapper>
          <SearchWrapper>
            <SearchWidget
              isServer={isServer}
              size={SEARCH_TICKET_SIZE}
              intl={this.props.intl}
              onSubmit={this.onSubmitSearchWidget}
            />
          </SearchWrapper>
        </BannerWrapper>
        <WrapperContent>
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </WrapperContent>
        <FooterContainer>
          <FooterWrapper>
            <Footer lang={locale} intl={intl} />
          </FooterWrapper>
        </FooterContainer>
      </>
    );
  }
}

export default LandingPage;
