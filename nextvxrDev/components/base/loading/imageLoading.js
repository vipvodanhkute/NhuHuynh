import React from 'react'
import styled, { keyframes } from 'styled-components'

const loadingKeyframes = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`


const Image = styled.img`
  animation: ${loadingKeyframes} 1s ease-in-out 0s infinite;
  width: 30vw;
`
const url = 'https://storage.googleapis.com/fe-production/icon_horizontal.svg'

export default () => (
  <Image src={url} alt="loading" />
)
