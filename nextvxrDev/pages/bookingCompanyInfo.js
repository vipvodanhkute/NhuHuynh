import React from 'react'
import dynamicImport from '#/utils/dynamicImport';

export default (props) => {
  const Component = dynamicImport('bookingCompanyInfo', { userAgent: props.ua })
  return <Component {...props} />
}
