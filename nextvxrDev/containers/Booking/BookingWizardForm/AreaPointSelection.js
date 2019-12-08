import React, { Component } from 'react';
import AreaPointSelection from 'vxrd/components/AreaPointSelection';

class AreaPointSelectionComponent extends Component {
  updateAreaPoint = (areaPoint) => {
    const {
      selectionProps: { key },
      getValue,
    } = this.props;

    getValue({
      [key]: areaPoint,
      key,
    });
  };

  render() {
    const {
      selectionProps,
    } = this.props;

    return (
      <>
        <AreaPointSelection
          {...selectionProps}
          getValue={this.updateAreaPoint}
        />
      </>
    );
  }
}

export default AreaPointSelectionComponent;
