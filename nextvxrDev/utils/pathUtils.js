import moment from 'moment'
import { LANG, ROUTE_URL } from '#/utils/constants';
import get from 'lodash.get'
import Areas from '#/static/json/search_area'
import BusIds from '#/static/json/mapCompany'
import { getItem } from '#/utils/searchUtils'
import { ROUTE_STATUS } from '#/containers/Route/reducer'
import { convertVietnameseToEnglish } from '#/utils/langUtils'


const buildUrlParams = (params) => {
  if (params) {
    const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    return `?${queryString}`;
  }

  return '';
}

export const getApiPath = (routePath, params) => {
  const urlParmas = buildUrlParams(params);

  return `/${routePath}${urlParmas}`
}


export const isIncorrectLanguageUrl = (query, locale) => query.from !== ROUTE_URL.FROM[locale]
  || query.to !== ROUTE_URL.TO[locale]

export const isIncorrectDate = query => (!query.date || (query.date && moment().diff(moment(query.date, 'DD-MM-YYYY'), 'days') > 0))

export const getBusOperatorName = (ticketType) => {
  let busName;
  if (ticketType.includes(ROUTE_URL.BUS_TICKET[LANG.VN])) {
    busName = ticketType.replace(`${ROUTE_URL.BUS_TICKET[LANG.VN]}-`, '');

    return busName !== ROUTE_URL.BUS_TICKET[LANG.VN] ? busName : '';
  }

  busName = ticketType.replace(`-${ROUTE_URL.BUS_TICKET[LANG.EN]}`, '');

  return busName !== ROUTE_URL.BUS_TICKET[LANG.EN] ? busName : '';
}

export const createUrl = (query) => {
  let rs = ''
  const busOperatorNameStr = query.busName ? `${query.busName}-` : '';
  const { lang } = query;
  if (lang === LANG.EN) {
    rs = `/${query.lang}/${busOperatorNameStr}${ROUTE_URL.BUS_TICKET[lang]}-${ROUTE_URL.FROM[lang]}-${query.fromName}-${ROUTE_URL.TO[lang]}-${query.toName}-${query.fromToId}${query.busId || ''}.html?date=${query.date}`
  } else {
    rs = `/${query.lang}/${ROUTE_URL.BUS_TICKET[lang]}-${busOperatorNameStr}${ROUTE_URL.FROM[lang]}-${query.fromName}-${ROUTE_URL.TO[lang]}-${query.toName}-${query.fromToId}${query.busId || ''}.html?date=${query.date}`
  }


  if (query.limousine) {
    console.log('vo')
    rs = rs.replace(ROUTE_URL.BUS_TICKET[lang], ROUTE_URL.BUS_TICKET_LIMOUSINE[lang])
  }

  return rs;
}


export const mapIdUrlToIdDatabase = (type, id) => {
  // eslint-disable-next-line eqeqeq
  const index = Areas.findIndex(x => x.idUrl == id && x.type == type);
  if (index >= 0) {
    return Areas[index].id;
  }
  return id
}

export const mapBusIdUrlToBusIdDatabase = (busIdString) => {
  if (!busIdString) return undefined
  const busId = busIdString.substr(1, busIdString.length - 1)
  return (BusIds[busId] || busId)
}

export const mapBusIdDatabaseToBusIdUrl = (busIdString) => {
  if (!busIdString) return undefined
  for (const key in BusIds) {
    if (BusIds[key] == busIdString) {
      return key;
    }
  }
  return busIdString
}

export function queryToPayload(query) {
  let payload = {}

  // parser fromToId
  const fromToParams = query.fromToId.match('^([0-9])([0-9]+)t([0-9])([0-9]+)');

  payload = {
    lang: query.lang,
    from: getItem(mapIdUrlToIdDatabase(fromToParams[1], fromToParams[2]), fromToParams[1]),
    to: getItem(mapIdUrlToIdDatabase(
      fromToParams[3],
      fromToParams[4].substr(0, fromToParams[4].length - 1),
    ),
    fromToParams[3]),
    numOfTickets: fromToParams[4].substr(fromToParams[4].length - 1),
    date: query.date ? moment(query.date, 'DD-MM-YYYY') : moment(),
    format: 'fe',
    busId: query.busId ? mapBusIdUrlToBusIdDatabase(query.busId) : undefined,
    busName: getBusOperatorName(query.ticketType),
    sort: {},
    status: ROUTE_STATUS.NORMAL,
  };

  payload = Object.assign({ ...query, ...payload })
  return payload
}

export function payloadToQuery(payload) {
  let query = {}
  const { lang } = payload
  let { from, to } = payload
  if (!get(from, 'name') && from) {
    from = Areas.find(x => x.id === payload.from)
    to = Areas.find(x => x.id === payload.to)
  }
  query = {
    lang,
    from: ROUTE_URL.FROM[lang],
    fromName: convertVietnameseToEnglish(from.name),
    to: ROUTE_URL.TO[lang],
    toName: convertVietnameseToEnglish(to.name),
    busId: payload.busId ? `-${mapBusIdDatabaseToBusIdUrl(payload.busId)}` : undefined,
    fromToId: `${from.type}${from.idUrl}t${to.type}${to.idUrl}${payload.numOfTickets || 1}`,
    date: moment(payload.date).format('DD-MM-YYYY'),
  }
  if (lang === LANG.EN) {
    query.ticketType = `${payload.busName ? `${payload.busName}-` : ''}${ROUTE_URL.BUS_TICKET[lang]}`
  } else {
    query.ticketType = `${ROUTE_URL.BUS_TICKET[lang]}${payload.busName ? `-${payload.busName}` : ''}`
  }
  if (payload.limousine) {
    query.ticketType = query.ticketType.replace(
      ROUTE_URL.BUS_TICKET[lang],
      ROUTE_URL.BUS_TICKET_LIMOUSINE[lang],
    )
  }
  return query;
}
