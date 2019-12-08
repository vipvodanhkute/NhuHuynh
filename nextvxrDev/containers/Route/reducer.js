import dotProp from 'dot-prop-immutable-chain';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep'
import moment from 'moment';
import {
  GET_ROUTES,
  GET_ROUTES_ERROR,
  GET_ROUTE,
  GET_ROUTE_SUCCESS,
  GET_ROUTE_ERROR,
  UPDATE_STATE_REDUX,
  GET_TOTAL_ROUTE_SUCCESS,
  GET_STATUS_ROUTE_SUCCESS,
  GET_STATUS_ROUTE_ERROR,
  GET_TOTAL_TRIP,
  GET_TOTAL_TRIP_SUCCESS,
  POST_BUS_OPERATOR,
  POST_BUS_OPERATOR_FAIL,
  POST_BUS_OPERATOR_SUCCESS,
  CLEAR_FILTER,
} from './constants';

import { GET_SEO_DATA_SUCCESS, GET_SEO_COMPANIES_SUCCESS } from '../SEO/constants'

export const GROUPS = ['DEFAULT'];

export const INIT_GROUPS = {
  DEFAULT: {
    pagesize: 20,
  },
  EARLY_MORNING: {
    time: {
      min: '00:00',
      max: '05:59',
    },
    pagesize: 5,
  },
  MORNING: {
    time: {
      min: '06:00',
      max: '11:59',
    },
    pagesize: 5,
  },
  AFTERNOON: {
    time: {
      min: '12:00',
      max: '17:59',
    },
    pagesize: 5,
  },
  EVENING: {
    time: {
      min: '18:00',
      max: '23:59',
    },
    pagesize: 5,
  },
};

export const TIME_GROUPS = {
  EARLY_MORNING: {
    time: {
      min: '00:00',
      max: '05:59',
    },
    pagesize: 5,
  },
  MORNING: {
    time: {
      min: '06:00',
      max: '11:59',
    },
    pagesize: 5,
  },
  AFTERNOON: {
    time: {
      min: '12:00',
      max: '17:59',
    },
    pagesize: 5,
  },
  EVENING: {
    time: {
      min: '18:00',
      max: '23:59',
    },
    pagesize: 5,
  },
};

export const ROUTE_STATUS = {
  NORMAL: 'NORMAL',
  SOLD_OUT: 'SOLD_OUT',
  DEPARTED: 'DEPARTED',
  NOT_EXIST: 'NOT_EXIST',
};

const DEFAULT_FILTERS = {
  buyTicketOnline: {
    items: {
      ticketOnline: false,
      limousine: false,
    },
  },
  paymentMethods: {
    items: {
      operator: false,
      online: false,
      cash: false,
    },
  },
  // utilities
  facility: {
    items: {
      WFI: false,
      DHA: false,
      DVD: false,
      KHAN: false,
      NUOC: false,
      WC: false,
    },
  },
  service: {
    items: {
      TRANSFER: false,
      ARRIVE_TRANSFER: false,
      MEAL: false,
    },
  },
  boardingPoints: {
    items: [
      {
        key: 1,
        description: '83/16 Thoại Ngọc Hầu, P. Hòa Thạnh...',
        selected: false,
      },
      {
        key: 2,
        description: '83/16 Thoại Ngọc Hầu, P. Hòa Thạnh...',
        selected: false,
      },
      {
        key: 3,
        description: '83/16 Thoại Ngọc Hầu, P. Hòa Thạnh...',
        selected: false,
      },
      {
        key: 4,
        description: '83/16 Thoại Ngọc Hầu, P. Hòa Thạnh...',
        selected: false,
      },
      {
        key: 5,
        description: '83/16 Thoại Ngọc Hầu, P. Hòa Thạnh...',
        selected: false,
      },
    ],
  },
  droppingPoints: {
    title: 'Chọn điểm trả',
    route: 'Đến Tp.Hồ Chí Minh ',
    description: 'Nhấn để chọn một hoặc nhiều điểm',
    items: [
      {
        key: 1,
        description: 'Đồng đen',
        selected: false,
      },
      {
        key: 2,
        description: 'Đồng đen',
        selected: false,
      },
      {
        key: 3,
        description: 'Đồng đen',
        selected: false,
      },
      {
        key: 4,
        description: 'Đồng đen',
        selected: false,
      },
      {
        key: 5,
        description: 'Đồng đen',
        selected: false,
      },
    ],
  },
  seatAvailable: {
    filter: {
      subTitle: 'Các tuyến ngày này trống trung bình',
      min: 0,
      max: 50,
      range: true,
      step: 1,
      value: [0, 50],
    },
  },
  ticketPrice: {
    filter: {
      subTitle: 'Giá vé trung bình là',
      min: 0,
      max: 2000000,
      range: true,
      step: 5000,
      value: [0, 2000000],
      unit: 'đ',
    },
  },
  rating: {
    filter: {
      subTitle: 'Đánh giá trung bình là',
      min: 0,
      max: 5,
      range: true,
      step: 1,
      value: [0, 5],
      unit: 'sao',
    },
  },
  // danh sach nha xe
  operators: {
    items: {},
  },
  tempTotal: undefined,
}

const initState = {
  defaultFilters: DEFAULT_FILTERS,
  payloadFilter: {
    fetching: false,
    filters: DEFAULT_FILTERS,
    totalFilterApplied: 0,
  },
  infoScreenRoute: {
    dataLoaded: false,
    scrollY: 0,
  },
  payloadRequest: {
    isLoading: false,
    success: false,
  },
  payload: {
    status: ROUTE_STATUS.NORMAL,
    date: undefined,
    from: {},
    to: {},
    groups: {
      isLoading: false,
      error: undefined,
      total: undefined,
      preTotal: undefined,
      DEFAULT: {
        error: undefined,
        tickets: [],
        page: 1,
        pagesize: 20,
      },
    },
    suggestion: GROUPS,
  },
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_ROUTES: {
      let newState = dotProp(state)
        .set('payload', action.payload)
        .set('payloadFilter.filters', action.filters)
        .set('payload.groups.isLoading', true)
        .set('payload.status', ROUTE_STATUS.NORMAL)
        .value();
      if (action.filters === state.defaultFilters) {
        newState = dotProp(newState)
          .set('payloadFilter.totalFilterApplied', 0)
          .value();
      }
      Object.keys(INIT_GROUPS).forEach((suggestion) => {
        if (get(newState, `payload.groups.${suggestion}.tickets`)) {
          newState = dotProp(newState)
            .delete(`payload.groups.${suggestion}.tickets`)
            .delete(`payload.groups.${suggestion}.total`)
            .value();
        }
      });
      action.payload.suggestion.forEach((groupName) => {
        newState = dotProp(newState)
          .set(`payload.groups.${groupName}.isLoading`, true)
          .value();
      });
      return newState;
    }
    case GET_ROUTES_ERROR: {
      return dotProp(state)
        .set('payload.groups.isLoading', false)
        .set('payload.groups.error', action.error)
        .value();
    }
    case GET_ROUTE: {
      const newState = dotProp(state)
        .set(`payload.groups.${action.payload.filter.suggestion}.isLoading`, true)
        .value();
      return newState;
    }
    case GET_ROUTE_ERROR: {
      const newState = dotProp(state)
        .set(`payload.groups.${action.payload.filter.suggestion}.isLoading`, false)
        .set(`payload.groups.${action.payload.filter.suggestion}.error`, action.error)
        .value();
      return newState;
    }
    case GET_ROUTE_SUCCESS: {
      let newState = dotProp(state)
        .set(`payload.groups.${action.payload.filter.suggestion}.page`, action.payload.page)
        .set(`payload.groups.${action.payload.filter.suggestion}.pagesize`, action.payload.pagesize)
        .set(`payload.groups.${action.payload.filter.suggestion}.isLoading`, false)
        .set(`payload.groups.${action.payload.filter.suggestion}.error`, undefined)
        .value();

      if (action.payload.page === 1) {
        newState = dotProp.set(
          newState,
          `payload.groups.${action.payload.filter.suggestion}.tickets`,
          action.tickets,
        );
        newState = dotProp.set(
          newState,
          `payload.groups.${action.payload.filter.suggestion}.tickets`,
          action.tickets,
        );
      } else {
        const tickets = dotProp.get(
          newState,
          `payload.groups.${action.payload.filter.suggestion}.tickets`,
          [],
        );
        newState = dotProp.set(
          newState,
          `payload.groups.${action.payload.filter.suggestion}.tickets`,
          [...tickets, ...action.tickets],
        );
      }

      let isLoading = true;
      for (let i = 0; i < newState.payload.suggestion.length; i += 1) {
        if (newState.payload.groups[newState.payload.suggestion[i]].isLoading) {
          break;
        }
        if (newState.payload.groups[newState.payload.suggestion[i]].tickets.length) {
          isLoading = false;
          break;
        }
      }
      newState = dotProp(newState)
        .set('payload.groups.isLoading', isLoading)
        .value();
      if (action.area) {
        const { area } = action
        if (get(newState, 'payload.from.name')) {
          area.from.idUrl = get(newState, 'payload.from.idUrl')
        }
        if (get(newState, 'payload.to.name')) {
          area.to.idUrl = get(newState, 'payload.to.idUrl')
        }
        newState = dotProp(newState)
          .set('payload.from', area.from)
          .set('payload.to', area.to)
          .value()
      }
      return newState;
    }
    case GET_TOTAL_ROUTE_SUCCESS: {
      return dotProp(state)
        .set(
          `payload.groups.${action.payload.filter.suggestion}.total`,
          action.total,
        )
        .set(
          `payload.groups.${action.payload.filter.suggestion}.totalAvailableTrips`,
          action.totalAvailableTrips,
        )
        .value();
    }
    case UPDATE_STATE_REDUX: {
      return dotProp.set(state, action.path, action.data);
    }
    case GET_STATUS_ROUTE_SUCCESS: {
      let newState = state;
      if (action.totalTicket) {
        newState = dotProp(newState)
          .set('payload.groups.total', action.totalTicket)
          .set('payloadFilter.filters.tempTotal', action.totalTicket)
          .value();
      }
      if (!action.totalTicket && state.payloadFilter.totalFilterApplied) {
        newState = dotProp(newState)
          .set('state.payload.groups.preTotal', state.payload.groups.total)
          .set('payload.groups.total', 0)
          .value();
      }
      return dotProp(newState)
        .set('payload.status', action.status)
        .set('payload.groups.isLoading', false)
        .set('payload.groups.error', undefined)
        .value();
    }
    case GET_STATUS_ROUTE_ERROR: {
      return dotProp(state)
        .set('payload.groups.isLoading', false)
        .set('payload.groups.error', action.error)
        .value();
    }
    case GET_TOTAL_TRIP: {
      return dotProp(state)
        .set('payloadFilter.fetching', true)
        .value();
    }
    case GET_TOTAL_TRIP_SUCCESS: {
      return dotProp(state)
        .set('payloadFilter.filters.tempTotal', action.total)
        .set('payloadFilter.fetching', false)
        .value();
    }
    case POST_BUS_OPERATOR: {
      return dotProp.set(state, 'payloadRequest.isLoading', true);
    }
    case POST_BUS_OPERATOR_FAIL: {
      return dotProp(state)
        .set('payloadRequest.isLoading', false)
        .set('payloadRequest.success', false)
        .value();
    }
    case POST_BUS_OPERATOR_SUCCESS: {
      return dotProp(state)
        .set('payloadRequest.isLoading', false)
        .set('payloadRequest.success', true)
        .value();
    }
    case CLEAR_FILTER: {
      return dotProp(state)
        .set('payloadFilter.filters', state.defaultFilters)
        .set('payloadFilter.totalFilterApplied', 0)
        .value();
    }
    case GET_SEO_DATA_SUCCESS: {
      return dotProp(state)
        .set('defaultFilters.operators.items', cloneDeep({ ...action.data.seo.companies }))
        .set('payloadFilter.filters.operators.items', cloneDeep({ ...action.data.seo.companies }))
        .value();
    }
    case GET_SEO_COMPANIES_SUCCESS: {
      return dotProp(state)
        .set('defaultFilters.operators.items', cloneDeep({ ...action.companies }))
        .set('payloadFilter.filters.operators.items', cloneDeep({ ...action.companies }))
        .value();
    }
    default:
      return state;
  }
};
