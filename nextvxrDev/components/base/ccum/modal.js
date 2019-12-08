import { Modal } from 'antd';
import styled from 'styled-components'

const ModalStyled = styled(Modal)`
    color: white;    
    padding: -10px 10px 10px 10px;
    .ant-modal-header{
        display:none;
    }
    .ant-modal-footer{
        display:none;
    }
    .ant-modal-content{
        background-color:#1A77B9;
        margin-left:auto;
        margin-right:auto;     
        width: 90%;   
    }
    .ant-modal-close {
        top: -12px;
        right: -12px;
    }
    .ant-modal-close{        
        background: url(https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/close-big.svg?v=216);
        width: 40px;
        height: 40px;
    }
    .ant-modal-close-x{
        display: none;
    }
    .ant-modal{
       
    }
    width: 90% !important;
`

const Form = styled.div`
    border: 3px solid #FFF100;
    border-radius: 3px;
    padding: 0 10px 0 10px;
    font-size: 16px;
`

const TitleForm = styled.div`
    display: table;        
    color: #FFF100;
    font-size: 20px;    
    margin: -15px auto 15px auto;
    strong{
        background-color: #1A77B9;
    }
    @media(max-width:768px){
        font-size: 15px;  
    }
    
`

const EndForm = styled.div`    
    background-color: #1A77B9;
    width: 66px;
    margin-bottom: -12px;
    margin-left: auto;
    margin-right: auto;
`

export default ({ children, ...props }) => (
    <ModalStyled {...props}>
        <Form>
            <TitleForm>
                <strong>
                    <img src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216" />{props.title}
                </strong>
            </TitleForm>
            {children}
            <EndForm>
                <img src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-5.png?v=216" />
            </EndForm>
        </Form>
    </ModalStyled>
)
