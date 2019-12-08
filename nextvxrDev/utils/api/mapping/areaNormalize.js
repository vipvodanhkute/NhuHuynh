import get from 'lodash.get'
// "area": {
//     "from": {
//         "id": "432",
//         "name": "Rạch Giá",
//         "code": "",
//         "address": "",
//         "type": 5,
//         "city": {
//             "id": "432",
//             "name": "Rạch Giá"
//         },
//         "state": {
//             "id": "33",
//             "name": "Kiên Giang"
//         }
//     },
//     "to": {
//         "id": "28020",
//         "name": "Bàu Bàng",
//         "code": "BBG",
//         "type": 5,
//         "city": {
//             "id": "28020",
//             "name": "Bàu Bàng"
//         },
//         "state": {
//             "id": "9",
//             "name": "Bình Dương"
//         }
//     }
// }

const TYPE_MAP = {
  5: 2,
  3: 1,
  15: 6,
}


export const mapFromAPI = area => ({
  ...area,
  type: get(area, 'city.id') ? 2 : 1,
  category: TYPE_MAP[get(area, 'type')] || 1,
  base: get(area, 'state.name'),
  idUrl: get(area, 'id'),
})

export const mapAreaFromRouteAPI = areas => ({
  from: mapFromAPI(get(areas, 'from')),
  to: mapFromAPI(get(areas, 'to')),
})
