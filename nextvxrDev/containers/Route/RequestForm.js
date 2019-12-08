import React from 'react'
import styled from 'styled-components'
import Input from 'vxrd/components/Antd/Input'
import Form from 'vxrd/components/Antd/Form'
import Button from 'vxrd/components/Antd/Button'
import { injectIntl } from 'react-intl'

const ButtonContainer = styled.div`
    margin-top: 16px;
    text-align: center;
`

const FormItemStyled = styled(Form.Item)`
  margin-bottom: 8px;
`
function hasErrors(fieldsError, isFieldTouched) {
  return (!['name', 'phone'].every(item => isFieldTouched(item)) || Object.keys(fieldsError).some(field => fieldsError[field]))
}

class RequestForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      isFieldTouched,
      // getFieldError,
      // isFieldTouched
    } = this.props.form
    const { formatMessage } = this.props.intl
    const { loading } = this.props
    return (
      <div>
        <FormItemStyled>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'route.modalSendRequest.required' }),
                validationTrigger: 'onBlur',
              },
              {
                pattern: /^[a-zA-Z ]{3,50}$/,
                message: formatMessage({ id: 'route.modalSendRequest.wrongFormat' },
                  { field: formatMessage({ id: 'route.modalSendRequest.field.busName' }) }),
                validationTrigger: 'onBlur',
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Input
              placeholder={formatMessage({ id: 'route.modalSendRequest.busName' })}
            />,
          )}
        </FormItemStyled>
        <FormItemStyled>
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'route.modalSendRequest.required' }),
                validationTrigger: 'onBlur',
              },
              {
                pattern: /^[0-9]{10,14}$/,
                message: formatMessage({ id: 'route.modalSendRequest.wrongFormat' },
                  { field: formatMessage({ id: 'route.modalSendRequest.phoneNumber' }) }),
                validationTrigger: 'onBlur',
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Input
              placeholder={formatMessage({ id: 'route.modalSendRequest.phoneNumber' })}
            />,
          )}
        </FormItemStyled>
        <FormItemStyled>
          {getFieldDecorator('owner')(
            <Input
              placeholder={formatMessage({ id: 'route.modalSendRequest.contactName' })}
            />,
          )}
        </FormItemStyled>
        <ButtonContainer>
          <Button
            loading={loading}
            onClick={this.onSubmit}
            type="primary"
            disabled={hasErrors(getFieldsError(), isFieldTouched)}
          >
            {formatMessage({ id: 'route.modalSendRequest.send' })}
          </Button>
        </ButtonContainer>

      </div>
    )
  }
}
const WrappedForm = Form.create()(RequestForm)
export default injectIntl(WrappedForm)
