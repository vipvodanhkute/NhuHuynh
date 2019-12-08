import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withReduxSaga from 'next-redux-saga';
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
import HeaderTab from 'vxrd/components/CompanyDetail/HeaderTab';
import Utilities from 'vxrd/components/CompanyDetail/Utilities';
import Header from 'vxrd/components/Layout/Header';
import Title from 'vxrd/components/Layout/Header/Title';
import BackIcon from 'vxrd/components/Layout/Header/BackIcon';
import Button from 'vxrd/components/Antd/Button';
import {
  getCompanyInfo,
  getCompanyReview,
} from '#/containers/BookingCompanyDetail/actions';
import { sendEventTracking } from '#/containers/Device/actions';
import {
  GA_BUS_INFO_EVENT_CLICK,
  TAB_KEYS,
  GA_TAB_VALUE,
} from '#/containers/BookingCompanyDetail/constants';
import { Router } from '#/routes';
import { getCancellationPolicyData } from '#/utils/api/mapping/cancellationPolicyNormalize'


const HeaderContainer = styled.div`
  position: fixed;
  background-color: #FFFFFF;
  z-index: 2;
  width: 100%;
`;

const BodyContainer = styled.div`
  padding: 123px 15px 75px 15px;
`;

const ReviewsContainer = styled.div`
  margin-bottom: 50px;
`;

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 15px;
  background-color: #FFFFFF;
  button {
    width: 100%;
    height: 45px;
  }
`;

const imageSize = '360x216';

class Index extends React.Component {
  static async getInitialProps({ ctx }) {
    const {
      isServer,
      query,
      store,
    } = ctx;
    const {
      company_id,
      trip_code,
      from,
      to,
    } = query;
    const payload = {
      company_id,
      trip_code,
      from,
      to,
    }

    store.dispatch(getCompanyReview(payload));
    const timeDeparture = get(store.getState(), 'bookingReducer.tripInfo.timeDeparture')
    if (timeDeparture) {
      payload.timeDeparture = timeDeparture
    }
    store.dispatch(getCompanyInfo(payload));
    return { isServer, query }
  }

  state = {
    loadingReview: false,
  }

  componentDidMount() {
    this.props.stopLoading();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.reviews, nextProps.reviews)) {
      this.setState({
        loadingReview: false,
      })
    }
  }

  move = (key) => {
    const target = document.getElementById(key);
    const y = target.getBoundingClientRect().top + window.scrollY;
    this.sendGAEvent(GA_TAB_VALUE[key]);
    window.scroll({
      top: y - 100,
      behavior: 'smooth',
    });
  };

  previousPage = () => {
    this.props.loading();
    Router.back();
  };

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
    const { query } = this.props;
    const {
      company_id,
    } = query;

    const payload = {
      company_id,
      skip,
    };
    this.setState({
      loadingReview: true,
    }, () => {
      this.props.getCompanyReview(payload);
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

  render() {
    const {
      intl,
      cancellationPolicy,
      utilities = [],
      companyInfo,
      reviews,
    } = this.props;
    const { loadingReview } = this.state;
    const imagesData = this.getDataImages();
    const cancellationPolicyData = getCancellationPolicyData({ cancellationPolicy, intl });
    const HeaderTabProps = {
      listTabs: [
        {
          name: intl.formatMessage({ id: 'bookingCompanyInfo.headerTab.amenities' }),
          key: TAB_KEYS.AMENITIES,
        },
        {
          name: intl.formatMessage({ id: 'bookingCompanyInfo.headerTab.cancellationPolicy' }),
          key: TAB_KEYS.REFUND_POLICY,
        },
        {
          name: intl.formatMessage({ id: 'bookingCompanyInfo.headerTab.review' }),
          key: TAB_KEYS.REVIEWS,
        },
      ],
    };
    const utilitiesProps = {
      // id: 'Utilities',
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
      <>
        <HeaderContainer>
          <Header
            leftComponent={<BackIcon onClick={this.back} />}
          >
            <Title
              title={get(companyInfo, 'name')}
            />
          </Header>
          <HeaderTab {...HeaderTabProps} callback={this.move} />
        </HeaderContainer>
        <BodyContainer>
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
          <RefundPolicy {...refundPolicyProps} />
          <ReviewsContainer>
            <Reviews {...reviewProps} />
          </ReviewsContainer>
        </BodyContainer>
        <FooterContainer>
          <Button type="primary" size="large" onClick={this.previousPage}>{intl.formatMessage({ id: 'bookingCompanyInfo.reservationButton' })}</Button>
        </FooterContainer>
      </>
    )
  }
}

const mapStateToProps = state => ({
  images: state.bookingCompanyDetailReducer.images,
  cancellationPolicy: state.bookingCompanyDetailReducer.cancellationPolicy,
  utilities: state.bookingCompanyDetailReducer.utilities,
  companyInfo: state.bookingCompanyDetailReducer.companyInfo,
  reviews: state.bookingCompanyDetailReducer.reviews,
  tripInfo: state.bookingReducer.tripInfo,
});

const mapDispatchToProps = dispatch => ({
  getCompanyInfo: bindActionCreators(getCompanyInfo, dispatch),
  getCompanyReview: bindActionCreators(getCompanyReview, dispatch),
  sendEventTracking: bindActionCreators(sendEventTracking, dispatch),
})

export default injectIntl((
  connect(mapStateToProps, mapDispatchToProps)(
    withReduxSaga({ async: true })(Index),
  )))
