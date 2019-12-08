export const mapFromAPI = (response) => {
  const sponsors = [];
  const froms = [];
  const tos = [];

  response.forEach((route) => {
    route.routes.forEach((item) => {
      // check includes here
      if (!JSON.stringify(froms).includes(JSON.stringify(item.from))) {
        froms.push(item.from);
      }
      if (!JSON.stringify(tos).includes(JSON.stringify(item.to))) {
        tos.push(item.to)
      }
    })
  })

  // console.log(froms, tos)

  response.forEach((sponsor) => {
    const [totalScho, totalMoney] = sponsor.sponsor_info.split('|')
    var routes = '';
    for (var x = 0; x < sponsor.routes.length; x++) {
        routes += sponsor.routes[x].from.name + ' - ' + sponsor.routes[x].to.name
        routes += (x == sponsor.routes.length - 1) ? '' : ', '
    }
    const {
      id, rank, name,
    } = sponsor;
    sponsors.push({
      routes, id, rank, name, totalScho, totalMoney,
    });
  })

  return { sponsors, froms, tos };
}
