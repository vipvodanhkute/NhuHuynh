import React from 'react';
import styled from 'styled-components';
import HeaderNew from 'vxrd/components/Layout.New/Header';
import FilterGroup from 'vxrd/components/Filter/FilterGroup';
import Button from 'vxrd/components/Antd/Button';
import Icon from 'vxrd/components/Antd/Icon';
import FilterItem from 'vxrd/components/Filter/FilterItem';
import Slider from 'vxrd/components/Antd/Slider';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pluralize from 'pluralize';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';
import MultipleSelectFilter from './MultipleSelectFilter';
import { getTotalTripWithFilter } from '../actions';
import { sendEventTracking } from '#/containers/Device/actions';
import {
  LIMOUSINE_FILTER,
  ONLINE_BOOKING_FILTER,
  FREE_WATER,
  WIFI_FILTER,
  AC_FILTER,
  TELEVISION,
  WET_TOWER,
  TOILET,
  RESERVED_MEAL,
  OPERATORS,
  AVAILABLE_SEAT,
  PRICE,
  RATING,
  CLOSE_FILTER,
  CLEAR_FILTER,
} from '#/containers/Route/constants';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow: hidden;
`;

const StyledFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 78px;
  width: 100%;
  text-align: center;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
`;
const StyledForm = styled.div`
  padding: 0px 36px 0px 36px;
  margin: 47px 0 78px 0;
  height: calc(100% - 126px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;
// const StyledFilterItem = styled.div`
//   display: flex;
//   flex-direction: row;
//   margin-bottom: 24px;
// `;
// const StyledFilterLabelWrapper = styled.div`
//   flex: 1;
// `;
// const StyledFilterLabel = styled.div`
//   font-family: 'Helvetica Neue, Light';
//   font-size: 19px;
//   margin-bottom: 10px;
// `;
// const StyledFilterSubLabel = styled.div`
//   font-family: 'Helvetica Neue, Light';
//   font-size: 14px;
// `;
const StyledViewAllButton = styled(Button)`
  &.ant-btn {
    font-size: 16px;
    padding: 0;
    width: fit-content;
  }
`;
const SlideFilterUnit = styled.span`
  vertical-align: ${props => (props.isSupUnit ? 'top' : 'initial')};
  font-size: ${props => (props.isSupUnit ? '14px' : 'inherit')};
`;
const SlideFilterDetails = styled.div`
  font-size: 19px;
  color: #484848;
  margin-bottom: 16px;
`;
class FilterScreen extends React.Component {
  constructor(props) {
    super(props);
    const userFilter = this.props.filters;
    this.state = {
      buyTicketOnline: {
        ...userFilter.buyTicketOnline,
      },
      // paymentMethods: {
      //   ...userFilter.paymentMethods,
      //   title: props.intl.formatMessage({ id: 'route.filter.paymentMethods' }),
      // },
      seatAvailable: {
        ...userFilter.seatAvailable,
        title: props.intl.formatMessage({ id: 'route.filter.seatAvailable' }),
        filter: {
          ...userFilter.seatAvailable.filter,
          unit: props.intl.formatMessage({ id: 'route.filter.seatAvailable.unit' }),
        },
      },
      ticketPrice: {
        ...userFilter.ticketPrice,
        title: props.intl.formatMessage({ id: 'route.filter.ticketPrice' }),
        filter: {
          ...userFilter.ticketPrice.filter,
          unit: props.intl.formatMessage({ id: 'route.filter.ticketPrice.unit' }),
        },
      },
      facility: {
        ...userFilter.facility,
        itemsRender: Object.keys(userFilter.facility.items),
        title: props.intl.formatMessage({ id: 'route.filter.facility' }),
        label: props.intl.formatMessage({ id: 'route.filter.facility.label' }),
      },
      rating: {
        ...userFilter.rating,
        title: props.intl.formatMessage({ id: 'route.filter.rating' }),
        filter: {
          ...userFilter.rating.filter,
          unit: props.intl.formatMessage({ id: 'route.filter.rating.unit' }),
        },
      },
      operators: {
        ...userFilter.operators,
        itemsRender: Object.keys(userFilter.operators.items),
        title: props.intl.formatMessage({ id: 'route.filter.operators' }),
        isShowAllData: false,
      },
      // service: {
      //   ...userFilter.service,
      //   itemsRender: Object.keys(userFilter.service.items),
      //   title: props.intl.formatMessage({ id: 'route.filter.service' }),
      //   isShowAllData: false,
      // },
      // boardingPoints: {
      //   ...userFilter.boardingPoints,
      //   label: props.intl.formatMessage({ id: 'reoute.filter.boardingPoints.label' }),
      //   hint: props.intl.formatMessage({ id: 'route.filter.hintBoardingPoint' }),
      // },
      // droppingPoints: {
      //   ...userFilter.droppingPoints,
      //   label: props.intl.formatMessage({ id: 'reoute.filter.droppingPoints.label' }),
      //   hint: props.intl.formatMessage({ id: 'route.filter.hintDroppingPoint' }),
      // },
      isShowMultipleSelect: false,
      multipleSelectFilters: {},
      totalTrips: props.totalTrips || props.filters.tempTotal || 0,
    };
    this.handleOnChangeFilter = debounce(() => {
      this.props.getTotalTripWithFilter(
        { ...this.props.payload, suggestion: undefined },
        this.state,
      );
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.filters.tempTotal !== this.state.totalTrips
      && nextProps.filters.tempTotal !== undefined
    ) {
      this.setState({
        totalTrips: nextProps.filters.tempTotal,
      });
    }
  }

  generateMultipleSelectionHint = (items) => {
    const selectedItems = items.reduce(
      ({ total, desc }, item) => {
        if (item.selected) {
          let newDesc = desc;
          const newTotal = total + 1;
          if (newTotal === 1) {
            newDesc += `${item.description}`;
          } else if (newTotal <= 3) {
            newDesc += `, ${item.description}`;
          }
          return {
            total: newTotal,
            desc: newDesc,
          };
        }
        return { total, desc };
      },
      { total: 0, desc: '' },
    );
    if (selectedItems.total > 3) {
      selectedItems.desc += `, + ${selectedItems.total - 3}`;
    }
    return selectedItems;
  };

  onSubmitSelectedBoardingPoints = async (items) => {
    if (!items) {
      this.setState({
        isShowMultipleSelect: false,
      });
      return;
    }
    const boardingPoints = cloneDeep(this.state.boardingPoints);
    const {
      intl: { formatMessage },
    } = this.props;
    const selectedItems = this.generateMultipleSelectionHint(items);
    if (selectedItems.total > 0) {
      boardingPoints.hint = `Đã chọn: ${selectedItems.desc}`;
    } else {
      boardingPoints.hint = formatMessage({ id: 'route.filter.hintBoardingPoint' });
    }
    this.setState(
      {
        boardingPoints: {
          ...boardingPoints,
          items,
        },
        isShowMultipleSelect: false,
      },
      () => {},
    );
  };

  onSubmitSelectedDroppingPoints = async (items) => {
    if (!items) {
      this.setState({
        isShowMultipleSelect: false,
      });
      return;
    }
    const droppingPoints = cloneDeep(this.state.droppingPoints);
    const {
      intl: { formatMessage },
    } = this.props;
    const selectedItems = this.generateMultipleSelectionHint(items);
    if (selectedItems.total > 0) {
      droppingPoints.hint = `Đã chọn: ${selectedItems.desc}`;
    } else {
      droppingPoints.hint = formatMessage({ id: 'route.filter.hintDroppingPoint' });
    }
    this.setState(
      {
        droppingPoints: {
          ...droppingPoints,
          items,
        },
        isShowMultipleSelect: false,
      },
      () => {
        this.handleOnChangeFilter();
      },
    );
  };

  onSubmitSelectedUtilities = async (items) => {
    if (!items) {
      this.setState({
        isShowMultipleSelect: false,
      });
      return;
    }
    const { facility } = this.state;
    const newFacility = cloneDeep(facility);
    items.forEach((item) => {
      newFacility.items[item.name] = item.selected;
    });
    this.setState(
      {
        facility: newFacility,
        isShowMultipleSelect: false,
      },
      () => {
        this.handleOnChangeFilter();
      },
    );
  };

  onSubmitSelectedOperators = async (items) => {
    if (!items) {
      this.setState({
        isShowMultipleSelect: false,
      });
      return;
    }
    const { operators } = this.state;
    const newOperators = cloneDeep(operators);
    items.forEach((item) => {
      newOperators.items[item.name].checked = item.selected;
    });
    this.setState(
      {
        operators: newOperators,
        isShowMultipleSelect: false,
      },
      () => {
        this.handleOnChangeFilter();
      },
    );
  };

  // Get boarding points and set data source to multiple selection screen
  viewAllBoardingPoints = async () => {
    const { boardingPoints } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    boardingPoints.onSubmit = this.onSubmitSelectedBoardingPoints;
    const newBoardingPoints = cloneDeep(boardingPoints);
    await this.setState({
      multipleSelectFilters: {
        ...newBoardingPoints,
        title: formatMessage({ id: 'route.filter.selectBoardingPoint' }),
        route: 'Từ Tp.Hồ Chí Minh',
        description: formatMessage({ id: 'route.filter.selectBoardingPointDesc' }),
      },
      isShowMultipleSelect: true,
    });
  };

  // Get dropping points and set data source to multiple selection screen
  viewAllDroppingPoints = async () => {
    const { droppingPoints } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    droppingPoints.onSubmit = this.onSubmitSelectedDroppingPoints;
    const newDroppingPoints = cloneDeep(droppingPoints);
    await this.setState({
      multipleSelectFilters: {
        ...newDroppingPoints,
        title: formatMessage({ id: 'route.filter.selectDroppingPoint' }),
        route: 'Tại Tp.Hồ Chí Minh',
        description: formatMessage({ id: 'route.filter.selectDroppingPointDesc' }),
      },
      isShowMultipleSelect: true,
    });
  };

  viewAllUtilities = async () => {
    const { facility } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    facility.onSubmit = this.onSubmitSelectedUtilities;
    const arrItems = facility.itemsRender.map(key => ({
      name: key,
      label: formatMessage({ id: `route.filter.facility.${key}.label` }),
      // subLabel: formatMessage({ id: `route.filter.facility.${key}.subLabel` }),
      selected: facility.items[key],
    }));
    await this.setState({
      multipleSelectFilters: {
        onSubmit: this.onSubmitSelectedUtilities,
        items: arrItems,
        title: facility.title,
        label: formatMessage({ id: 'route.filter.facility.label' }),
        description: formatMessage({ id: 'route.filter.facility.description' }),
      },
      isShowMultipleSelect: true,
    });
  };

  viewAllOperators = async () => {
    const { operators } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    operators.onSubmit = this.onSubmitSelectedOperators;
    const arrItems = operators.itemsRender.map(key => ({
      name: key,
      label: operators.items[key].name,
      // subLabel: formatMessage({ id: `route.filter.facility.${key}.subLabel` }),
      selected: operators.items[key].checked,
    }));
    await this.setState({
      multipleSelectFilters: {
        onSubmit: this.onSubmitSelectedOperators,
        items: arrItems,
        title: operators.title,
        label: formatMessage({ id: 'route.filter.facility.label' }),
        description: formatMessage({ id: 'route.filter.facility.description' }),
      },
      isShowMultipleSelect: true,
    });
  };

  calculateFilterApplied = (oldFilter, newFilter) => {
    let count = 0;
    Object.keys(oldFilter.buyTicketOnline.items).forEach((key) => {
      if (oldFilter.buyTicketOnline.items[key] !== newFilter.buyTicketOnline.items[key]) {
        count += 1;
      }
    });
    // if (!isEqual(oldFilter.paymentMethods.items, newFilter.paymentMethods.items)) {
    //   count += 1;
    // }
    if (!isEqual(oldFilter.facility.items, newFilter.facility.items)) {
      count += 1;
    }
    // if (!isEqual(oldFilter.service.items, newFilter.service.items)) {
    //   count += 1;
    // }
    // if (!isEqual(oldFilter.boardingPoints.items, newFilter.boardingPoints.items)) {
    //   count += 1;
    // }
    // if (!isEqual(oldFilter.droppingPoints.items, newFilter.droppingPoints.items)) {
    //   count += 1;
    // }
    if (!isEqual(oldFilter.seatAvailable.filter.value, newFilter.seatAvailable.filter.value)) {
      count += 1;
    }
    if (!isEqual(oldFilter.ticketPrice.filter.value, newFilter.ticketPrice.filter.value)) {
      count += 1;
    }
    if (!isEqual(oldFilter.rating.filter.value, newFilter.rating.filter.value)) {
      count += 1;
    }
    if (!isEqual(oldFilter.operators.items, newFilter.operators.items)) {
      count += 1;
    }
    return count;
  };

  // call when submit filter
  handleOnSubmit = () => {
    // Calculate number of filters changed
    const oldFilter = this.props.defaultFilters;
    const {
      buyTicketOnline,
      paymentMethods,
      facility,
      service,
      operators,
      boardingPoints,
      droppingPoints,
      seatAvailable,
      ticketPrice,
      rating,
    } = this.state;
    const newFilter = {
      buyTicketOnline,
      paymentMethods,
      facility,
      service,
      operators,
      boardingPoints,
      droppingPoints,
      seatAvailable,
      ticketPrice,
      rating,
    };
    const totalFilterApplied = this.calculateFilterApplied(oldFilter, newFilter);
    this.props.onChange({
      totalFilterApplied,
      filters: newFilter,
    });
  };

  handleOnClearFilter = () => {
    this.props.sendEventTracking({ type: CLEAR_FILTER });
    const {
      buyTicketOnline,
      paymentMethods,
      facility,
      service,
      operators,
      seatAvailable,
      ticketPrice,
      rating,
      boardingPoints,
      droppingPoints,
    } = cloneDeep(this.props.defaultFilters);
    this.setState(
      preState => ({
        buyTicketOnline: {
          ...preState.buyTicketOnline,
          items: buyTicketOnline.items,
        },
        paymentMethods: {
          ...preState.paymentMethods,
          items: paymentMethods.items,
        },
        facility: {
          ...preState.facility,
          items: facility.items,
        },
        service: {
          ...preState.service,
          items: service.items,
        },
        operators: {
          ...preState.operators,
          items: operators.items,
        },
        seatAvailable: {
          ...preState.seatAvailable,
          filter: seatAvailable.filter,
        },
        ticketPrice: {
          ...preState.ticketPrice,
          filter: ticketPrice.filter,
        },
        rating: {
          ...preState.rating,
          filter: rating.filter,
        },
        boardingPoints: {
          ...preState.boardingPoints,
          items: boardingPoints.items,
        },
        droppingPoints: {
          ...preState.droppingPoints,
          items: droppingPoints.items,
        },
      }),
      () => this.handleOnChangeFilter(),
    );
  };

  handleOnClose = () => {
    this.props.sendEventTracking({ type: CLOSE_FILTER });
    this.props.onClose();
  };

  // handleOnChangeFilter = () => {
  //   // TO DO
  //   // Get total trips from API
  //   this.props.getTotalTripWithFilter({
  // ...this.props.payload, suggestion: undefined }, this.state);
  // };

  // Key: name of filter group
  handleOnChangeFilterItem = (parentKey, key, value, isObject) => {
    const { [parentKey]: preFilterGroup } = this.state;
    const newFilterGroup = cloneDeep(preFilterGroup);

    this.setState(
      {
        [parentKey]: {
          ...newFilterGroup,
          items: {
            ...newFilterGroup.items,
            [key]: isObject ? { ...newFilterGroup.items[key], checked: value } : value,
          },
        },
      },
      () => {
        this.handleOnChangeFilter();
      },
    );

    if (value) {
      switch (key) {
        case 'ticketOnline':
          this.props.sendEventTracking({ type: ONLINE_BOOKING_FILTER });
          break;
        case 'limousine':
          this.props.sendEventTracking({ type: LIMOUSINE_FILTER });
          break;
        case 'NUOC':
          this.props.sendEventTracking({ type: FREE_WATER });
          break;
        case 'WIF':
          this.props.sendEventTracking({ type: WIFI_FILTER });
          break;
        case 'DHA':
          this.props.sendEventTracking({ type: AC_FILTER });
          break;
        case 'DVD':
          this.props.sendEventTracking({ type: TELEVISION });
          break;
        case 'WC':
          this.props.sendEventTracking({ type: TOILET });
          break;
        case 'KHAN':
          this.props.sendEventTracking({ type: WET_TOWER });
          break;
        case 'MEAL':
          this.props.sendEventTracking({ type: RESERVED_MEAL });
          break;
        case 'operators':
          this.props.sendEventTracking({ type: OPERATORS });
          break;
        default:
          break;
      }
    }
  };

  handleOnChangeSeatAvailable = (e) => {
    this.props.sendEventTracking({ type: AVAILABLE_SEAT });
    const { seatAvailable } = this.state;
    this.setState(
      {
        seatAvailable: {
          ...seatAvailable,
          filter: {
            ...seatAvailable.filter,
            value: e,
          },
        },
      },
      () => {
        this.handleOnChangeFilter();
      },
    );
  };

  handleOnChangeTicketPrice = (e) => {
    this.props.sendEventTracking({ type: PRICE });
    const { ticketPrice } = this.state;
    this.setState(
      {
        ticketPrice: {
          ...ticketPrice,
          filter: {
            ...ticketPrice.filter,
            value: e,
          },
        },
      },
      () => {
        this.handleOnChangeFilter();
      },
    );
  };

  handleOnChangeRating = (e) => {
    this.props.sendEventTracking({ type: RATING });
    const { rating } = this.state;
    this.setState(
      {
        rating: {
          ...rating,
          filter: {
            ...rating.filter,
            value: e,
          },
        },
      },
      () => {
        this.handleOnChangeFilter();
      },
    );
  };

  renderUtilities = () => {
    const { facility } = this.state;
    const { itemsRender } = facility;
    const {
      intl: { formatMessage },
    } = this.props;
    const { length } = itemsRender;
    if (length > 5) {
      return (
        <>
          {itemsRender.slice(0, 3).map(key => (
            <FilterItem
              item={{
                name: key,
                label: formatMessage({ id: `route.filter.facility.${key}.label` }),
                // subLabel: formatMessage({ id: `route.filter.facility.${key}.subLabel` }),
                checked: facility.items[key],
              }}
              key={key}
              type="checkbox"
              onChange={value => this.handleOnChangeFilterItem('facility', key, value)}
            />
          ))}
          <StyledViewAllButton label="true" onClick={this.viewAllUtilities}>
            {formatMessage({ id: 'route.filter.seeAll' })}
          </StyledViewAllButton>
        </>
      );
    }
    return itemsRender.map(key => (
      <FilterItem
        item={{
          name: key,
          label: formatMessage({ id: `route.filter.facility.${key}.label` }),
          // subLabel: formatMessage({ id: `route.filter.facility.${key}.subLabel` }),
          checked: facility.items[key],
        }}
        key={key}
        type="checkbox"
        onChange={value => this.handleOnChangeFilterItem('facility', key, value)}
      />
    ));
  };
  // Add-on Service

  renderService = () => {
    const { service } = this.state;
    const { isShowAllData, itemsRender } = service;
    const {
      intl: { formatMessage },
    } = this.props;
    const { length } = itemsRender;
    if (length > 5) {
      return (
        <>
          {itemsRender.slice(0, 2).map(key => (
            <FilterItem
              item={{
                name: key,
                label: formatMessage({ id: `route.filter.service.${key}.label` }),
                subLabel: formatMessage({ id: `route.filter.service.${key}.subLabel` }),
                checked: service.items[key],
              }}
              key={key}
              type="checkbox"
              onChange={value => this.handleOnChangeFilterItem('service', key, value)}
            />
          ))}
          {isShowAllData
            && itemsRender.slice(3).map(key => (
              <FilterItem
                item={{
                  label: formatMessage({ id: `route.filter.service.${key}.label` }),
                  subLabel: formatMessage({ id: `route.filter.service.${key}.subLabel` }),
                  checked: service.items[key],
                }}
                key={key}
                type="checkbox"
                onChange={value => this.handleOnChangeFilterItem('service', key, value)}
              />
            ))}
          <StyledViewAllButton
            label
            onClick={() => {
              this.setState({
                service: {
                  ...service,
                  isShowAllData: !isShowAllData,
                },
              });
            }}
          >
            {!isShowAllData
              ? formatMessage({ id: 'route.filter.seeAll' })
              : formatMessage({ id: 'route.filter.collapse' })}
          </StyledViewAllButton>
        </>
      );
    }

    return itemsRender.map(key => (
      <FilterItem
        item={{
          label: formatMessage({ id: `route.filter.service.${key}.label` }),
          subLabel: formatMessage({ id: `route.filter.service.${key}.subLabel` }),
          checked: service.items[key],
        }}
        key={key}
        type="checkbox"
        onChange={value => this.handleOnChangeFilterItem('service', key, value)}
      />
    ));
  };

  renderOperators = () => {
    const {
      operators: { itemsRender, items },
    } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    const { length } = itemsRender;
    if (length > 5) {
      return (
        <>
          {itemsRender.slice(0, 3).map(key => (
            <FilterItem
              item={{
                name: items[key].id,
                label: items[key].name,
                checked: items[key].checked,
              }}
              key={items[key].id}
              type="checkbox"
              onChange={value => this.handleOnChangeFilterItem('operators', key, value, true)}
            />
          ))}
          <StyledViewAllButton label="true" onClick={this.viewAllOperators}>
            {formatMessage({ id: 'route.filter.seeAll' })}
          </StyledViewAllButton>
        </>
      );
    }
    return itemsRender.map(key => (
      <FilterItem
        item={{
          name: items[key].id,
          label: items[key].name,
          checked: items[key].checked,
        }}
        key={items[key].id}
        type="checkbox"
        onChange={value => this.handleOnChangeFilterItem('operators', key, value, true)}
      />
    ));
  };

  formatterNumber = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  render() {
    const {
      buyTicketOnline,
      // paymentMethods,
      facility,
      // service,
      seatAvailable,
      ticketPrice,
      rating,
      isShowMultipleSelect,
      multipleSelectFilters,
      operators,
      // boardingPoints,
      // droppingPoints,
      totalTrips,
    } = this.state;
    const {
      intl: { formatMessage },
      fetching: loading,
    } = this.props;
    return (
      <Wrapper>
        <HeaderNew fixed>
          <HeaderNew.Left>
            <Button label="true" onClick={this.handleOnClearFilter}>
              {formatMessage({ id: 'route.filter.clearFilter' })}
            </Button>
          </HeaderNew.Left>
          <HeaderNew.Body style={{ height: '200vh' }}>
            <span>{formatMessage({ id: 'route.filter.filterText' })}</span>
          </HeaderNew.Body>
          <HeaderNew.Right>
            <Button label="true" onClick={this.handleOnClose}>
              <Icon type="close" />
            </Button>
          </HeaderNew.Right>
        </HeaderNew>
        <StyledForm>
          <FilterGroup>
            <FilterGroup.Title>{buyTicketOnline.title || ''}</FilterGroup.Title>
            <FilterGroup.Content>
              {Object.keys(buyTicketOnline.items)
                .sort()
                .map(key => (
                  <FilterItem
                    item={{
                      label: formatMessage({ id: `route.filter.buyTicketOnline.${key}.label` }),
                      subLabel: formatMessage({
                        id: `route.filter.buyTicketOnline.${key}.subLabel`,
                      }),
                      checked: buyTicketOnline.items[key],
                    }}
                    key={key}
                    type="switch"
                    onChange={value => this.handleOnChangeFilterItem('buyTicketOnline', key, value)}
                  />
                ))}
            </FilterGroup.Content>
          </FilterGroup>
          {/* <FilterGroup>
            <FilterGroup.Title>
              {paymentMethods.title}
            </FilterGroup.Title>
            <FilterGroup.Content>
              {Object.keys(paymentMethods.items).sort().map(key => (
                <FilterItem
                  item={{
                    label: formatMessage({ id: `route.filter.paymentMethods.${key}.label` }),
                    subLabel: formatMessage({ id: `route.filter.paymentMethods.${key}.subLabel` }),
                    checked: paymentMethods.items[key],
                  }}
                  key={key}
                  type="checkbox"
                  onChange={value => this.handleOnChangeFilterItem('paymentMethods', key, value)}
                />
              ))}
            </FilterGroup.Content>
          </FilterGroup> */}
          <FilterGroup>
            <FilterGroup.Title>{seatAvailable.title || ''}</FilterGroup.Title>
            <FilterGroup.Content>
              <SlideFilterDetails>
                {this.formatterNumber(seatAvailable.filter.value[0])}
                {seatAvailable.filter.unit && (
                  <SlideFilterUnit isSupUnit={seatAvailable.filter.isSupUnit}>
                    {' '}
                    {pluralize(seatAvailable.filter.unit, seatAvailable.filter.value[0])}
                  </SlideFilterUnit>
                  // eslint-disable-next-line react/jsx-one-expression-per-line
                )}
                &nbsp;-&nbsp;
                {this.formatterNumber(seatAvailable.filter.value[1])}
                {seatAvailable.filter.unit && (
                  <SlideFilterUnit isSupUnit={seatAvailable.filter.isSupUnit}>
                    {' '}
                    {pluralize(seatAvailable.filter.unit, seatAvailable.filter.value[1])}
                  </SlideFilterUnit>
                )}
              </SlideFilterDetails>
              <Slider
                range={seatAvailable.filter.range}
                defaultValue={seatAvailable.filter.value}
                value={seatAvailable.filter.value}
                step={seatAvailable.filter.step}
                min={seatAvailable.filter.min || 0}
                max={seatAvailable.filter.max || 100}
                onChange={this.handleOnChangeSeatAvailable}
              />
            </FilterGroup.Content>
          </FilterGroup>
          <FilterGroup>
            <FilterGroup.Title>{ticketPrice.title || ''}</FilterGroup.Title>
            <FilterGroup.Content>
              <SlideFilterDetails>
                {this.formatterNumber(ticketPrice.filter.value[0])}
                {ticketPrice.filter.unit && (
                  <SlideFilterUnit isSupUnit={ticketPrice.filter.isSupUnit}>
                    {' '}
                    {pluralize(ticketPrice.filter.unit, ticketPrice.filter.value[0])}
                  </SlideFilterUnit>
                  // eslint-disable-next-line react/jsx-one-expression-per-line
                )}
                &nbsp;-&nbsp;
                {this.formatterNumber(ticketPrice.filter.value[1])}
                {ticketPrice.filter.unit && (
                  <SlideFilterUnit isSupUnit={ticketPrice.filter.isSupUnit}>
                    {' '}
                    {pluralize(ticketPrice.filter.unit, ticketPrice.filter.value[1])}
                  </SlideFilterUnit>
                )}
              </SlideFilterDetails>
              <Slider
                range={ticketPrice.filter.range}
                defaultValue={ticketPrice.filter.value}
                value={ticketPrice.filter.value}
                step={ticketPrice.filter.step}
                min={ticketPrice.filter.min || 0}
                max={ticketPrice.filter.max || 100}
                onChange={this.handleOnChangeTicketPrice}
              />
            </FilterGroup.Content>
          </FilterGroup>
          <FilterGroup>
            <FilterGroup.Title>{rating.title || ''}</FilterGroup.Title>
            <FilterGroup.Content>
              <SlideFilterDetails>
                {this.formatterNumber(rating.filter.value[0])}
                {rating.filter.unit && (
                  <SlideFilterUnit isSupUnit={rating.filter.isSupUnit}>
                    {' '}
                    {rating.filter.unit}
                  </SlideFilterUnit>
                  // eslint-disable-next-line react/jsx-one-expression-per-line
                )}
                &nbsp;-&nbsp;
                {this.formatterNumber(rating.filter.value[1])}
                {rating.filter.unit && (
                  <SlideFilterUnit isSupUnit={rating.filter.isSupUnit}>
                    {' '}
                    {rating.filter.unit}
                  </SlideFilterUnit>
                )}
              </SlideFilterDetails>
              <Slider
                range={rating.filter.range}
                defaultValue={rating.filter.value}
                value={rating.filter.value}
                step={rating.filter.step}
                min={rating.filter.min || 0}
                max={rating.filter.max || 5}
                onChange={this.handleOnChangeRating}
              />
            </FilterGroup.Content>
          </FilterGroup>
          {/* <FilterGroup>
            <FilterGroup.Title>Điểm đón trả</FilterGroup.Title>
            <FilterGroup.Content>
              <StyledFilterItem>
                <StyledFilterLabelWrapper>
                  <StyledFilterLabel>
                    {formatMessage({ id: 'route.filter.boardingPoint' })}
                  </StyledFilterLabel>
                  <StyledFilterSubLabel>{boardingPoints.hint}</StyledFilterSubLabel>
                </StyledFilterLabelWrapper>
                <Button
                  label="true"
                  style={{
                    alignSelf: 'center',
                    fontWeight: 500,
                  }}
                  onClick={this.viewAllBoardingPoints}
                >
                  {formatMessage({ id: 'route.filter.seeAll' })}
                </Button>
              </StyledFilterItem>
              <StyledFilterItem>
                <StyledFilterLabelWrapper>
                  <StyledFilterLabel>
                    {formatMessage({ id: 'route.filter.droppingPoint' })}
                  </StyledFilterLabel>
                  <StyledFilterSubLabel>{droppingPoints.hint}</StyledFilterSubLabel>
                </StyledFilterLabelWrapper>
                <Button
                  label="true"
                  style={{
                    alignSelf: 'center',
                    fontWeight: 500,
                  }}
                  onClick={this.viewAllDroppingPoints}
                >
                  {formatMessage({ id: 'route.filter.seeAll' })}
                </Button>
              </StyledFilterItem>
            </FilterGroup.Content>
          </FilterGroup> */}
          <FilterGroup>
            <FilterGroup.Title>{facility.title || ''}</FilterGroup.Title>
            <FilterGroup.Content>{this.renderUtilities()}</FilterGroup.Content>
          </FilterGroup>
          {!!operators.itemsRender.length && (
            <FilterGroup>
              <FilterGroup.Title>{operators.title || ''}</FilterGroup.Title>
              <FilterGroup.Content>{this.renderOperators()}</FilterGroup.Content>
            </FilterGroup>
          )}

          {/* <FilterGroup>
            <FilterGroup.Title>{service.title || ''}</FilterGroup.Title>
            <FilterGroup.Content>{this.renderService()}</FilterGroup.Content>
          </FilterGroup> */}
        </StyledForm>
        <StyledFooter>
          <Button
            type="primary"
            style={{
              width: '100%',
              height: '100%',
              fontSize: '16px',
            }}
            loading={loading}
            onClick={this.handleOnSubmit}
          >
            {formatMessage(
              { id: 'route.filter.selectXItems' },
              {
                count: `${totalTrips} chuyến`,
                countEn: pluralize('trip', totalTrips, true),
              },
            )}
          </Button>
        </StyledFooter>
        {isShowMultipleSelect && <MultipleSelectFilter {...multipleSelectFilters} />}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  payload: state.routeReducer.payload,
  filters: state.routeReducer.payloadFilter.filters,
  fetching: state.routeReducer.payloadFilter.fetching,
  defaultFilters: state.routeReducer.defaultFilters,
});

const mapDispatchToProps = dispatch => ({
  getTotalTripWithFilter: bindActionCreators(getTotalTripWithFilter, dispatch),
  sendEventTracking: bindActionCreators(sendEventTracking, dispatch),
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FilterScreen),
);
