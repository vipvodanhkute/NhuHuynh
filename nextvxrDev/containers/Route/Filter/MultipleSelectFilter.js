import React from 'react';
import HeaderNew from 'vxrd/components/Layout.New/Header';
import Button from 'vxrd/components/Antd/Button';
import Icon from 'vxrd/components/Antd/Icon';
import List from 'vxrd/components/Antd/List';
import styled from 'styled-components';
import cloneDeep from 'lodash/cloneDeep';
import pluralize from 'pluralize';
import { injectIntl } from 'react-intl';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  overflow: hidden;
`;
const StyledContent = styled.div`
  padding: 32px 24px 0px 24px;
  margin: 47px 0 78px 0;
  height: calc(100vh - 126px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .ant-list{
    padding-bottom: 54px;
  }
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
const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;
const Route = styled.div`
  font-size: 16px;
  margin-bottom: 25px;
`;
const Description = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
const StyledListItem = styled(List.Item)`
  min-height: 64px;
  .ant-list-item-content{
    display: flex;
    justify-content: space-between;
  }
  .ant-list-item-content {
    display: flex;
    width: 100%;
  }
`;

const ItemDescription = styled.span`
`;

class MultipleSelectFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      totalSelected: this.countSelectedItems(props.items),
    };
  }

  componentWillMount() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
  }

  handleOnClickItem = (index) => {
    const { items } = this.state;
    const newItems = cloneDeep(items);
    newItems[index].selected = !newItems[index].selected;
    this.setState(
      {
        items: newItems,
        totalSelected: this.countSelectedItems(newItems),
      },
      () => {},
    );
  };

  handleClearAllSelected = () => {
    const { items } = this.state;
    const newItems = items.map((item) => {
      const newItem = { ...item };
      newItem.selected = false;
      return newItem;
    });
    this.setState({
      items: newItems,
      totalSelected: this.countSelectedItems(newItems),
    });
  };

  handleOnBack = () => {
    this.props.onSubmit();
  };

  handleOnSubmit = () => {
    this.props.onSubmit(this.state.items);
  };

  countSelectedItems = items => items.reduce((total, item) => {
    if (item.selected) return total + 1;
    return total;
  }, 0);

  render() {
    const {
      title,
      route,
      description,
      label,
      intl: { formatMessage },
    } = this.props;
    const { items, totalSelected } = this.state;
    return (
      <Wrapper>
        <HeaderNew fixed style={{ backgroundColor: 'red' }}>
          <HeaderNew.Left>
            <Button label="true" onClick={this.handleOnBack}>
              <Icon type="left" />
            </Button>
          </HeaderNew.Left>

          <HeaderNew.Right>
            <Button label="true" onClick={this.handleClearAllSelected} disabled={totalSelected === 0}>
              {formatMessage({ id: 'route.filter.clearAll' })}
            </Button>
          </HeaderNew.Right>
        </HeaderNew>
        <StyledContent>
          <Title>{title}</Title>
          <Route>{route}</Route>
          <Description>{description}</Description>
          <List>
            {items.map((item, index) => (
              <StyledListItem key={index} onClick={() => this.handleOnClickItem(index)}>
                <ItemDescription>{item.description || item.label}</ItemDescription>
                {item.selected && <Icon type="check" />}
              </StyledListItem>
            ))}
          </List>
        </StyledContent>
        <StyledFooter>
          <Button
            type="primary"
            style={{
              width: '100%',
              height: '100%',
              fontSize: '16px',
            }}
            onClick={this.handleOnSubmit}
          >
            {formatMessage(
              { id: 'route.filter.addFilters' },
              {
                count: `${totalSelected} ${label}`,
                countEn: pluralize(label, totalSelected, true),
              },
            )}
          </Button>
        </StyledFooter>
      </Wrapper>
    );
  }
}

export default injectIntl(MultipleSelectFilter);
