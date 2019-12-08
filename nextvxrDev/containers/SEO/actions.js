import {
  GET_SEO_DATA,
  GET_SEO_DATA_FAIL,
  GET_SEO_DATA_SUCCESS,
  GET_SEO_HOME,
  GET_SEO_COMPANIES,
  GET_SEO_LANDING_PAGE,
  GET_SEO_LIMOUSINE,
} from './constants';

export const getSEOData = ({
  from, to, date, lang, companyId,
}) => ({
  type: GET_SEO_DATA,
  payload: {
    from,
    to,
    date,
    lang,
    companyId,
  },
});

export const getSEOCompanies = ({
  from, to, date, lang, companyId,
}) => ({
  type: GET_SEO_COMPANIES,
  payload: {
    from,
    to,
    date,
    lang,
    companyId,
  },
});

export const getSEOHome = ({ lang }) => ({
  type: GET_SEO_HOME,
  payload: {
    lang,
  },
});

export const getSEOLimousine = ({ lang }) => ({
  type: GET_SEO_LIMOUSINE,
  payload: {
    lang,
  },
});

export const getSEOLandingPage = ({ lang, slug }) => ({
  type: GET_SEO_LANDING_PAGE,
  payload: {
    lang,
    slug,
  },
});

export const getSEODataFail = (payload, err) => ({
  type: GET_SEO_DATA_FAIL,
  payload,
  err,
});

export const getSEODataSuccess = (payload, data) => ({
  type: GET_SEO_DATA_SUCCESS,
  payload,
  data,
});
