import React from 'react'
import styled from 'styled-components'

const CountDown = styled.div`
  background-color: #007aff;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 10px 15px !important;
  position: fixed;
  width: 100%;
  top: 47px;
  z-index: 1;
  + div {
    padding-top: 100px;
  }
`;
const Text = styled.div`
  color: #fff;
  padding-left: 10px;
`;
const Time = styled.div`
  color: #ffb400;
  margin-left: 4px;
`;

const calculateCountDownTime = (expiredTime) => {
  if (expiredTime === undefined) return -999;
  const expTime = new Date(expiredTime);
  const curTime = new Date();
  const FECountDownTime = expTime.getTime() - curTime.getTime();
  const timer = FECountDownTime / 1000 > 600 ? 600 : FECountDownTime / 1000;
  return Math.floor(timer) < 0 ? 0 : Math.floor(timer);
};

const formatIntegerTime = (num) => {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
};

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: calculateCountDownTime(props.expiredTime) || -999,
      expiredTime: props.expiredTime,
    }
  }

  componentDidMount() {
    if (this.state.timer <= 0 && this.state.timer !== -999) {
      this.props.onTimeOut();
      this.setState({ timer: 0 })
    } else {
      // localStorage.setItem('countdown', this.state.timer);
      this.countdown = setInterval(this.timer, 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expiredTime !== this.state.expiredTime && !this.state.expiredTime) {
      const timer = calculateCountDownTime(nextProps.expiredTime) || -999;
      this.setState({ timer, expiredTime: nextProps.expiredTime })
      if (timer <= 0 && this.state.timer !== -999) {
        this.props.onTimeOut();
        this.setState({ timer: 0, expiredTime: undefined })
      } else {
        clearInterval(this.countdown);
        this.countdown = setInterval(this.timer, 1000);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  timer = () => {
    const { expiredTime } = this.state
    let timer = calculateCountDownTime(expiredTime)
    if (timer <= 0 && timer !== -999) {
      timer = 0;
      clearInterval(this.countdown);
      this.props.onTimeOut(true);
      this.setState({ timer: -999, expiredTime: undefined })
    } else {
      this.setState({ timer });
    }
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props
    const { timer } = this.state
    const timeText = timer === -999 ? '--:--' : `${formatIntegerTime(
      Math.floor(this.state.timer / 60),
    )}:${formatIntegerTime(timer % 60)}`;
    return (
      <CountDown>
        <img src="https://storage.googleapis.com/fe-production/svgIcon/timer.svg" alt="" />
        <Text>{formatMessage({ id: 'payment.countdown' })}</Text>
        <Time>{timeText}</Time>
      </CountDown>
    )
  }
}

export default CountdownTimer
