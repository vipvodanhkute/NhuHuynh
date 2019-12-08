import ModalStyled from '#/components/base/ccum/modal';
import styled from 'styled-components'
import React from 'react'
import {
  Form, Row, Col, Input, Button, Icon, Checkbox, Upload,
} from 'antd'

const { TextArea } = Input;
const FormItem = Form.Item;

const ModalRegister = styled(ModalStyled)`
    color:white;
    .ant-modal-content{
        width: 90%,
        margin: 0 auto;
        top: -80px;
    }
    b{
        color:white;
    }
`
const MyCol = styled(Col)`
    margin-bottom:15px;
    font-style: italic;
    div{
        color: white;
    }
    .note{
        color:yellow;
    }
`

const MyButton = styled(Button)`
    display: -webkit-box;   
    margin-top:10px;
    font-weight: bold;
    height: 45px;
    color: #1A77B9;
    background-color:#FFF100;
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
`

class ModalStyledRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: null,
    }
  }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }

    handleChange = (info) => {
      console.log(this.state)
      let fileList = info.fileList;

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice();

      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });

      // 3. filter successfully uploaded files according to response from server
      fileList = fileList.filter((file) => {
        if (file.response) {
          return file.response.status === 'success';
        }
        return true;
      });

      this.setState({ fileList });
    }

    render() {
      const { isSubmitDataRegister, form: { getFieldDecorator }, ...modalProps } = this.props;
      const uploadFileAction = {
        action: '//jsonplaceholder.typicode.com/posts/',
        onChange: this.handleChange,
        multiple: true,
      };
      return (
        <ModalRegister {...modalProps}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <MyCol span={12}>
                <Row>
                  <MyCol>
                    <Form.Item>
                      {getFieldDecorator('hovaten', {
                        rules: [{ required: true, message: 'Vui lòng nhập họ và tên!' }],
                      })(
                        <Input placeholder="Họ và tên" />,
                      )}
                    </Form.Item>
                  </MyCol>
                </Row>
                <Row>
                  <MyCol>
                    <Form.Item>
                      {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Vui lòng nhập email!' }],
                      })(
                        <Input placeholder="Email" type="email" />,
                      )}
                    </Form.Item>
                  </MyCol>
                </Row>
                <Row>
                  <MyCol>
                    <Form.Item>
                      {getFieldDecorator('sdt', {
                        rules: [{ required: true, mesage: 'Vui lòng nhập số điện thoại!' }],
                      })(
                        <Input placeholder="Số điện thoại" type="text" />,
                      )}
                    </Form.Item>
                  </MyCol>
                </Row>
                <Row>
                  <MyCol>
                    <Form.Item>
                      {getFieldDecorator('cmnd', {
                        rules: [{ required: true, message: 'Vui lòng nhập CMND!' }],
                      })(
                        <Input placeholder="Số CMND" type="text" />,
                      )}
                    </Form.Item>
                  </MyCol>
                </Row>
                <Row>
                  <MyCol>
                    <Form.Item>
                      {getFieldDecorator('truonghoc', {
                        rules: [{ required: true, message: 'Vui lòng nhập tên trường học!' }],
                      })(
                        <Input placeholder="Trường học" type="text" />,
                      )}
                    </Form.Item>
                  </MyCol>
                </Row>
              </MyCol>
              <MyCol span={12}>
                <Row>
                  {' '}
                  <MyCol><Input type="text" value="Hà Nội - Lào Cai" /></MyCol>
                </Row>
                <Row><MyCol><Input type="text" value="Sao Việt" /></MyCol></Row>
                <div>1/ Tải ảnh CMND bao gồm 2 mặt (bắt buộc)</div>
                <div>2/ Tải giấy báo nhập học hoặc thẻ sinh viên</div>
                <div>3/ Tải Giấy xác nhận gia đình khó khăn, gia đình chính sách hoặc sổ hộ nghèo (ưu tiên xét duyệt)</div>
                <div>4/ CV cá nhân (nếu có mong muốn làm việc tại VeXeRe)</div>
                <div>
Tải ảnh: &nbsp;
                  <Upload {...uploadFileAction} fileList={this.state.fileList}>
                    <Button>
                      <Icon type="upload" />
                      {' '}
Upload
                    </Button>
                  </Upload>
                </div>
                <div className="note">Lưu ý: Đăng tối đa 8 tệp, dung lượng mỗi tệp tối đa 2MB</div>
              </MyCol>
            </Row>
            <TextArea rows={4} placeholder="Học bổng tài trợ vé xe nguyên năm này có giá trị như thế nào với ước mơ giảng đường của bạn? Chia sẻ thêm về hoàn cảnh khó khăn của bạn. (Phần này nhằm giúp BTC hiểu và xét duyệt nếu bạn chưa có giấy xác nhận gia đình có hoàn cảnh khó khăn)" />
            <Row>
              <Form.Item>
                {getFieldDecorator('dongy', {
                  rules: [{ required: true, message: 'Vui lòng đồng ý' }],
                  initialValue: true,
                  valuePropName: 'checked',

                })(
                  <Checkbox><b>Tôi đã đọc và đồng ý với thể lệ & quy định chương trình.</b></Checkbox>,
                )}
              </Form.Item>
            </Row>
            <MyButton htmlType="submit">Đăng ký ngay</MyButton>
          </Form>
        </ModalRegister>
      )
    }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(ModalStyledRegister);
export default WrappedNormalLoginForm
