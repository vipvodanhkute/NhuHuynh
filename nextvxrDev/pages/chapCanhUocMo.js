/* eslint-disable react/no-danger */
import React from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'antd';
// import { BREAK_POINT, LANG } from '#/utils/constants';
import ModalStyled from '#/components/base/ccum/modal'
import ModalStyledRegister from '#/components/base/ccum/modalRegister'
import Header from '#/components/desktop/components/Navbar'
// import Header from '../components/desktop/components/Navbar'
import { bindActionCreators } from 'redux';
import { getSponsorOperator } from '#/containers/ChapCanhUocMo/actions';

const ContainHeader = styled.div`
  background-color:white;
  .header-body{
  }
`

const ShareButton = styled.div`
  text-align:center;
  color:white;
  line-height:50px;
  p{
    display:inline;
  }
  .bt-share-facebook{
    display:inline;
    .fb-share-button{
      display:inline;
      a{
        color:white;
      }
    }
  }
  
`

const Wrapper = styled.div`
  margin: 0;
  padding:0;
  box-sizing: border-box;
  background-color: #1853c5
`

// const Header = styled.header`
//   padding: 10px 0 10px 0;
//   background-color: white;
//   height:70px;
// `

const Container = styled.div`
  margin: 0 auto;
  max-width: 1140px;
`
const RightHeader = styled.div`
 margin-top:10px;
  a{
    margin-right:20px;
    color:#707070;
    font-weight:blod;
    font-size:18px;
    &:hover{
      text-decoration: underline;
    }
  }
  @media(max-width:768px){
    display:none;
  }
`

const Banner = styled.div`
background: #1853c5;
background-size: cover;
height: 470px;
width: 100%;
position: relative;
padding-bottom: 50px;
.img-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
`

const ContainInfo = styled.div`
  border: 3px solid #FFF100;
  max-width: 100%;
  margin-top: 50px;
  border-radius: 3px;
  .mdct{
    color: white;
    margin: 0 50px;
    font-size: 18px;
  }
`
const TitleListBus = styled.div`
  background-color: #1853c5;
  color: #FFF100;
  position: relative;
  top:-16px;
  display: inline-block;
  padding: 0 10px;
  padding-right: 20px;
  font-size: 20px;
  text-align: center;
  left: 50%;
  transform:translateX(-50%);
  .responsive{
    display:none;
  }
  @media (max-width:768px){
    .default{
      display:none;
    }
    .responsive{
      display:inline-block;
    }
  }
`
const ContentRoute = styled.div`
  padding: 0 50px 30px 50px;
  font-size: 18px;
  color:white;
  .content-note{
    text-align: center;
    font-size: 15px;
  }

  .content-note a{
    color:white;
  }
`

const SortHeader = styled.div`
  display: flex;
  justify-content:space-around;
  // display: inline-block;
  // .sort-title, select, .note-price{
  //   float: left;
  //   margin-right: 10px;
  // }

  select{
    margin-top: 2px;
    width: 200px;
    color: #FFF100;
    border: none;
    border-bottom: 1px solid #FFF100;
    background-color: transparent;
    font-size: px;
  }
 @media (max-width:768px){
   .sort-title{
     display:none;
   }
 }
  @media (max-width:841px){
    .note-price{
      display:none;
    }
  }
}
`
const ListRoute = styled.div`
  margin-top: 40px;
  ul{
    margin-left: -40px;
    padding-bottom: 10px;
  }

  .line{
    width: 98%;
    list-style: none;
    border-bottom: 1px solid #fff;
    display: inline-block;
    padding: 20px 0;
    line-height: 20px;
  }

  li{
    list-style-type: none;
  }

  li .title-list-item {
    color: #fff;
    font-weight: bold;
    width: 20%;
    font-size: 18px;
    float: left;
    text-align: center;
  }

  .list-scroll{
    height: 500px;
    position: relative;
    overflow: visible;
  }

  .list-scroll .item{
    color: #fff;
    width: 20%;
    font-size: 16px;
    float: left;
    text-align: center;
  }

`
const Button = styled.button`
  color: #3C7277;
  font-size: 16px;
  background: #FFF100;
  border: 0;
  border-radius: 5px;
  padding: 0px 20px;
  height: 42px;
  font-weight: bold;
  position: relative;
  top: 8px;
  right: -410px;
`

const TitleGoal = styled(TitleListBus)`
  left: 50%;
  transform:tranlateX(-50%);
`

const TitleRule = styled(TitleListBus)`
left: 50%;
transform:tranlateX(-50%);
`

const EndForm = styled.img`
  display: inline-block;
  background-color: #1853c5;
  position: relative;
  top: -12px;
  left: 46%;
`

const Content = styled.div`
  color: white;
  padding: 0 50px 0px 50px;
  font-size: 18px;
  @media (max-width:576px){
    padding:0 5px 0 5px;
  }
`

const Rule = styled.div`
  p{
    color: white;
    padding: 0 50px 0px 50px;
    font-size: 18px;
  }
  ul li{
    color: white;
    margin: 0 50px;
    font-size: 18px;
  }
  a{
    color: white;
  }
  @media (max-width:576px){
    p{
      padding:0 5px 0 5px;
    }
    ul{
      li{
        margin: 0 5px;
      }
    }
  }
`

const Footer = styled.footer`
  padding-bottom: 40px;
  background-color: #1364A9;
  width:100%;
  height:580px;
  background-image: url(https://vexere.com/Content/vxr/images/landingpagetansinhvien/Element-7.png);
  div{
    position:relative;
    top:75%;
    padding-left:50px;
    h3{
      display:inline;
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #FFF100;
      text-transform: uppercase;
    }
    p{
      margin-bottom:0;
      color:white;
    }
    @media(max-width:576px){
      padding-left:20px;
    }
  }
`

const Contact = styled.div`
  margin: 20px 0 0 20px;
  float: left;
  margin-top:400px;
  .title-contact{
    padding-left: 10px;
  }

  .title-contact b{
    font-size: 20px;
    color: #FFF100;
  }

  .content-contact{
    color:white;
    padding-left: 20px;
  }
  .content-contact a{
      color:white;
  }
`
const Announcement = styled.div`
  float: left;
  margin: 20px 0 0 20px;
  margin-top:400px;
  .title-announ b{
    font-size: 20px;
    color: #FFF100;
  }
  a {
    color: white;
    padding-left: 20px;
  }
`
const CusTable = styled(Table)`
  margin-top:20px;
  margin-bottom:20px;
  .ant-table-header{
    margin-bottom: -20px;
    padding-bottom: 5px;
  }
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: #1853c5;
}

  table{
    background-color: #1853c5;
    color:white;
    thead{
      tr{
        th{
          font-weight:bold;
          font-size:18px;
          color:white;
          background-color: #1853c5;
        }
      }
    }
    tbody{

      }
    }
    @media(max-width:768px){
      th:nth-child(3),th:nth-child(4){
        display:none;
      }
      tr{
        td:nth-child(3),td:nth-child(4){
          display:none;
        }
      }
    }
  }
  ul{
    display:none;
  }
`

const imgBook = 'https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=206';
const imgBanner = 'https://storage.googleapis.com/fe-production/images/ccum/ccum.png';
const columns = [
  {
    title: 'Tên nhà xe',
    dataIndex: 'tnx',
    width: 150,
  },
  {
    title: 'Tuyến đường',
    dataIndex: 'td',
    width: 150,
  },
  {
    title: 'Số  lượng học bổng',
    dataIndex: 'slhb',
    width: 150,
  },
  {
    title: 'Tổng số vé tài trợ',
    dataIndex: 'tsvtt',
    width: 150,
  },
  {
    title: 'Tổng tiền tài trợ',
    dataIndex: 'tttt',
    width: 150,
  },
];

const Cusbutton = styled.div`
display:flex;
flex-direction:column;
text-align: center;
cursor:pointer;
p{
  padding-top: 40px;
}
div{
  color: #3C7277;
  font-size: 12px;
  background: #FFF100;
  border: 0;
  border-radius: 5px;
  padding: 0px 20px;
  height: 42px;
  font-weight: bold;
  position: relative;
  text-align:center;
  line-height:42px;
  @media(max-width:1082px){
    font-size:10px;
  }
  @media(max-width:992px){
    font-size: 16px;
    span{
      display:none;
    }
  }

}
`

class Index extends React.Component {
  static async getInitialProps({ ctx }) {
    const { isServer, store } = ctx;
    store.dispatch(getSponsorOperator());
    return {
      isServer,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpenModalStyle: false,
      isOpenModalRegister: false,
      busName: '',
      busRoute: '',
    }
  }


  handleVisibleForm = () => {
    this.setState({
      isOpenModalStyle: true,
    })
  }

  handleCancelStyle = () => {
    this.setState({
      isOpenModalStyle: false,
    });
  };

  handleVisibleFormRegister = () => {
    this.setState({
      isOpenModalRegister: true,
    })
  }

  handleCancelModalRegister = () => {
    this.setState({
      isOpenModalRegister: false,
    });
  };

  tuyenduong = (e) => {
    console.log(e)
  }

  // td = (sponsors) => (
  //   <div style={{ display: 'flex', flexDirection: 'column' }}>
  //     {sponsors.routes.split(',').map(e => <div>{e}</div>)}
  //   </div>
  // // )

  render() {
    const nf = new Intl.NumberFormat();
    const { response } = this.props;
    const { sponsors, froms, tos } = response;
    const data = [];
    for (let i = 0; i < sponsors.length; i++) {
      data.push({
        key: i,
        tnx: sponsors[i].name,
        td: <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sponsors[i].routes.split(',').map(e => <div>{e}</div>)}
        </div>,
        slhb: nf.format(sponsors[i].totalScho),
        tsvtt: 'B',
        tttt: <Cusbutton>
          <p>
            {nf.format(sponsors[i].totalMoney)}
            đ
          </p>
          <div onClick={this.handleVisibleFormRegister}>Nộp hồ sơ học bổng</div>
        </Cusbutton>,
      });
    }

    const fromsOption = froms.map(item => (<option value={item.id}>{item.name}</option>))

    const tosOption = tos.map(item => (<option value={item.id}>{item.name}</option>))

    const stringContent = {
      goal: 'Thiết thực chào mừng kỷ niệm 5 năm ngày thành lập Công ty Cổ phần VeXeRe (07/2013 – 07/2018), 5.000 học bổng vé xe miễn phí nguyên năm được trao tặng đến 5.000 bạn sinh viên sẽ góp phần chắp cánh ước mơ giảng đường của các bạn thành hiện thực, tạo cơ hội cho các bạn được trở về nhà thường xuyên hơn mà không phải lo lắng về chi phí vé, góp phần vì một Việt Nam tốt đẹp hơn.',
      rules: {
        general: ' chỉ áp dụng cho sinh viên thỏa các điều kiện của chương trình, các điều kiện từ đối tác của VeXeRe.com và chỉ áp dụng trên các tuyến đường được hỗ trợ (được cập nhật tại “Danh sách các hãng xe tài trợ với tấm lòng vàng vì cộng đồng”). Ban Tổ Chức sẽ xét duyệt các hồ sơ của tất cả các bạn sinh viên đăng ký. Ưu tiên các bạn sinh viên có hoàn cảnh khó khăn, các bạn ở vùng sâu vùng xa, con em ở hải đảo, đồng bào dân tộc thiểu số trước. Vì vậy, nếu có giấy xác nhận hộ nghèo/cận nghèo, giấy xác nhận là con em ở vùng sâu vùng xa, hải đảo, dân tộc thiểu số (xác nhận từ chính quyền địa phương) các bạn hãy tải hình ảnh lên để Ban Tổ Chức xét duyệt ưu tiên.',
      },
    }

    const MDCT = 'Thiết thực chào mừng kỷ niệm 5 năm ngày thành lập Công ty Cổ phần VeXeRe (07/2013 – 07/2018), 5.000 học bổng vé xe miễn phí nguyên năm được trao tặng đến 5.000 bạn sinh viên sẽ góp phần chắp cánh ước mơ giảng đường của các bạn thành hiện thực, tạo cơ hội cho các bạn được trở về nhà thường xuyên hơn mà không phải <b> lo lắng </b> về chi phí vé, góp phần vì một Việt Nam tốt đẹp hơn.'

    const TTVQDCT = '<p><b>1/ QUY ĐỊNH CHUNG:</b><br></p><p><b>2/ THỜI GIAN:</b></p><ul><li>Thời gian nhận hồ sơ: <b>01/08 - 31/10/2018.</b></li><li>Thời gian áp dụng: <b>Áp dụng cho các chuyến xe khởi hành từ 05/11/2018 đến 05/11/2019.</b></li></ul><p><b>3/ CÁCH THỨC ĐĂNG KÝ:</b></p><ul><li><b>Bước 1:</b> Đăng ký nộp hồ sơ học bổng: sinh viên sẽ chọn nơi đi - nơi đến (lưu ý<b>chương trình chỉ áp dụng cho tuyến đường từ trường về nhà bạn và ngược lại</b>), chọn nhà xe; tiếp theo vào mục "Nộp hồ sơ học bổng" điền đầy đủ các thông tin theo biểu mẫu và gửi hồ sơ.</li><li><b>Bước 2: </b>Ban Tổ Chức sẽ xét duyệt hồ sơ và thông báo kết quả trên VeXeRe.com vào ngày<b>05/11/2018</b> đồng thời sẽ gửi điều kiện và hướng dẫn để sinh viên sử dụng học bổng này qua email cá nhân. Học bổng hỗ trợ sinh viên mua vé giá 0đ tại website VeXeRe.com theo tuyến đường đã chọn với số lượt sử dụng tối đa là 08 lần, mỗi lần chỉ áp dụng được cho số lượng 01 vé.</li></ul><p><b>4/ LƯU Ý KHÁC:</b></p><ul><li>Học bổng sẽ được cấp theo dạng Mã Giảm Giá. Mỗi lần có nhu cầu sử dụng, các bạn email đến địa chỉ <a href="mailto:chapcanhuocmo@vexere.com">chapcanhuocmo@vexere.com</a> để xin Mã Giảm Giá (Ghi rõ Họ tên, Trường, Tuyến đường, Ngày đặt vé).</li><li>Học bổng không đảm bảo có vé cho bạn trong các dịp Lễ Tết do nhu cầu đi lại tăng cao. Do đó, để thuận tiện nhất, bạn nên gửi email xin Mã Giảm Giá trước ít nhất 10 ngày đối với các dịp Lễ và trước ít nhất 15 ngày đối với dịp Tết âm lịch. BTC sẽ phản hồi trong thời gian 48h kể từ thời gian nhận email để báo cho bạn thông tin.</li><li>Mã Giảm Giá đã được cấp chỉ có giá trị cho các chuyến xe khởi hành trong thời gian từ 05/11/2018 cho đến 05/11/2019. Ngoài thời gian trên, Mã Giảm Giá được cấp sẽ không có giá trị.</li><li>Mỗi Mã Giảm Giá được cấp chỉ được áp dụng 01 lần, không áp dụng cho nhiều lần đặt vé.</li></ul><p><b>5/</b> Mỗi sinh viên nhận được học bổng không được chuyển nhượng cho người khác và không có giá trị quy đổi thành tiền mặt trong trường hợp sinh viên nhận được học bổng mà không đi xe. Trong trường hợp vì bất cứ lý do gì bạn đã nhận được học bổng nhưng không sử dụng để đi xe, hãy liên hệ với BTC để các bạn sinh viên khác có cơ hội nhận được sự hỗ trợ từ chương trình.</p><p><b>6/</b> Sinh viên chịu trách nhiệm về tính trung thực của những thông tin đăng ký. Khi lên xe, nhà xe sẽ yêu cầu đọc số điện thoại mà sinh viên đã đăng ký vé và có thể yêu cầu sinh viên xuất trình CMND kèm vé xe (nếu có). Nếu phát hiện hành vi không trung thực, sinh viên sẽ phải đóng phí bổ sung đầy đủ theo giá vé xe đó, hoặc bị hãng xe từ chối cung cấp dịch vụ vận chuyển.</p><p><b>7/</b> VeXeRe.com có toàn quyền sử dụng các thông tin bạn đã cung cấp trong trường hợp cần thiết.</p><p><b>8/</b> Thể lệ và quy định của chương trình có thể thay đổi trong thời gian diễn ra, bạn vui lòng xem lại điều khoản sử dụng thường xuyên tại đây.</p>'

    const Ket = '<footer><div class><div class="title-contact"><img src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216" alt=""><b>LIÊN HỆ</b></div><div class="content-contact">BTC chương trình “Vé xe chắp cánh ước mơ giảng đường”</div><div class="content-contact">Email:<b>&nbsp;<a href="mailto:chapcanhuocmo@vexere.com">chapcanhuocmo@vexere.com</a></b></div><div class="content-contact">Hotline hỗ trợ:<b>&nbsp;<a href="tel: 1900 779 914"> 1900 779 914 (từ 9:00 - 17:00 từ thứ 2 tới thứ 6)</a></b></div><div class="content-contact">Facebook:<b>&nbsp;<a target="_blank" rel="nofollow" href="https://www.facebook.com/Vexere/">https://www.facebook.com/Vexere/</a></b></div></div><div class="chapCanhUocMo__Announcement-ezbiqa-20 ebCRit"><div class="title-announ"><img src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216" alt=""><b>THÔNG BÁO CÁO CHÍ</b></div><a href="#">Bấm vào link để download</a></div><div class="clearfix"></div></footer>'
    const menu = [{label:"Thể lệ chương trình"},{label:"Thông cáo báo chí"}]
    return (
      <>
        <Wrapper>
          {/* <Header>
            <Container>
              <Row type="flex" justify="space-between">
                <Col md={10}>
                  <img src="https://storage.googleapis.com/fe-production/icon_vxr_full.svg" style={{ width: '15em' }} alt="vexere.com" />
                </Col>
                <Col md={10} style={{ textAlign: 'right' }}>
                  <RightHeader>
                    <a>Thể lệ chương trình</a>
                    <a>Thông cáo báo chí</a>
                  </RightHeader>
                </Col>
              </Row>
            </Container>
          </Header> */}
          <ContainHeader>
            <Header
              menu={menu}
              minWidth={1189}
            />
         </ContainHeader>
          <Banner>
            <div className="img-wrapper">
              <img src="https://storage.googleapis.com/fe-production/images/ccum/ccum.png" alt="banner" />
            </div>
            <ShareButton>
              <p>Ấn share để lan tỏa giá trị đến cộng đồng </p>
              <div className="bt-share-facebook">
                <div className="fb-share-button" data-href="https://vexere.com/vi-VN/ve-xe-gia-re-ho-tro-tan-sinh-vien-nhap-hoc" data-layout="button_count" data-size="large" data-mobile-iframe="false"><a className="fb-xfbml-parse-ignore" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fvexere.com%2Fvi-VN%2Fve-xe-gia-re-ho-tro-tan-sinh-vien-nhap-hoc;src=sdkpreparse">Chia sẻ</a></div>
              </div>
            </ShareButton>
          </Banner>
          <Container>
              <ContainInfo>
                <TitleListBus>
                  <img
                    src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216"
                    alt=""
                  />
                  <b className="default">DANH SÁCH CÁC HÃNG XE VỚI TẤM LÒNG VÀNG VÌ CỘNG ĐỒNG</b>
                  <b className="responsive">HÃNG XE VÌ CỘNG ĐỒNG</b>
                </TitleListBus>
                <ContentRoute>
                  <SortHeader>
                    <div className="sort-title">Tuyến đường của bạn</div>
                    <select name="" id="" className="input-point">
                      <option>Chọn nơi đi</option>
                      {fromsOption}
                    </select>
                    <select name="" id="" className="input-point">
                      <option>Chọn nơi đến</option>
                      {tosOption}
                    </select>
                    <div className="note-price">với giá vé 0đ</div>
                  </SortHeader>
                  <CusTable columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
                  <div className="content-note">
                    {
                      '*Danh sách các hãng xe tài trợ vẫn liên tục được cập nhật thêm.'
                    }
                  </div>
                </ContentRoute>
              </ContainInfo>
              <EndForm src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-5.png?v=216" />

              <div>
                <ContainInfo>
                  <TitleGoal>
                    <img
                      src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216"
                      alt=""
                    />
                    <b>MỤC ĐÍCH CHƯƠNG TRÌNH</b>
                  </TitleGoal>
                  <div className="mdct" dangerouslySetInnerHTML={{ __html: MDCT }} />
                </ContainInfo>
                <EndForm src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-5.png?v=216" />

                <ContainInfo>
                  <TitleRule>
                    <img
                      src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216"
                      alt=""
                    />
                    <b>THỂ LỆ VÀ QUY ĐỊNH CHƯƠNG TRÌNH</b>
                  </TitleRule>
                  <Rule>
                    <div dangerouslySetInnerHTML={{ __html: TTVQDCT }} />
                  </Rule>
                </ContainInfo>
                <EndForm src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-5.png?v=216" />
              </div>
            </Container>
          {/* <Footer dangerouslySetInnerHTML={{ __html: Ket }} />  */}
          <Footer>
            <div>
                <img src="https://storage.googleapis.com/fe-production/images/landingpagetansinhvien/Element-6.png?v=216" alt="" />
                <h3>LIÊN HỆ</h3>
                <p>BTC chương trình “Vé xe chắp cánh ước mơ giảng đường”</p>
                <p>
Email:
{' '}
<a>chapcanhuocmo@vexere.com</a>
</p>
                <p>
Hotline hỗ trợ:
{' '}
<a>1900 779 914 (từ 9:00 - 17:00 từ thứ 2 tới thứ 6)</a>
</p>
                <p>
Facebook:
{' '}
<a>https://www.facebook.com/Vexere/</a>
</p>
              </div>
          </Footer>
          <ModalStyled
            title="THÔNG BÁO"
            visible={this.state.isOpenModalStyle}
            onOk={this.handleOk}
            onCancel={this.handleCancelStyle}
          >
            <p>“Vé Xe Chắp Cánh Ước Mơ Giảng Đường 2018” đã đóng hệ thống nhận hồ sơ Thông tin về chương trình sẽ tiếp tục được cập nhật tại fanpage: https://www.facebook.com/vexere"</p>
          </ModalStyled>
          <ModalStyledRegister
            title="ĐĂNG KÝ NHẬN MÃ HỌC BỔNG"
            visible={this.state.isOpenModalRegister}
            onCancel={this.handleCancelModalRegister}
            isSubmitDataRegister={this.handleClickInModalRegester}
          />
        </Wrapper>
      </>
    );
  }
}

const mapStateToProps = state => ({
  response: state.ccumReducer.sponsors,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getSponsorOperator,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Index)
