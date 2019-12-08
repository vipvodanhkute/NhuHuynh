import React from 'react'
import styled from 'styled-components'
import Image from './imageLoading'


const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
  
`

export default () => (
  <Loading>
    <Image />
  </Loading>
)
