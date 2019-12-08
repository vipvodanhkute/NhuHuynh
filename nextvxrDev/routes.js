// eslint-disable-next-line no-multi-assign
const routes = (module.exports = require('next-routes')());

routes
  .add({ name: 'index', pattern: '/:lang(vi-VN|en-US)' })
  .add({
    name: 'route',
    pattern:
      '/:lang(vi-VN|en-US)/:ticketType-:from(tu|from)-:fromName-:to(di|to)-:toName-:fromToId([0-9]{1,10}t[0-9]{1,10}):busId(-[0-9]{1,10})?.html',
    page: 'route',
  })
  .add({
    name: 'booking',
    pattern:
      '/:lang(vi-VN|en-US)/ticketbooking/:trip_code/:booking_type(ONLINE|REGISTER|CALLING|DEFAULT)/:fare/:step/:from/:to/',
  })
  .add({
    name: 'bookingCompanyInfo',
    pattern: '/:lang(vi-VN|en-US)/ticketbooking/:trip_code/company/:company_id/:from/:to',
  })
  .add({ name: 'payment', pattern: '/:lang(vi-VN|en-US)/payment-method/:booking_code/:payment_method?' })
  .add({ name: 'paymentResult', pattern: '/:lang(vi-VN|en-US)/payment-result' })
  .add({ name: 'landingPage', pattern: '/:lang(vi-VN|en-US)/partnership/:slug' })
  .add({ name: 'limousineLandingPage', pattern: '/:lang(vi-VN|en-US)/(xe-limousine|limousine-bus)' })
  .add({ name: 'chapCanhUocMo', pattern: '/:lang(vi-VN|en-US)/ve-xe-gia-re-ho-tro-tan-sinh-vien-nhap-hoc' })

module.exports = routes;
