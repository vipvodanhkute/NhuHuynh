import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { search } from '#/utils/searchUtils';

import moment from 'moment';
import { payloadToQuery } from '#/utils/pathUtils';
import map from 'lodash.map';
import groupBy from 'lodash.groupby';
import RecommendArea from '#/static/json/recommend_area'
import { DesktopSearchWidget as SearchWidget, VXRSelect } from 'vxrd';
import { LANG } from '#/utils/constants';

const { Option, OptionGroup } = VXRSelect;

const compareFunction = (currentValue, optionValue) => {
  if (!currentValue || !optionValue) {
    return currentValue === optionValue;
  }
  return JSON.stringify(currentValue) === JSON.stringify(optionValue);
}

const KEY_CODES = {
  TAB: 9,
  DOWN: 40,
  UP: 38,
}

const categoryMap = {
  [LANG.VN]: {
    1: 'Tỉnh - Thành Phố',
    2: 'Quận - Huyện',
    3: 'Phường - Xã',
    4: 'Sân bay',
    5: 'Bến xe',
    6: 'Điểm dừng phổ biến',
  },
  [LANG.EN]: {
    1: 'States - Cities',
    2: 'Districts',
    3: 'Wards',
    4: 'Airport',
    5: 'Bus station',
    6: 'Popular Place',
  },

}

const SCROLL_TOP_OFFSET = 100;

class SearchWidgetContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      from: null,
      to: null,
      date: null,
      dataSourceFromInput: RecommendArea,
      dataSourceToInput: RecommendArea,
      openFromInput: false,
      openToInput: false,
      isOpenDateDropdown: false,
      isLoading: false,
    }
    this.onSearchFromInput = debounce(this.onSearchFromInput, 300).bind(this);
    this.onSearchToInput = debounce(this.onSearchToInput, 300).bind(this);
  }

  onSearchFromInput = (value) => {
    this.setState({
      dataSourceFromInput: value ? search(value) : RecommendArea,
      from: null,
    });
  }

  onSearchToInput = (value) => {
    this.setState({
      dataSourceToInput: value ? search(value) : RecommendArea,
      to: null,
    });
  }

  onSelectFromInput = (value) => {
    this.setState({
      from: value,
      openFromInput: false,
    }, () => {
      this.focusToInput()
    });
  }


  onSelectToInput = (value) => {
    this.setState({
      to: value,
      openToInput: false,
    }, () => {
      this.focusDateInput();
    });
  }

  focusFromInput = () => {
    setTimeout(() => {
      this.searchWidget.fromRef.inputRef.focus();
    }, 0)
  }

  focusToInput = () => {
    setTimeout(() => {
      this.searchWidget.toRef.inputRef.focus();
    }, 0)
  }

  focusDateInput = () => {
    setTimeout(() => {
      this.searchWidget.dateRef.input.focus();
    }, 0)
  }

  onBlurFromInput = () => {
    this.setState({
      openFromInput: false,
    });
  }

  onBlurToInput = () => {
    this.setState({
      openToInput: false,
    });
  }

  getNextValue = (dataSource, value, keyCode) => {
    const groupArray = Object.values(groupBy(dataSource || [], item => item.category))
      .reduce((result, array) => result.concat(array || []), []);
    let currentValueIndex = groupArray.findIndex(option => compareFunction(option, value));
    if (keyCode === KEY_CODES.UP) {
      currentValueIndex -= 1;
    } else {
      currentValueIndex += 1;
    }
    if (currentValueIndex < 0) {
      return groupArray[groupArray.length - 1] || null;
    }
    if (currentValueIndex >= groupArray.length) {
      return groupArray[0] || null;
    }
    return groupArray[currentValueIndex] || null;
  }

  onKeyDownFromInput = (e) => {
    const { dataSourceFromInput, from } = this.state;
    switch (e.keyCode) {
      case KEY_CODES.TAB: {
        this.setState(state => ({
          from: state.from || state.dataSourceFromInput[0] || null,
          openFromInput: false,
        }));
        break;
      }
      case KEY_CODES.DOWN:
      case KEY_CODES.UP: {
        e.preventDefault();
        const value = this.getNextValue(dataSourceFromInput, from, e.keyCode);
        this.setState({
          from: value,
        });
        break;
      }
      default:
        break;
    }
  }

  onKeyDownToInput = (e) => {
    const { dataSourceToInput, to } = this.state;
    switch (e.keyCode) {
      case KEY_CODES.TAB: {
        this.setState(state => ({
          to: state.to || state.dataSourceToInput[0] || null,
          openToInput: false,
        }));
        break;
      }
      case KEY_CODES.DOWN:
      case KEY_CODES.UP: {
        e.preventDefault();
        const value = this.getNextValue(dataSourceToInput, to, e.keyCode);
        this.setState({
          to: value,
        });
        break;
      }
      default:
        break;
    }
  }

  onFocusDateInput = (e) => {
    this.setState({
      isOpenDateDropdown: true,
    });
    this.scrollToTargetAdjusted(e.target);
  }

  onDateChange = (date) => {
    this.setState({
      date,
      isOpenDateDropdown: false,
    }, () => {
      this.onSearchClick();
    });
  }

  validate = () => {
    const { from, to, date } = this.state;
    let rs = true;
    if (!from) {
      rs = false;

      this.focusFromInput();
    } else if (!to) {
      rs = false;
      this.focusToInput();
    } else if (!date) {
      rs = false;
      this.focusDateInput()
    }
    return rs;
  }

  onSearchClick = () => {
    const { from, to, date } = this.state;
    const { locale } = this.props;
    const payload = {
      from,
      to,
      date,
      lang: locale,
    }
    if (this.validate()) {
      this.setState({ isLoading: true })
      const query = payloadToQuery(payload);
      return this.props.onSubmit(query);
    }
    return this.props.onSubmit(null)
  }

  onFocusFromInput = (e) => {
    e.target.select();
    this.setState({
      openFromInput: true,
    })
    this.scrollToTargetAdjusted(e.target);
  }

  onFocusToInput = (e) => {
    e.target.select();
    this.setState({
      openToInput: true,
    })
    this.scrollToTargetAdjusted(e.target);
  }

  onKeyDownDateInput = (e) => {
    if (e.keyCode === KEY_CODES.TAB) {
      this.setState({
        date: moment(),
        isOpenDateDropdown: false,
      }, () => {
        this.onSearchClick();
      });
    }
  }

  onSwap = () => {
    this.setState(state => ({
      from: state.to,
      to: state.from,
    }));
  }

  scrollToTargetAdjusted = (element) => {
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - SCROLL_TOP_OFFSET;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  renderOptions = (dataSource) => {
    const { locale } = this.props;
    return map(groupBy(dataSource || [], item => item.category),
      (values, key) => {
        const name = categoryMap[locale][key];
        return (
          <OptionGroup key={key} name={name}>
            {values.map(option => <Option key={JSON.stringify(option)} option={option} />)}
          </OptionGroup>
        )
      })
  }

  render() {
    const {
      isLoading, openFromInput, openToInput, from, to,
      dataSourceFromInput, dataSourceToInput, date, isOpenDateDropdown,
    } = this.state;
    const { intl, size } = this.props;
    return (
      <div>
        <SearchWidget
          width={size}
          ref={(ref) => { this.searchWidget = ref }}
          from={from}
          openFromInput={openFromInput}
          onSelectFromInput={this.onSelectFromInput}
          onSearchFromInput={this.onSearchFromInput}
          onBlurFromInput={this.onBlurFromInput}
          onKeyDownFromInput={this.onKeyDownFromInput}
          onFocusFromInput={this.onFocusFromInput}
          optionsFromInput={this.renderOptions(dataSourceFromInput)}

          to={to}
          openToInput={openToInput}
          onSelectToInput={this.onSelectToInput}
          onSearchToInput={this.onSearchToInput}
          onBlurToInput={this.onBlurToInput}
          onKeyDownToInput={this.onKeyDownToInput}
          onFocusToInput={this.onFocusToInput}
          optionsToInput={this.renderOptions(dataSourceToInput)}

          compareFunction={compareFunction}
          displayKeyName="name"
          date={date}
          onFocusDateInput={this.onFocusDateInput}
          onDateChange={this.onDateChange}
          isDayBlocked={day => moment.isMoment(day) && day.diff(moment(), 'days', false) < 0}
          todayText={intl.formatMessage({ id: 'route.datepicker.today' })}
          lunarText={intl.formatMessage({ id: 'route.datepicker.lunarText' })}
          onSearchClick={this.onSearchClick}
          isOpenDateDropdown={isOpenDateDropdown}
          placeholderFrom={intl.formatMessage({ id: 'landing.searchTicket.from' })}
          placeholderTo={intl.formatMessage({ id: 'landing.searchTicket.to' })}
          placeholderDate={intl.formatMessage({ id: 'landing.searchTicket.date' })}
          searchText={intl.formatMessage({ id: 'landing.searchTicket.searchText' })}
          isLoading={isLoading}
          onOutsideClick={() => {
            this.setState({
              isOpenDateDropdown: false,
            });
          }}
          onKeyDownDateInput={this.onKeyDownDateInput}
          onSwap={this.onSwap}
        />
      </div>

    );
  }
}

const mapStateToProps = state => ({
  locale: state.device.locale,
});

export default connect(mapStateToProps)(SearchWidgetContainer);
