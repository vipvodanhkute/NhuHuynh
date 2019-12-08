import React from 'react'
import dynamic from 'next/dynamic';

const MobileBanner = dynamic(import(/* webpackChunkName: 'mb-banner' */ '#/components/mobile/bannerDownloadApp'), { loading: () => null })

export default (props) => {
  if (props.ua.isMobile) {
    return <MobileBanner {...props} />
  }
  return null;
}
