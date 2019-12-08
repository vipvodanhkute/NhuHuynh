import React from 'react'
import Loading from './loading'

export default ({ children, ...props }) => (
  <Loading {...props} textLoading={props.intl.formatMessage({ id: 'home.loading' })}>{children}</Loading>
)
