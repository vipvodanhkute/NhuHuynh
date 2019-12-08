import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LANG, BREAK_POINT } from '#/utils/constants';

const LogoImg = 'https://static.vexere.com/production/ams/logo.png';
const ViIcon = 'https://storage.googleapis.com/fe-production/images/vietnam_icon.png';
const EnIcon = 'https://storage.googleapis.com/fe-production/images/english_icon.png';

const LeftHeader = styled.div`
    
`
const RightHeader = styled.div`
    
`

const Logo = styled.a`
    display: inline-block;
    border-right: solid 1px #CCCCCC;
    padding-right: 10px;   
    padding-left: 10px;
    &:last-of-type {
        border-right: none;
    }
    &:first-of-type {
        padding-left: 0;
    }
    @media (min-width: ${BREAK_POINT.SM}px) {  
        max-width: 200px;
        padding-left: 40px;
    }
    img { 
        max-height: 36px;
        max-width: 120px;   
    }   
`


const LanguageIcon = styled.img`
    cursor: pointer;
    padding-top: 5px;
    padding-bottom: 5px;
`

const HeaderStyled = styled.div`
    max-width: ${props => (props.size ? `${props.size}px` : '1366px')};
    margin: auto;
    display: flex;
    height: 70px;
    shadow: 0 3px 6px 0px #000000;
    align-items: center;
    justify-content: space-between;
`;

const HeaderWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    width: 100%;
    background: #FFFFFF;
    padding: 0px 5px;
    @media (min-width: ${BREAK_POINT.SM}px){
      padding: 0 20px;
    }
`


class Header extends PureComponent {
    static defaultProps = {
      languages: [],
      language: null,
      partnerLogo: null,
      onChangeLanguage: null,
    };

    static propTypes = {
      partnerLogo: PropTypes.string,
      languages: PropTypes.arrayOf(PropTypes.oneOf([LANG.VN, LANG.EN])),
      language: PropTypes.string,
      onChangeLanguage: PropTypes.func,
    };

    render() {
      const {
        partnerLogo, languages, language, onChangeLanguage, size,
      } = this.props;
      return (
        <HeaderWrapper size={size}>
          <HeaderStyled size={size}>
            <LeftHeader>
              <Logo href="/">
                <img src={LogoImg} alt="Vexere" />
              </Logo>
              {partnerLogo && (
              <Logo href="javascript:void(0);">
                <img src={partnerLogo} alt="Partner" />
              </Logo>
              )}
            </LeftHeader>
            <RightHeader>
              {languages.length > 1 && <LanguageIcon onClick={onChangeLanguage} src={language === LANG.VN ? EnIcon : ViIcon} />}
            </RightHeader>
          </HeaderStyled>
        </HeaderWrapper>
      );
    }
}

export default Header;
