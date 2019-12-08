import { LANG } from '#/utils/constants'

export const mapIBBanksFromAPI = (response) => {
  const rs = response.map(item => ({ ...item, label: item.display_name }))
  return rs;
}

export const mapTransferBanksFromAPI = (response, lang) => {
  const rs = response.data.map(item => ({
    ...item,
    label: lang === LANG.VN ? item.name : item.english_name,
  }))
  return rs;
}
