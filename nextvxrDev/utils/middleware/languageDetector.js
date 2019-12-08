

// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl')

Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

const { readFileSync } = require('fs')
const { basename } = require('path')
const glob = require('glob')
const get = require('lodash.get');
const useragent = require('express-useragent');

// Get the supported languages by looking for translations in the `lang/` dir.
glob.sync('../../lang/*.json').map(f => basename(f, '.json'))

// Allowed Files
const localeFiles = {
  'en-US': 'en-US',
  'vi-VN': 'vi-VN',
}
// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map()
const getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0]
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
    const localeDataScript = readFileSync(localeDataFile, 'utf8')
    localeDataCache.set(lang, localeDataScript)
  }
  return localeDataCache.get(lang)
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = locale => require(`../../lang/${locale}.json`)

module.exports = (req, res, cb) => {

  const path = get(req, 'path', '/')
  let locale = get(path.split('/'), '[1]') || req.query.lang
  req.ua = useragent.parse(req.headers['user-agent']);
  if (localeFiles[locale] || locale === undefined) {
    locale = localeFiles[locale] || 'vi-VN'
    req.locale = locale
    req.localeDataScript = getLocaleDataScript(locale)
    req.messages = getMessages(locale) || {}
    req.headers['Accept-Language'] = locale
    cb()
  } else {
    cb()
  }
}
