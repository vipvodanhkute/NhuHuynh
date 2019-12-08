import React from 'react'

class Route extends React.Component {
  constructor(props) {
    super(props)
    this.mount = true;
  }

  render() {
    return (
      <div>
        <p> Đây là trang cho desktop </p>
      </div>
    );
  }
}

export default Route
