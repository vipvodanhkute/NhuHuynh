import React from 'react'
import styled from 'styled-components'
import Image from '#/components/base/loading/imageLoading'

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const LoadingStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background: white;
  top: 0;
  left: 0;
  z-index: 1001;
`
const LoadingWrapper = styled.div`
  visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: fixed;
  background: white;
  z-index: 1001;
  top: 0;
  left: 0;
`
// const DotContainer = styled.div`
//   z-index: 1002;
//   padding: 16px;
//   background: white;
// `

const LoadingBody = styled.div`
  border-radius: 10px;
  background: white;
  z-index: 1002;
  display: flex;
  width: 80%;
  justify-content: center;
`

// const DotContainer = styled.div`
//   width:80px;
//   height:30px;
//   ${''}
//   position: relative;
//   background:#fff;
//   ${''}
//   border-radius: 10px;
//   margin: 8px;
//   align-self: center;
// `

// const oscl = keyframes`
//   0%{left:20%;}
//   50%{left:50%;}
//   100%{left:20%;}
// `

// const oscr = keyframes`
//   0%{left:80%;}
//   50%{left:50%;}
//   100%{left:80%;}
// `

// const Blob1 = styled.div`
//   width:20px;
//   height:20px;
//   position:absolute;
//   background:#FF9F00;
//   border-radius:50%;
//   top:50%;left:50%;
//   transform:translate(-50%,-50%);
//   left:20%;
//   animation: ${oscl} 2.5s ease infinite;
// `

// const Blob2 = styled.div`
//   width:20px;
//   height:20px;
//   position:absolute;
//   background:#5090E9 ;
//   border-radius:50%;
//   top:50%;left:50%;
//   transform:translate(-50%,-50%);
//   left:80%;
//   animation: ${oscr} 2.5s ease infinite;
// `


export default ({ children }) => (
  <LoadingContainer id="loadingContainer">
    <LoadingWrapper id="loadingWrapper">
      <LoadingStyled />
      <LoadingBody>
        <Image />
      </LoadingBody>
    </LoadingWrapper>
    {children}
  </LoadingContainer>
)
