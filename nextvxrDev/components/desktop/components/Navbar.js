/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

/*
// logo
// max-width
// menu
// [
    {
        href: "",
        title: "",
        component
    }
]
*/
import React, { Component } from 'react';
import styled from 'styled-components'
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

const Container = styled.div`
  display:flex;
  align-items:center;
  min-height:60px;
  .header-body{
    min-width: ${props => props.minWidth}px;
    margin:0 auto;
       .ant-row{
         display:flex;
         align-items:center;
         img{
           &:hover{
            cursor:pointer;
           }
         }
         ul{
          display:flex;
          justify-content:flex-end;
          margin-bottom:0;
          flex-wrap:wrap;
        li{
          list-style-type:none;
          margin-left:40px;
          a{
            color:#707070;
            &:hover{
              text-decoration:underline;
            }
          }
        }
      }
       }
  }
`

class Navbar extends Component {
  onClickItemMenu = (item, e) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.onClickItemMenu(item)
  }

  onClickLogo=() => {
    this.props.onClickLogo();
  }

  onClickLanguage(item) {
    this.props.onClickLanguage(item);
  }

  render() {
    let items = [];
    if (this.props.menu) {
      items = this.props.menu.map((item, index) => {
        if (item.component) {
          return item.component
        }
        if (item.name) {
          return (
            <li key={index}>
              <a onClick={this.onClickLanguage.bind(this, item)}>
                {item.label}
                <img style={{ marginBottom: '2px' }} src={item.img} alt={item.name} />
              </a>
            </li>
          )
        }
        return (
          <li key={index}>
            <a href={item.url} onClick={this.onClickItemMenu.bind(this, item)}>
              {item.label}
            </a>
          </li>
        )
      })
    }
    return (
      <Container className="header-container" minWidth={this.props.minWidth}>
        <div className="header-body">
          <Row>
            <Col md={4}>
              <div className="logo">
                {
                  this.props.logo ? this.props.logo : <img onClick={this.onClickLogo} src="https://storage.googleapis.com/fe-production/icon_vxr_full.svg" alt="logo" />
                }
              </div>
            </Col>
            <Col md={20}>
              <ul>
                {items}
              </ul>
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default Navbar;
