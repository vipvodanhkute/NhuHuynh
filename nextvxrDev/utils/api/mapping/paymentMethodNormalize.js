import get from 'lodash.get';
import moment from 'moment';
import { PAYMENT_METHOD_CODE } from '#/utils/constants'

export const mapPaymentMethodFromAPI = (response) => {
  if (!response) return {};
  const rs = []
  Object.keys(PAYMENT_METHOD_CODE).forEach((key) => {
    let item = response.find(x => x.code === PAYMENT_METHOD_CODE[key])
    if (item) {
      let expiredTime
      if (get(item, 'info.receive_ticket_date')) {
        expiredTime = moment(get(item, 'info.receive_ticket_date'), 'HH:mm DD-MM-YYYY').format('HH:mm DD/MM/YYYY')
      } else if (get(item, 'info.expired_time')) {
        expiredTime = moment(get(item, 'info.expired_time'), 'HH:mm DD-MM-YYYY').format('HH:mm DD/MM/YYYY')
      }
      item = {
        ...item,
        info: {
          ...get(item, 'info', {}),
          expiredTime,
        },
      }
      rs.push(item)
    }
  })
  return rs;
};
