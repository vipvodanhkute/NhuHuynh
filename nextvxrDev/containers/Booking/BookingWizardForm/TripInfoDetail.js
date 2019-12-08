/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { injectIntl } from 'react-intl';
import pluralize from 'pluralize';
import styled from 'styled-components';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import RefundPolicy from 'vxrd/components/CompanyDetail/RefundPolicy';
import Reviews from 'vxrd/components/CompanyDetail/Reviews';
import Carousel from 'antd/lib/carousel';
import Utilities from 'vxrd/components/CompanyDetail/Utilities';
import Header from 'vxrd/components/Layout/Header';
import CompanyInfo from 'vxrd/components/Layout/Header/CompanyInfo';
import Button from 'vxrd/components/Antd/Button';
import Icon from 'vxrd/components/Antd/Icon';
import {
  GA_BUS_INFO_EVENT_CLICK,
  TAB_KEYS,
  GA_TAB_VALUE,
} from '#/containers/BookingCompanyDetail/constants';
import { getCancellationPolicyData } from '#/utils/api/mapping/cancellationPolicyNormalize';

const TripDetailWarraper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow: hidden;
`;
const HeaderContainer = styled.div`
  position: fixed;
  background-color: #FFFFFF;
  z-index: 2;
  width: 100%;
  // transform: translate3d(0,0,0);
  .route-info-menu {
    bottom: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #f5f1f1;
    .item-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: inherit;
      .line-border {
        width: 1px;
        height: 60%;
        background: #f4f4f4;
        float: right;
      }
    }
    .route-info-item-wapper {
      height: 100%;
      width: 99%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .route-info-item {
        color: #007AFF;
        text-align: center;
        font-weight: bold;
      }
    }
    .border-bottom {
      border-bottom: 2px solid #007AFF;
    }
  }
`;

const BodyContainer = styled.div`
  padding: 130px 15px 0 15px;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  height: 100%;
`;

const ReviewsContainer = styled.div`
  margin-bottom: 50px;
`;

const CloseIconContainer = styled.div`
  button {
    padding: 15px 0px;
    i {
      font-size: 23px !important;
    }
  }
`;

const imageSize = '360x216';

class TripInfoDetail extends React.Component {
  state = {
    loadingReview: false,
    tripDetailTab: this.props.tripDetailTab || TAB_KEYS.AMENITIES,
  }

  componentDidMount() {
    const { tripDetailTab } = this.props;
    this.move(tripDetailTab);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.reviews, nextProps.reviews)) {
      this.setState({
        loadingReview: false,
      })
    }
    if (!isEqual(this.props.tripDetailTab, nextProps.tripDetailTab)) {
      this.setState({
        tripDetailTab: nextProps.tripDetailTab,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tripDetailTab } = this.state;
    if (prevState.loadingReview === this.state.loadingReview) {
      setTimeout(() => {
        this.move(tripDetailTab);
      }, 400)
    }
  }

  move = (key) => {
    const target = document.getElementById(key);
    if (target) {
      const y = target.offsetTop;
      this.sendGAEvent(GA_TAB_VALUE[key]);
      document.getElementById('BodyContainer').scroll({
        top: y - 100,
        behavior: 'smooth',
      });
    }
  };

  setTab = (key) => {
    this.setState({
      tripDetailTab: key,
    });
  }

  back = () => {
    this.sendGAEvent('Back button');
    this.previousPage();
  }

  reservation = () => {
    this.sendGAEvent('Reservation button');
    this.previousPage();
  }

  getDataImages = () => {
    const { images } = this.props;
    return images ? images.map(image => get(image, `files[${imageSize}]`)) : null;
  }

  loadMoreReviews = (skip) => {
    const { companyInfo } = this.props;
    const payload = {
      company_id: companyInfo.id,
      skip,
    };
    this.setState({
      loadingReview: true,
    }, () => {
      this.props.getTripReviews(payload);
      this.sendGAEvent('See more rating button');
    })
  }

  calculateReviewRating = (totalRating) => {
    const { companyInfo } = this.props;
    const avergrateRating = totalRating / get(companyInfo, 'verified_rated_count', 0);
    if (!totalRating) {
      return 0;
    }
    return Number.isInteger(avergrateRating) ? avergrateRating : avergrateRating.toFixed(1);
  }

  sendGAEvent = (value) => {
    this.props.sendEventTracking({
      type: GA_BUS_INFO_EVENT_CLICK,
      value,
    });
  }

  // onTouchEnd = (e) => {
  //   e.preventDefault();
  // }

  render() {
    const {
      intl,
      cancellationPolicy,
      utilities = [],
      companyInfo,
      reviews,
      tripInfo,
    } = this.props;
    const {
      loadingReview,
      tripDetailTab,
    } = this.state;
    const imagesData = this.getDataImages();
    const cancellationPolicyData = getCancellationPolicyData({ cancellationPolicy, intl });
    const utilitiesProps = {
      utilityLabel: intl.formatMessage({ id: 'bookingCompanyInfo.headerTab.amenities' }),
      utilities,
    };
    const refundPolicyProps = {
      id: TAB_KEYS.REFUND_POLICY,
      title: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.title' }),
      note: get(cancellationPolicy, 'noteId') ? intl.formatMessage({ id: cancellationPolicy.noteId }) : get(cancellationPolicy, 'note'),
      noteLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.noteLabel' }),
      fromCancelLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.fromCancelLabel' }),
      toCancelLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.toCancelLabel' }),
      cancelFeeLabel: intl.formatMessage({ id: 'bookingCompanyInfo.cancellationPolicy.cancelFeeLabel' }),
      detail: cancellationPolicyData,
      contentDefault: get(cancellationPolicy, 'contentDefaultId') ? intl.formatMessage({ id: get(cancellationPolicy, 'contentDefaultId') }) : '',
    };
    const listReviewItems = get(reviews, 'items', []).map(item => ({
      ...item,
      ...{ dateTime: intl.formatMessage({ id: 'bookingCompanyInfo.review.postedOnLabel' }, { dateTime: moment(item.dateTime).format('DD/MM/YYYY') }) },
    }));
    const reviewProps = {
      id: TAB_KEYS.REVIEWS,
      title: intl.formatMessage({ id: 'bookingCompanyInfo.headerTab.review' }),
      overallRating: this.calculateReviewRating(get(companyInfo, 'overall_rating')),
      totalReviewsLabel: intl.formatMessage({ id: 'bookingCompanyInfo.review.numReview' }, { numReview: get(reviews, 'total', 0), reviewText: pluralize('review', get(reviews, 'total', 0)) }),
      ratingCategory: [
        {
          name: intl.formatMessage({ id: 'bookingCompanyInfo.review.qualityRating' }),
          rating: this.calculateReviewRating(get(companyInfo, 'quality_rating')),
        },
        {
          name: intl.formatMessage({ id: 'bookingCompanyInfo.review.serviceRating' }),
          rating: this.calculateReviewRating(get(companyInfo, 'service_rating')),
        },
        {
          name: intl.formatMessage({ id: 'bookingCompanyInfo.review.ontimeRating' }),
          rating: this.calculateReviewRating(get(companyInfo, 'ontime_rating')),
        },
      ],
      totalReviews: get(reviews, 'total'),
      reviews: listReviewItems,
      loadMore: this.loadMoreReviews,
      loadMoreLabel: intl.formatMessage({ id: 'bookingCompanyInfo.review.seeMore' }),
      loading: loadingReview,
      noRatingMessage: intl.formatMessage({ id: 'bookingCompanyInfo.review.noRatingMessage' }),
    };
    return (
      <TripDetailWarraper id="TripDetailWarraper">
        <HeaderContainer>
          <Header
            rightComponent={(
              <CloseIconContainer>
                <Button label="true" onClick={this.props.closeModal}>
                  <Icon type="close" />
                </Button>
              </CloseIconContainer>
            )}
          >
            <CompanyInfo
              companyName={get(tripInfo, 'operator.name')}
              tripName={get(tripInfo, 'tripName')}
            />
          </Header>
          <div className="route-info-menu">
            <div className="item-container">
              <div className={`route-info-item-wapper ${tripDetailTab === TAB_KEYS.AMENITIES && 'border-bottom'}`}>
                <div
                  className="route-info-item"
                  onClick={() => this.setTab(TAB_KEYS.AMENITIES)}
                >
                  {intl.formatMessage({ id: 'booking.tripDetailInfo.tabLabel.busInfo' })}
                </div>
              </div>
              <div className="line-border" />
            </div>
            <div className="item-container">
              <div className={`route-info-item-wapper ${tripDetailTab === TAB_KEYS.REFUND_POLICY && 'border-bottom'}`}>
                <div
                  className="route-info-item"
                  onClick={() => this.setTab(TAB_KEYS.REFUND_POLICY)}
                >
                  {intl.formatMessage({ id: 'booking.tripDetailInfo.tabLabel.refundPolicy' })}
                </div>
              </div>
              <div className="line-border" />
            </div>
            <div className="item-container">
              <div className={`route-info-item-wapper ${tripDetailTab === TAB_KEYS.REVIEWS && 'border-bottom'}`}>
                <div
                  className="route-info-item"
                  onClick={() => this.setTab(TAB_KEYS.REVIEWS)}
                >
                  {intl.formatMessage({ id: 'booking.tripDetailInfo.tabLabel.reviews' })}
                </div>
              </div>
            </div>
          </div>
        </HeaderContainer>
        <BodyContainer id="BodyContainer">
          <div id={TAB_KEYS.AMENITIES}>
            {
              !isEmpty(imagesData)
              && (
              <Carousel
                beforeChange={() => this.sendGAEvent('Image')}
                afterChange={() => this.sendGAEvent('Image')}
                autoplay
              >
                {
                  imagesData.map(val => (
                    <img
                      src={val}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top', height: 'auto' }}
                    />
                  ))
                }
              </Carousel>
              )
            }
            {
              !isEmpty(utilities) && <Utilities {...utilitiesProps} />
            }
          </div>
          {
              cancellationPolicyData && <RefundPolicy {...refundPolicyProps} />
          }
          <ReviewsContainer>
            <Reviews {...reviewProps} />
          </ReviewsContainer>
        </BodyContainer>
      </TripDetailWarraper>
    )
  }
}

export default injectIntl(TripInfoDetail);
