import { LANG } from '#/utils/constants'

export const mapTermFromAPI = (response, locale) => {
  const rs = response.data;
  if (locale === LANG.EN) {
    rs.label = rs.english_label;
    rs.content = rs.english_content;
  }
  return rs;
}
