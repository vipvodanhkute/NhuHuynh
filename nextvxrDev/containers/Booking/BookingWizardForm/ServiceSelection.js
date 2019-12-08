import React, { Component } from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import InfoItem from 'vxrd/components/AreaPointSelection/Point/PointSelected';
import ServiceCheckbox from 'vxrd/components/Base/ServiceCheckbox';
import Modal from 'vxrd/components/Base/Modal';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import {
  BOOKING_STEP,
  GA_BOOKING_SERVICE_EVENT,
} from '../constants';
import AreaPointSelection from './AreaPointSelection';

const ServiceSelectionContainer = styled.div`
  padding: 15px;
  .area-title {
      font-size: 19px;
      font-weight: bold;
  }
  .area-selection-info {
    border-bottom: 1px solid #E4E4E4;
    div {
      border: none;
    }
  }
  .service-info {
    margin-top: 30px;
    .title {
      font-weight: bold;
      font-size: 19px;
    }
  }
  .last-item {
    .info-group {
      // height: 70px;
      padding-bottom: 15px;
    }
  }
`;

const ModalContainer = styled(Modal)`
    max-width: 100% !important;
    max-height: 100%;
    margin: 0px !important;
    top: 0px !important;
    .ant-modal-content {
        height: auto;
        min-height: 100vh;
    }
    .ant-modal-body {
        padding: 0px;
    }
    .ant-modal-title {
        text-align: center;
    }
    .ant-modal-close {
        float: left;
        right: auto;
    }
`;

const LastInfoItem = styled(InfoItem)`
  padding-bottom: 20px !important;
  // padding-bottom: 16px;
`

class ServiceSelection extends Component {
  state = {
    editStep: null,
  };

  setAreaPointSelectionStep = (step) => {
    const {
      // setStep,
      // setNextStep,
      sendGAEventTracking,
    } = this.props;
    // setStep(step);
    // setNextStep(BOOKING_STEP.SELECT_AREA_SUMMARY);
    this.setState({
      editStep: step,
    }, () => {
      if (step === BOOKING_STEP.SELECT_PICK_UP_AREA) {
        sendGAEventTracking(GA_BOOKING_SERVICE_EVENT, 'Edit boarding point');
      } else if (step === BOOKING_STEP.SELECT_DROP_OFF_AREA) {
        sendGAEventTracking(GA_BOOKING_SERVICE_EVENT, 'Edit dropping point');
      }
    })
  }

  handleEditAreaPoint = (areaSelectionValueSelect) => {
    const { updateAreaPointsValue } = this.props;
    this.setState({
      editStep: null,
    }, () => {
      updateAreaPointsValue(areaSelectionValueSelect);
    })
  }

  handleCancel = () => {
    this.setState({
      editStep: null,
    });
  }

  render() {
    const {
      pickUpPoint,
      dropOffPoint,
      getValue,
      services = [],
      intl,
      pickUpSelectionProps,
      dropOffSelectionProps,
    } = this.props;
    const listService = services.map((item) => {
      const checkboxProps = Object.assign({}, item, { getValue });
      return (
        <ServiceCheckbox {...checkboxProps} />
      )
    });
    const { editStep } = this.state;

    return (
      <ServiceSelectionContainer>
        <div className="area-selection-info">
          <div className="area-title">{intl.formatMessage({ id: 'booking.servicesSelection.areaTitle' })}</div>
          <InfoItem
            LabelAction={intl.formatMessage({ id: 'booking.servicesSelection.pickUpTime' })}
            time={get(pickUpPoint, 'time')}
            name={get(pickUpPoint, 'name')}
            address={get(pickUpPoint, 'address')}
            labelButton={intl.formatMessage({ id: 'booking.editLabel' })}
            onClick={() => this.setAreaPointSelectionStep(BOOKING_STEP.SELECT_PICK_UP_AREA)}
          />
          <div className="last-item">
            <LastInfoItem
              LabelAction={intl.formatMessage({ id: 'booking.servicesSelection.estimatedTime' })}
              time={get(dropOffPoint, 'time')}
              name={get(dropOffPoint, 'name')}
              address={get(dropOffPoint, 'address')}
              labelButton={intl.formatMessage({ id: 'booking.editLabel' })}
              onClick={() => this.setAreaPointSelectionStep(BOOKING_STEP.SELECT_DROP_OFF_AREA)}
            />
          </div>
        </div>
        {
          !isEmpty(services)
          && (
          <div className="service-info">
            <div className="title">{intl.formatMessage({ id: 'booking.servicesSelection.otherServices' })}</div>
            {
              listService
            }
          </div>
          )
        }
        <ModalContainer
          title={editStep === BOOKING_STEP.SELECT_PICK_UP_AREA
            ? intl.formatMessage({ id: 'booking.titleStep.selectPickUpArea' }) : intl.formatMessage({ id: 'booking.titleStep.selectDropOffArea' })
          }
          visible={editStep}
          onCancel={this.handleCancel}
          footer={null}
          transparent={false}
        >
          <AreaPointSelection
            selectionProps={editStep === BOOKING_STEP.SELECT_PICK_UP_AREA
              ? pickUpSelectionProps : dropOffSelectionProps}
            getValue={this.handleEditAreaPoint}
          />
        </ModalContainer>
      </ServiceSelectionContainer>
    )
  }
}

export default injectIntl(ServiceSelection);
