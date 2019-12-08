import get from 'lodash.get'

function ucFirstAllWords(str) {
  const pieces = str.split(' ');
  for (let i = 0; i < pieces.length; i += 1) {
    const j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].substr(1).toLowerCase();
  }
  return pieces.join(' ');
}

export function convertVietnameseToEnglish(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    '-',
  );

  /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
  str = str.replace(/-+-/g, '-'); // thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, '');
  // cắt bỏ ký tự - ở đầu và cuối chuỗi
  return str;
}

export function formatEnglishLocation(str) {
  const enStr = convertVietnameseToEnglish(str);
  const enStrFormat = enStr.replace(/-/g, ' ');
  const locationName = ucFirstAllWords(enStrFormat);

  return locationName;
}

const localeFiles = {
  'en-US': 'en-US',
  'vi-VN': 'vi-VN',
}

export function detectLanguage(url) {
  let locale = get(url.split('/'), '[3]', '')
  if (localeFiles[locale] || locale === '') {
    locale = localeFiles[locale] || 'vi-VN'
    return locale
  }
  return ''
}
