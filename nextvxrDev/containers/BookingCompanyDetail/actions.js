import {
  GET_COMPANY_INFO,
  GET_COMPANY_IMAGE_SUCCESS,
  GET_COMPANY_IMAGE_ERROR,
  GET_CANCELLATION_POLICY,
  GET_CANCELLATION_POLICY_SUCCESS,
  GET_CANCELLATION_POLICY_ERROR,
  GET_COMPANY_UTILITY_SUCCESS,
  GET_COMPANY_UTILITY_ERROR,
  GET_COMPANY_SUMMARY_INFO_SUCCESS,
  GET_COMPANY_SUMMARY_INFO_ERROR,
  GET_COMPANY_REVIEW,
  GET_COMPANY_REVIEW_SUCCESS,
  GET_COMPANY_REVIEW_ERROR,
  CLEAR_COMPANY_REVIEW_DATA,
} from './constants';

export const getCompanyInfo = payload => ({
  type: GET_COMPANY_INFO,
  payload,
});

export const getCompanyImageSuccess = response => ({
  type: GET_COMPANY_IMAGE_SUCCESS,
  response,
});

export const getCompanyImageError = payload => ({
  type: GET_COMPANY_IMAGE_ERROR,
  payload,
});

export const getCancellationPolicy = payload => ({
  type: GET_CANCELLATION_POLICY,
  payload,
});

export const getCancellationPolicySuccess = payload => ({
  type: GET_CANCELLATION_POLICY_SUCCESS,
  payload,
});

export const getCancellationPolicyError = payload => ({
  type: GET_CANCELLATION_POLICY_ERROR,
  payload,
});

export const getCompanyUtilitySuccess = payload => ({
  type: GET_COMPANY_UTILITY_SUCCESS,
  payload,
});

export const getCompanyUtilityError = payload => ({
  type: GET_COMPANY_UTILITY_ERROR,
  payload,
});

export const getCompanySummaryInfoSuccess = response => ({
  type: GET_COMPANY_SUMMARY_INFO_SUCCESS,
  response,
});

export const getCompanySummaryInfoError = response => ({
  type: GET_COMPANY_SUMMARY_INFO_ERROR,
  response,
});

export const getCompanyReview = payload => ({
  type: GET_COMPANY_REVIEW,
  payload,
});

export const getCompanyReviewSuccess = response => ({
  type: GET_COMPANY_REVIEW_SUCCESS,
  response,
});

export const getCompanyReviewError = payload => ({
  type: GET_COMPANY_REVIEW_ERROR,
  payload,
});

export const clearCompanyReviewData = payload => ({
  type: CLEAR_COMPANY_REVIEW_DATA,
  payload,
});
