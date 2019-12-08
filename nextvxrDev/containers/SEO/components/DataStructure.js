import React from 'react'

class DataStructure extends React.PureComponent {
  render() {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.data) }}
      />
    )
  }
}

export default DataStructure
