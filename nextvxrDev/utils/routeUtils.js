import Areas from '#/static/json/search_area';
import moment from 'moment';
import { convertVietnameseToEnglish } from '#/utils/langUtils';

export function generateRoute(from, to, date, vxrCompName, lang) {
  let startPointType;
  let startPointId;
  let stopPointType;
  let stopPointId;
  const numberOfTicket = 1;
  date = moment(date).format('DD-MM-YYYY');

  startPointType = from.type;
  startPointId = from.idUrl;

  stopPointType = to.type;
  stopPointId = to.idUrl;

  let startPointValue = convertVietnameseToEnglish(from.name);
  let stopPointValue = convertVietnameseToEnglish(to.name);
  if (startPointValue == 'ho-chi-minh') {
    startPointValue = 'sai-gon';
  }
  if (stopPointValue == 'ho-chi-minh') {
    stopPointValue = 'sai-gon';
  }

  const { compId, compName } = vxrCompName;
  let searchTicketUrl = '';

  // Build search url
  if (lang == 'en-US') {
    if (compId && compId.trim() != '') {
      searchTicketUrl += `${compName.trim()}-`;
    }
    searchTicketUrl += `bus-ticket-booking-from-${startPointValue}-to-${stopPointValue}-`;
  } else {
    searchTicketUrl += 've-xe-khach';
    if (compId && compId.trim() != '') {
      searchTicketUrl += `-${compName.trim()}`;
    }

    searchTicketUrl += `-tu-${startPointValue}-di-${stopPointValue}-`;
  }

  if (startPointType && startPointId && stopPointType && stopPointId) {
    searchTicketUrl += `${startPointType}${startPointId}t${stopPointType}${stopPointId}${numberOfTicket}`;
    if (compId != null && compId.trim() != '') {
      searchTicketUrl += `-${compId}`;
    }
    searchTicketUrl += '.html';
    // Redirect to search ticket page
    return `/${lang}/${searchTicketUrl}?date=${date}`;
  }
  return '/';
}
