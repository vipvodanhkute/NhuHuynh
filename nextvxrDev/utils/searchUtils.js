import Areas from '#/static/json/search_area'
import MapAreas from '#/static/json/mapArea'

const CATEGORIES = [
  1, // 'Tỉnh - Thành Phố',
  2, // 'Quận - Huyện',
  3, // 'Phường - Xã',
  4, // 'Sân bay',
  5, // 'Bến xe',
  6, // 'Điểm dừng phổ biến',
]

const REGEX_FIRST_CHARACTER = /^.| +./g

function removeVietnameseMark(value) {
  let str = value
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // str = str.replace(
  //   // eslint-disable-next-line no-useless-escape
  //   / /g,
  //   '-',
  // );

  /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
  // str = str.replace(/-+-/g, ' '); // thay thế 2- thành 1-
  // eslint-disable-next-line no-useless-escape
  // str = str.replace(/^\-+|\-+$/g, '');
  // cắt bỏ ký tự - ở đầu chuỗi
  return str;
}

const sortAlphabet = items => items.sort((a, b) => {
  if (a.name < b.name) { return -1; }
  if (a.name > b.name) { return 1; }
  return 0;
})

const sortCategory = (items, categories) => {
  const rs = []
  categories.forEach((category) => {
    const categoryItem = items.filter(item => item.category === category)
    rs.push(...sortAlphabet(categoryItem))
  })
  return rs;
}

// từ nguyên mẫu , đúng 100 %, vị trí đầu
const belongToGroup1 = (string, locationName) => {
  const index = locationName.toLowerCase().indexOf(string)
  return index === 0
}

// từ đã bỏ dấu, đúng 100%, vị trí đầu
const belongToGroup2 = (string, locationName) => {
  const index = removeVietnameseMark(locationName).indexOf(string)
  return index === 0
}

// từ nguyên mẫu, đúng từ
const belongToGroup3 = (string, locationName) => {
  const arr = locationName.toLowerCase().split(' ');
  if (arr.length > 1) {
    arr.splice(0, 1);
    return arr.includes(string)
  }
  return false;
}

// từ đã bỏ dấu, đúng từ
const belongToGroup4 = (string, locationName) => {
  const arr = removeVietnameseMark(locationName).toLowerCase().split(' ');
  if (arr.length > 1) {
    arr.splice(0, 1);
    return arr.includes(string)
  }
  return false;
}

// từ khớp 100% với name loại bỏ dấu cách
const belongToGroup5 = (string, locationName) => {
  const index = locationName.toLowerCase().replace(/ /g, '').indexOf(string)
  if (index >= 0) {
    if (index === 0) return true;
    if (string.length < 3) return false;
    for (let i = 2; i < string.length; i += 1) {
      const val = [string.slice(0, i), ' ', string.slice(i)].join('');
      const index2 = locationName.toLowerCase().indexOf(val)
      if (index2 > 0) {
        return locationName[index2 - 1] === ' '
      }
    }
    return false
  }
  return false
}

// từ khớp 100% với name loại bỏ dấu cách và dấu
const belongToGroup6 = (string, locationName) => {
  const locationRemovedMark = removeVietnameseMark(locationName)
  const index = locationRemovedMark.replace(/ /g, '').indexOf(string)
  if (index >= 0) {
    if (index === 0) return true;
    if (string.length < 3) return false;
    for (let i = 2; i < string.length; i += 1) {
      const val = [string.slice(0, i), ' ', string.slice(i)].join('');
      const index2 = locationRemovedMark.indexOf(val)
      if (index2 > 0) {
        return locationName[index2 - 1] === ' '
      }
    }
    return false
  }
  return false
}

// từ nguyên mẫu, từ khớp 100% kí tự
const belongToGroup7 = (string, locationName) => {
  const index = locationName.toLowerCase().indexOf(string)
  return index > 0
}

// từ đã bỏ dấu, khớp 100% kí tự
const belongToGroup8 = (string, locationName) => {
  const index = removeVietnameseMark(locationName).toLowerCase().indexOf(string)
  return index > 0
}

// từ viết tắt đầu chữ, nguyên mẫu
const belongToGroup9 = (string, locationName) => {
  const firstCharacters = locationName
    .toLowerCase()
    .match(REGEX_FIRST_CHARACTER)
    .join('')
    .replace(/ /g, '')
  return firstCharacters.includes(string)
}

// từ viết tắt đầu chữ, bỏ dấu
const belongToGroup10 = (string, locationName) => {
  const firstCharacters = removeVietnameseMark(locationName)
    .match(REGEX_FIRST_CHARACTER)
    .join('').replace(/ /g, '')
  return firstCharacters.includes(removeVietnameseMark(string))
}

export const search = (string) => {
  const rs = []
  const group1 = [] // từ nguyên mẫu , đúng 100 %, vị trí đầu
  const group2 = [] // từ đã bỏ dấu, đúng 100%, vị trí đầu
  const group3 = [] // từ nguyên mẫu, đúng từ
  const group4 = [] // từ đã bỏ dấu, đúng từ
  const group5 = [] // từ khớp 100% với name loại bỏ dấu cách
  const group6 = [] // từ khớp 100% với name loại bỏ dấu cách và dấu
  const group7 = [] // từ nguyên mẫu, từ khớp 100% kí tự
  const group8 = [] // từ đã bỏ dấu, khớp 100% kí tự
  const group9 = [] // từ viết tắt đầu chữ, nguyên mẫu
  const group10 = [] // từ viết tắt đầu chữ, bỏ dấu

  // prepare value to search
  const value = string.toLowerCase();

  // prepare function belong
  const filterFunc = [
    belongToGroup1,
    belongToGroup2,
    belongToGroup3,
    belongToGroup4,
    belongToGroup5,
    belongToGroup6,
    belongToGroup7,
    belongToGroup8,
    belongToGroup9,
    belongToGroup10,
  ]
  const resultFilter = [
    group1,
    group2,
    group3,
    group4,
    group5,
    group6,
    group7,
    group8,
    group9,
    group10,
  ]

  Areas.forEach((item) => {
    for (let i = 0; i < filterFunc.length; i += 1) {
      if (filterFunc[i](value, item.name)) {
        resultFilter[i].push(item);
        break;
      }
    }
  });
  resultFilter.forEach((group) => {
    rs.push(...sortCategory(group, CATEGORIES))
  })

  return rs;
}


export const getItem = (idDatabase, type) => {
  // eslint-disable-next-line eqeqeq
  const index = Areas.findIndex(item => item.id == idDatabase && item.type == type)
  if (index >= 0) {
    return Areas[index]
  }
  if (MapAreas[idDatabase]) {
    return {
      id: MapAreas[idDatabase],
      type,
    }
  }
  return {
    id: idDatabase,
    type,
  };
}

export const findAreaById = areaId => Areas.find(state => state.id === areaId);
