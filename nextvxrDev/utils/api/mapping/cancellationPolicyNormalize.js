import moment from 'moment'
import get from 'lodash.get'
import { LANG } from '#/utils/constants'

const CURRENCY = {
  1: '%',
  2: 'đ',
}

export const normalizeCancellationPolicy = (response, timeDeparture, locale) => {
  let rs = {}
  rs = response.data
  rs.detail = rs.detail.map((item) => {
    const result = item;
    if (item.currency === '1' && item.fee === '100') {
      if (item.disable_cancel) {
        result.feeTextId = 'bookingCompanyInfo.cancellationPolicy.cancelMessage.notAllowedCancelation';
      } else {
        result.feeTextId = 'bookingCompanyInfo.cancellationPolicy.cancelMessage.nonrefundable'
      }
    }
    if (+item.fee) {
      result.fee = `${item.fee}${CURRENCY[+item.currency]}`;
    } else {
      result.feeTextId = 'bookingCompanyInfo.cancellationPolicy.cancelMessage.free'
    }

    const from = Number(result.from)
    const to = Number(result.to)
    if (!from && to) {
      result.fromTime = moment(timeDeparture).subtract(to, 'hours')
    } else if (from && !to) {
      result.fromTextId = 'bookingCompanyInfo.cancellationPolicy.cancelMessage.afterBooking'
      result.toTime = moment(timeDeparture).subtract(from, 'hours')
    } else if (from && to) {
      result.fromTime = moment(timeDeparture).subtract(to, 'hours')
      result.toTime = moment(timeDeparture).subtract(from, 'hours')
    } else if (!from && !to) {
      result.fromTextId = 'bookingCompanyInfo.cancellationPolicy.cancelMessage.afterBooking'
    }
    return result;
  })
  if (locale === LANG.EN) {
    rs.note = rs.english_note;
  }
  rs.contentDefaultId = 'bookingCompanyInfo.cancellationPolicy.contentDefault'
  if (!rs.detail.length) {
    rs.noteId = 'bookingCompanyInfo.cancellationPolicy.noteDefault'
  }
  return rs;
}

export const getCancellationPolicyData = ({ cancellationPolicy, intl }) => {
  if (cancellationPolicy) {
    const cancellationPolicyData = get(cancellationPolicy, 'detail', []).map((item) => {
      const result = { ...item };
      if (item.feeTextId) {
        result.fee = intl.formatMessage({ id: item.feeTextId })
      }
      if (item.fromTextId) {
        result.fromText = intl.formatMessage({ id: item.fromTextId })
      } else if (item.fromTime) {
        result.fromText = moment(result.fromTime).format('HH:mm DD/MM/YYYY')
      }
      if (item.toTextId) {
        result.toText = intl.formatMessage({ id: item.toTextId })
      } else if (item.toTime) {
        result.toText = moment(result.toTime).format('HH:mm DD/MM/YYYY')
      }
      return { from: result.fromText, to: result.toText, fee: result.fee };
    })
    return cancellationPolicyData
  }
  return;
}
