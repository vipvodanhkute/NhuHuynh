import React from 'react'
import Modal from 'vxrd/components/Base/Modal'
import RequestForm from './RequestForm'

class ModalSendRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const { intl } = this.props
    return (
      <Modal
        {...this.props}
        title={intl.formatMessage({ id: 'route.modalSendRequest.title' })}
        footer={null}
      >
        <RequestForm
          onSubmit={this.props.onSubmit}
          loading={this.props.isLoading}
        />
      </Modal>
    )
  }
}
export default ModalSendRequest;
