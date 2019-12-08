import React from 'react'
import styled from 'styled-components'

const TitleStyled = styled.div`
  color: #484848;
  font-weight: bold;
  font-size: 19px;
  padding: 0 16px;
`
const DescriptionStyled = styled.div`
  color: #484848;
  font-size: 14px;
  margin: 16px 0px 24px 0px;
  padding: 0 16px;
`


export default ({ title, description, children }) => (
  <>
    <TitleStyled>{title}</TitleStyled>
    <DescriptionStyled>
      {description}
    </DescriptionStyled>
    {children}
  </>
)
