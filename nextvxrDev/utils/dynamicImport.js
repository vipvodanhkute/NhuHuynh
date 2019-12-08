import React from 'react'
import dynamic from 'next/dynamic';
import Loading from '#/components/base/loading'

const MobileComponent = {
  limousineLandingPage: dynamic(import(/* webpackChunkName: 'mb-limousine' */ '#/components/mobile/limousineLandingPage'), { loading: () => <Loading /> }),
  bookingCompanyInfo: dynamic(import(/* webpackChunkName: 'mb-bookingComInfo' */'#/components/mobile/bookingCompanyInfo'), { loading: () => <Loading /> }),
  homepage: dynamic(import(/* webpackChunkName: 'mb-homepage' */ '#/components/mobile'), { loading: () => <Loading /> }),
  route: dynamic(import(/* webpackChunkName: 'mb-route' */'#/components/mobile/route'), { loading: () => <Loading /> }),
}

const DesktopComponent = {
  limousineLandingPage: dynamic(import(/* webpackChunkName: 'pc-limousine' */ '#/components/desktop/limousineLandingPage'), { loading: () => <Loading /> }),
  bookingCompanyInfo: dynamic(import(/* webpackChunkName: 'pc-bookingComInfo' */'#/components/base/404Page'), { loading: () => <Loading /> }),
  homepage: dynamic(import(/* webpackChunkName: 'pc-homepage' */ '#/components/desktop/Homepage'), { loading: () => <Loading /> }),
  route: dynamic(import(/* webpackChunkName: 'pc-route' */'#/components/desktop/route'), { loading: () => <Loading /> })
}

export default (name, { userAgent }) => {
  if (userAgent.isMobile) {
    return MobileComponent[name]
  }
  return DesktopComponent[name]
}
