import React from 'react';
import styled from 'styled-components';
import Input from 'vxrd/components/Antd/Input';
import Radio from 'antd/lib/radio';
import Icon from 'vxrd/components/Antd/Icon';

const { Group: RadioGroup } = Radio;

const SearchStyled = styled(Input)`
  .ant-input-suffix {
    left: 12px;
  }
  .ant-input:not(:last-child) {
    padding-right: 11px;
    padding-left: 30px;
  }
`;

const RadioStyled = styled(Radio)`
  display: block;
  min-height: 28px;
  padding: 8px 0px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #cccccc;
  span.ant-radio + * {
    white-space: normal;
  }
`;

const Container = styled.div`
  max-height: 300px;
  overflow: auto;
  padding-bottom: 16px;
  margin-top: 16px;
  .ant-radio-group {
    width: 100%;
  }
`;

class SelectBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  componentWillReceiveProps() {
    this.setState({ searchText: '' });
  }

  onChange = (e) => {
    this.setState({ searchText: e.target.value.toLowerCase() });
  };

  render() {
    const {
      onChange, value, options, intl,
    } = this.props;
    const filteredOptions = options
      ? options.filter(x => x.label.toLowerCase().includes(this.state.searchText))
      : [];
    return (
      <div>
        <SearchStyled
          prefix={<Icon type="search" />}
          placeholder={intl.formatMessage({ id: 'payment.selectbank.popup.search' })}
          onChange={this.onChange}
          style={{ width: '100%' }}
          size="large"
          value={this.state.searchText}
        />
        <Container>
          <RadioGroup size="large" value={value} onChange={onChange}>
            {filteredOptions
              ? filteredOptions.map(item => (
                <RadioStyled value={item} key={item.code}>
                  {item.label}
                </RadioStyled>
              ))
              : null}
          </RadioGroup>
        </Container>
      </div>
    );
  }
}

export default SelectBank;
