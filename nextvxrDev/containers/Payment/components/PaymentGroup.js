import React from 'react';
import List from 'antd/lib/list';
import Icon from 'antd/lib/icon';
import styled from 'styled-components';

const GroupTitle = styled.div`
  font-weight: bold;
`;
const IconRight = styled(Icon)`
  color: #007aff;
  font-size: 18px;
`;
const StyledList = styled(List)`
  .ant-list-item-meta {
    display: flex;
    align-items: center;
  }
  .ant-list-item-meta-title {
    font-size: 16px;
    margin-bottom: 0px;
  }
  .ant-list-item-meta-description {
    font-size: 13px;
  }
`;
class PaymentGroup extends React.Component {
  render() {
    return (
      <>
        <GroupTitle>{this.props.groupName}</GroupTitle>
        <StyledList
          itemLayout="horizontal"
          dataSource={this.props.data}
          renderItem={item => (
            <List.Item onClick={() => this.props.onSelect(item)}>
              <List.Item.Meta
                avatar={<img src={item.imageUrl} alt="" />}
                title={item.title}
                description={item.description}
              />
              <IconRight type="right" />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default PaymentGroup;
