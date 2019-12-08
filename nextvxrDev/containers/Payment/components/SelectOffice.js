import React from 'react';
import styled from 'styled-components'
import Radio from 'antd/lib/radio'

const { Group: RadioGroup } = Radio

const RadioGroupStyled = styled(RadioGroup)`
  >div:first-child{
    padding-top: 0px;
  }
`

const RadioStyled = styled(Radio)`
  display: block;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 4px;
  span.ant-radio + *{
    white-space: normal;
  }
 
`

const Container = styled.div`
  padding-bottom: 16px;
  .ant-radio-group {
    width: 100%;
  }
 
`
const ItemStyled = styled.div`
  border-bottom: 1px solid #CCCCCC;
  padding-bottom: 16px;
  padding-top: 12px;
`

const Data = [
  {
    id: 1,
    name: 'office.north.name',
    address: 'office.north.address',
  },
  {
    id: 2,
    name: 'office.south.name',
    address: 'office.south.address',
  },
]


export default ({ onChange, value, intl }) => {
  const options = Data.map(item => ({
    ...item,
    name: intl.formatMessage({ id: item.name }),
    address: intl.formatMessage({ id: item.address }),
  }))
  return (
    <Container>
      <RadioGroupStyled size="large" value={value} onChange={onChange}>
        {
            options ? options.map(
              item => (
                <ItemStyled key={item.id}>
                  <RadioStyled value={item}>{item.name}</RadioStyled>
                  <span>{item.address}</span>
                </ItemStyled>
              ),
            ) : null
          }
      </RadioGroupStyled>
    </Container>
  );
}
