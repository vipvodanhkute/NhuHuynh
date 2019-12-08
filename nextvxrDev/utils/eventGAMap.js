import { trackEvent, trackPageView } from '@redux-beacon/google-analytics';
import {
  PRODUCT_IMPRESSION,
  DESTINATION_SWAP,
  SELECT_FROM_SUGGESTION,
  SELECT_DATE,
  AVAILABLE_SEAT,
  SELECT_AVAILABLE_SEAT,
  SEARCH_BUSES,
  LUNA_CALENDAR_BUTTON,
  FROM_TYPE,
  TO_TYPE,
  LOGO_MENU,
  ROUTE_NAME,
  LANGUAGE_CHANGE,
  CALENDAR,
  SORT_BY_TIME,
  SORT_BY_PRICE,
  FILTER_OPEN,
  RATING_ARROW,
  SEE_MORE_TRIPS,
  LIMOUSINE_FILTER,
  ONLINE_BOOKING_FILTER,
  FREE_WATER,
  WIFI_FILTER,
  AC_FILTER,
  TELEVISION,
  WET_TOWER,
  TOILET,
  HOME_PICKUP_FILTER,
  HOME_DROP_OFF_FILTER,
  RESERVED_MEAL,
  PRICE,
  CLOSE_FILTER,
  CLEAR_FILTER,
  RATING,
  OPERATORS,
} from '#/containers/Route/constants';
// Bus Conpany Info page
import {
  GA_BUS_INFO_EVENT_CLICK,
  GA_BUS_INFO_EVENT_CATEGORY,
} from '#/containers/BookingCompanyDetail/constants';
import {
  GA_MAIN_BOOKING_EVENT,
  GA_MAIN_REGISTER_BOOKING_EVENT,
  GA_MAIN_PHONE_CALL_BOOKING_EVENT,
  GA_BOOKING_BOARDING_POINT_SELECTION_EVENT,
  GA_BOOKING_BOARDING_POINT_SELECTION_TYPE_EVENT,
  GA_BOOKING_DROPPING_POINT_SELECTION_EVENT,
  GA_BOOKING_DROPPING_POINT_SELECTION_TYPE_EVENT,
  GA_BOOKING_SERVICE_EVENT,
  GA_BOOKING_CONTACT_INFO_EVENT,
  GA_BOOKING_CONTACT_INFO_TYPE_EVENT,
  GA_BOOKING_EDIT_EVENT,
  GA_MAIN_BOOKING_EVENT_CATEGORY,
  GA_MAIN_REGISTER_BOOKING_EVENT_CATEGORY,
  GA_MAIN_PHONE_CALL_BOOKING_EVENT_CATEGORY,
  GA_BOOKING_BOARDING_POINT_SELECTION_EVENT_CATEGORY,
  GA_BOOKING_DROPPING_POINT_SELECTION_EVENT_CATEGORY,
  GA_BOOKING_SERVICE_CATEGORY,
  GA_BOOKING_CONTACT_INFO_CATEGORY,
  GA_BOOKING_EDIT_EVENT_CATEGORY,
} from '#/containers/Booking/constants';
import {
  GA_PAYMENT_FAILED_EVENT,
  GA_PAYMENT_FAILED_EVENT_CATEGORY,
  GA_BOOKING_CANCLED_EVENT,
  GA_BOOKING_CANCLED_EVENT_CATEGORY,
  GA_PAYMENT_PROCESSING_EVENT,
  GA_PAYMENT_PROCESSING_EVENT_CATEGORY,
  GA_PAYMENT_SUCCESS_EVENT,
  GA_PAYMENT_SUCCESS_EVENT_CATEGORY,
  GA_RESERVED_SUCCESS_EVENT,
  GA_RESERVED_SUCCESS_EVENT_CATEGORY,
} from '#/containers/PaymentResults/constants';
import {
  GA_PAYMENT_CHECK_OUT_EVENT,
  GA_PAYMENT_CHECK_OUT_EVENT_CATEGORY,
} from '#/containers/Payment/constants';

import {
  GA_SEARCH_BUSES_BUTTON,
  GA_DESTINATION_SWAP,
  GA_TODAY,
  GA_TOMORROW,
  GA_FROM,
  GA_TO,
  GA_SWITCH_LANGUAGE_EN,
  GA_SWITCH_LANGUAGE_VI,
  GA_MENU_LIMOUSINE,
  GA_MENU_TICKET_MANAGEMENT,
  GA_MENU_INFORMATION,
  GA_MENU_BUS_SOFTWARE,
  GA_MENU_RECRUITMENT,
  GA_MENU_BLOG,
  GA_MENU_VEXETET,
  GA_MENU_CCUM,
} from '#/containers/HomePage/constants'

import {
  GA_CLOSE_BANNER,
} from '#/containers/Device/constants'

import get from 'lodash.get';


export default {
  [PRODUCT_IMPRESSION]: trackPageView(() => ({
    page: '/routepage',
  })),
  [DESTINATION_SWAP]: trackEvent(() => ({
    category: 'destination change',
    action: 'click',
    label: 'Destination Swap',
  })),
  [SELECT_FROM_SUGGESTION]: trackEvent(() => ({
    category: 'destination change',
    action: 'click',
    label: 'Select from Suggestions',
  })),
  [SELECT_DATE]: trackEvent(() => ({
    category: 'destination change',
    action: 'click',
    label: 'Select date',
  })),
  [SELECT_AVAILABLE_SEAT]: trackEvent(() => ({
    category: 'destination change',
    action: 'click',
    label: 'Select available seat',
  })),
  [SEARCH_BUSES]: trackEvent(() => ({
    category: 'destination change',
    action: 'click',
    label: 'Search buses',
  })),
  [LUNA_CALENDAR_BUTTON]: trackEvent(() => ({
    category: 'destination change',
    action: 'click',
    label: 'Lunar Calendar button',
  })),
  [FROM_TYPE]: trackEvent(() => ({
    category: 'destination change',
    action: 'type',
    label: 'From',
  })),
  [TO_TYPE]: trackEvent(() => ({
    category: 'destination change',
    action: 'type',
    label: 'To',
  })),
  [LOGO_MENU]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Logo Menu',
  })),
  [ROUTE_NAME]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Route name',
  })),
  [LANGUAGE_CHANGE]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Language change',
  })),
  [CALENDAR]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Calendar',
  })),
  [SORT_BY_TIME]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Sort by time',
  })),
  [SORT_BY_PRICE]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Sort by price',
  })),
  [FILTER_OPEN]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Filter',
  })),
  [RATING_ARROW]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'Rating arrow',
  })),
  [SEE_MORE_TRIPS]: trackEvent(() => ({
    category: 'route page',
    action: 'click',
    label: 'See more trips',
  })),
  [LIMOUSINE_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Limousine filter',
  })),
  [OPERATORS]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Operators',
  })),
  [ONLINE_BOOKING_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Online booking filter',
  })),
  [FREE_WATER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Drink',
  })),
  [WIFI_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Wifi',
  })),
  [AC_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Air condition',
  })),
  [TELEVISION]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Television',
  })),
  [TOILET]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Toilet',
  })),
  [WET_TOWER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Wet towel',
  })),
  [HOME_PICKUP_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Home pick-up filter',
  })),
  [HOME_DROP_OFF_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Home drop-off filter',
  })),
  [RESERVED_MEAL]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Reserved meal',
  })),
  [AVAILABLE_SEAT]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Available seat',
  })),
  [PRICE]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Price',
  })),
  [RATING]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Rating',
  })),
  [CLEAR_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Clear fillter button',
  })),
  [CLOSE_FILTER]: trackEvent(() => ({
    category: 'filter',
    action: 'click',
    label: 'Close button',
  })),
  [GA_BUS_INFO_EVENT_CLICK]: trackEvent(action => ({
    category: GA_BUS_INFO_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_MAIN_BOOKING_EVENT]: trackEvent(action => ({
    category: GA_MAIN_BOOKING_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_MAIN_REGISTER_BOOKING_EVENT]: trackEvent(action => ({
    category: GA_MAIN_REGISTER_BOOKING_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_BOARDING_POINT_SELECTION_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_BOARDING_POINT_SELECTION_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_BOARDING_POINT_SELECTION_TYPE_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_BOARDING_POINT_SELECTION_EVENT_CATEGORY,
    action: 'type',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_DROPPING_POINT_SELECTION_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_DROPPING_POINT_SELECTION_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_DROPPING_POINT_SELECTION_TYPE_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_BOARDING_POINT_SELECTION_EVENT_CATEGORY,
    action: 'type',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_SERVICE_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_SERVICE_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_CONTACT_INFO_TYPE_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_CONTACT_INFO_CATEGORY,
    action: 'type',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_CONTACT_INFO_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_CONTACT_INFO_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_EDIT_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_EDIT_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_MAIN_PHONE_CALL_BOOKING_EVENT]: trackEvent(action => ({
    category: GA_MAIN_PHONE_CALL_BOOKING_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_MENU_LIMOUSINE]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Xe limousine',
  })),
  [GA_MENU_TICKET_MANAGEMENT]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Quản lý vé',
  })),
  [GA_MENU_INFORMATION]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Câu hỏi thường gặp',
  })),
  [GA_MENU_BUS_SOFTWARE]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Phần mềm hãng xe',
  })),
  [GA_MENU_RECRUITMENT]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Tuyển dụng',
  })),
  [GA_MENU_BLOG]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Blog',
  })),
  [GA_MENU_VEXETET]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Vé xe Tết',
  })),
  [GA_MENU_CCUM]: trackEvent(() => ({
    category: 'header',
    action: 'click',
    label: 'Chắp cánh ước mơ',
  })),
  [GA_SEARCH_BUSES_BUTTON]: trackEvent(() => ({
    category: 'homepage',
    action: 'click',
    label: 'Search Buses button',
  })),
  [GA_DESTINATION_SWAP]: trackEvent(() => ({
    category: 'homepage',
    action: 'click',
    label: 'Destination Swap',
  })),
  [GA_TODAY]: trackEvent(() => ({
    category: 'homepage',
    action: 'click',
    label: 'Today',
  })),
  [GA_TOMORROW]: trackEvent(() => ({
    category: 'homepage',
    action: 'click',
    label: 'Tomorrow',
  })),
  [GA_FROM]: trackEvent(() => ({
    category: 'homepage',
    action: 'click',
    label: 'From',
  })),
  [GA_TO]: trackEvent(() => ({
    category: 'homepage',
    action: 'click',
    label: 'To',
  })),
  [GA_SWITCH_LANGUAGE_EN]: trackEvent(() => ({
    category: 'language',
    action: 'click',
    label: 'Switch language',
    value: 'EN',
  })),
  [GA_SWITCH_LANGUAGE_VI]: trackEvent(() => ({
    category: 'language',
    action: 'click',
    label: 'Switch language',
    value: 'VI',
  })),
  [GA_PAYMENT_FAILED_EVENT]: trackEvent(action => ({
    category: GA_PAYMENT_FAILED_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_BOOKING_CANCLED_EVENT]: trackEvent(action => ({
    category: GA_BOOKING_CANCLED_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_PAYMENT_PROCESSING_EVENT]: trackEvent(action => ({
    category: GA_PAYMENT_PROCESSING_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_PAYMENT_SUCCESS_EVENT]: trackEvent(action => ({
    category: GA_PAYMENT_SUCCESS_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_RESERVED_SUCCESS_EVENT]: trackEvent(action => ({
    category: GA_RESERVED_SUCCESS_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_PAYMENT_CHECK_OUT_EVENT]: trackEvent(action => ({
    category: GA_PAYMENT_CHECK_OUT_EVENT_CATEGORY,
    action: 'click',
    label: get(action, 'payload.value'),
  })),
  [GA_CLOSE_BANNER]: trackEvent(() => ({
    category: 'bannerapp',
    action: 'click',
    label: 'closedownloadbanner',
  })),
};
