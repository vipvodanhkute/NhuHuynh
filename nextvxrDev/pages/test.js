import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

export default () => (
    <>
      <p>
        <FormattedMessage id="greeting" defaultMessage="Hello, World!" />
      </p>
      <p>
        <FormattedNumber value={1000} />
      </p>
    </>
)
