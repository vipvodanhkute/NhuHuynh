

import { LANG } from '#/utils/constants'

export const mapFromAPI = (response, locale) => {
  let rs = response.data;
  rs = rs.filter(x => +x.Status === 1)
  // rs = rs.map(x => ({ Images: JSON.parse(x.Images) }))
  const temp = []
  rs.forEach((element) => {
    temp.push(...element.Images)
  });
  rs = temp;
  rs = rs.filter(img => img.Device === '2')

  if (locale === LANG.EN) {
    rs = rs.map(item => ({
      ...item,
      Name: item.EnglishName,
      Alt: item.EnglishAlt,
      Url: item.EnglishUrl,
      Source: item.EnglishSource,
    }))
  }
  return rs;
}
