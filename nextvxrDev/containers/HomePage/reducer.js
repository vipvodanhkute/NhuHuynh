import dotProp from 'dot-prop-immutable-chain';
import get from 'lodash.get'
import {
  LOADING, FINISH_LOADING, UPDATE_PAYLOAD,
  GET_BANNERS_SUCCESS,
  GA_MENU_BLOG,
  GA_MENU_BUS_SOFTWARE,
  // GA_MENU_CCUM,
  GA_MENU_INFORMATION,
  GA_MENU_LIMOUSINE,
  GA_MENU_RECRUITMENT,
  GA_MENU_TICKET_MANAGEMENT,
  // GA_MENU_VEXETET,
} from './constants'

const initialState = {
  menu: {
    'vi-VN': [
      {
        type: 'menu',
        label: 'Trang chủ',
        url: '/',
      },
      {
        type: 'menu',
        label: 'Xe Limousine',
        url: '/',
        event: GA_MENU_LIMOUSINE,
      },
      {
        type: 'menu',
        label: 'Phần mềm hãng xe',
        url: '/vi-VN/phan-mem-quan-ly-ban-ve-xe-khach-vexere.html',
        event: GA_MENU_BUS_SOFTWARE,
      },
      {
        type: 'menu',
        label: 'Vexere Blog',
        url: 'https://blog.vexere.com/?_ga=2.147848247.1656112415.1543807326-1211520078.1507173519',
        event: GA_MENU_BLOG,
      },
      {
        type: 'divider',
      },
      {
        type: 'menu',
        label: 'Quản lý vé',
        url: '/vi-VN/booking/ticketinfo',
        event: GA_MENU_TICKET_MANAGEMENT,
      },
      {
        type: 'menu',
        label: 'Câu hỏi thường gặp',
        url: 'https://vexere.com/vi-VN/nhung-cau-hoi-thuong-gap.html',
        event: GA_MENU_INFORMATION,
      },
      // {
      //   type: 'divider',
      // },
      // {
      //   type: 'event',
      //   label: 'Vé xe Tết 2019',
      //   url: '/ve-xe-tet',
      //   logo: 'https://storage.googleapis.com/vxrd/iconLandingPage.png',
      //   title: 'Sự kiện',
      //   content: 'Vé xe Tết 2019',
      //   banner: undefined,
      //   event: GA_MENU_VEXETET,
      // },
      // {
      //   type: 'event',
      //   label: 'Chắp cánh ước mơ',
      //   url: '/ve-xe-tet',
      //   logo: 'https://storage.googleapis.com/vxrd/iconLandingPage.png',
      //   title: 'Sự kiện',
      //   content: 'Chắp cánh ước mơ',
      //   banner: undefined,
      //   event: GA_MENU_CCUM,
      // },
      {
        type: 'divider',
      },
      {
        type: 'menu',
        label: 'Tuyển dụng',
        url: '/vi-vn/tuyen-dung',
        event: GA_MENU_RECRUITMENT,
      },
    ],
    'en-US': [
      {
        type: 'menu',
        label: 'Home page',
        url: '/',
      },
      {
        type: 'menu',
        label: 'Limousine Bus',
        url: '/en-US',
        event: GA_MENU_LIMOUSINE,
      },
      {
        type: 'menu',
        label: 'Vexere Blog',
        url: 'https://blog.vexere.com/en/?_ga=2.147848247.1656112415.1543807326-1211520078.1507173519',
        event: GA_MENU_BLOG,
      },
      {
        type: 'divider',
      },
      {
        type: 'menu',
        label: 'Ticket verification',
        url: '/en-US/booking/ticketinfo',
        event: GA_MENU_TICKET_MANAGEMENT,
      },
      {
        type: 'menu',
        label: 'FAQs',
        url: 'https://vexere.com/en-US/nhung-cau-hoi-thuong-gap.html',
        event: GA_MENU_INFORMATION,
      },
    ],
  },
  menuLimousine: {
    'vi-VN': [
      {
        label: 'Xe Limousine',
        url: '/vi-VN/xe-limousine',
        event: GA_MENU_LIMOUSINE,
      },
      {

        label: 'Phần mềm hãng xe',
        url: '/vi-VN/phan-mem-quan-ly-ban-ve-xe-khach-vexere.html',
        event: GA_MENU_BUS_SOFTWARE,
      },
      {

        label: 'Blog',
        url: 'https://blog.vexere.com',
        event: GA_MENU_BLOG,
      },
      {

        label: 'Quản lý vé',
        url: '/vi-VN/booking/ticketinfo',
        event: GA_MENU_TICKET_MANAGEMENT,
      },
      {

        label: 'EN',
        name: 'en',
        img: 'https://storage.googleapis.com/fe-production/images/english_icon.png',
      },
      // {
      //   type: 'divider',
      // },
      // {
      //   type: 'event',
      //   label: 'Vé xe Tết 2019',
      //   url: '/ve-xe-tet',
      //   logo: 'https://storage.googleapis.com/vxrd/iconLandingPage.png',
      //   title: 'Sự kiện',
      //   content: 'Vé xe Tết 2019',
      //   banner: undefined,
      //   event: GA_MENU_VEXETET,
      // },
      // {
      //   type: 'event',
      //   label: 'Chắp cánh ước mơ',
      //   url: '/ve-xe-tet',
      //   logo: 'https://storage.googleapis.com/vxrd/iconLandingPage.png',
      //   title: 'Sự kiện',
      //   content: 'Chắp cánh ước mơ',
      //   banner: undefined,
      //   event: GA_MENU_CCUM,
      // },
    ],
    'en-US': [
      {
        label: 'Limousine Bus',
        url: '/en-US/limousine-bus',
        event: GA_MENU_LIMOUSINE,
      },
      {
        label: 'Blog',
        url: 'https://blog.vexere.com/en/',
        event: GA_MENU_BLOG,
      },
      {
        label: 'Ticket management',
        url: '/en-US/booking/ticketinfo',
        event: GA_MENU_TICKET_MANAGEMENT,
      },
      {
        label: 'FAQs',
        url: '/en-US/nhung-cau-hoi-thuong-gap.html',
        event: GA_MENU_INFORMATION,
      },
      {
        label: 'VN',
        name: 'vn',
        img: 'https://storage.googleapis.com/fe-production/images/vietnam_icon.png',
      },
    ],
  },
  payload: {
    from: undefined,
    to: undefined,
    date: undefined,
    numOfTickets: 1,
  },
  banners: {
    main: undefined,
    promotions: [],
  },
}

export default (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case '@@INIT':
    case '@@redux/INIT':
      return initialState
    case LOADING:
      return dotProp(state).set('payload.isLoading', true).value()
    case FINISH_LOADING:
      return dotProp(state).set('payload.isLoading', false).value()
    case UPDATE_PAYLOAD:
      return { ...state, payload: action.payload }
    case GET_BANNERS_SUCCESS: {
      const mainBanner = action.banners.filter(x => parseInt(x.Type, 10) === 1)
      const promotionBanners = action.banners.filter(x => parseInt(x.Type, 10) === 2)
      return { ...state, banners: { main: get(mainBanner, '[0]', {}), promotions: promotionBanners } }
    }
    default:
      return state
  }
}
