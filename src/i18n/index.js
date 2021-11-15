import { createI18n } from 'vue-i18n'

const languages = require.context('./languages', true, /\.json$/)

const messages = languages.keys().reduce((messages, path) => {
  const key = path.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = languages(path)
  messages[key] = value
  return messages
}, {})

const datetimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: '2-digit'
    }
  },
  zh: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }
  }
}

export default createI18n({
  locale: 'zh',
  fallbackLocale: {
    default: ['zh']
  },
  messages,
  datetimeFormats
})
