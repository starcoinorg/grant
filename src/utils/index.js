import { isObject, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import querystring from 'qs'

function computeBase(a, b, method, decimals) {
  const x = new BigNumber(a)
  const y = new BigNumber(b)
  if (decimals >= 0) {
    return x[method](y).toFixed(decimals, 1)
  } else {
    return x[method](y)
  }
}

export function object2Array(obj) {
  let result = []
  if (isObject(obj) && !isArray(obj)) {
    result = Object.keys(obj).map((key) => {
      return {
        key,
        ...obj[key]
      }
    })
  }
  return result
}

// bignumber minus
export function minus(a, b, decimals) {
  return computeBase(a, b, 'minus', decimals)
}

// bignumber plus
export function plus(a, b, decimals) {
  return computeBase(a, b, 'plus', decimals)
}

// bignumber multiplied
export function multiplied(a, b, decimals) {
  return computeBase(a, b, 'multipliedBy', decimals)
}

// bignumber divided
export function divided(a, b, decimals) {
  return computeBase(a, b, 'dividedBy', decimals)
}

export function formatNumber(value, precision = 2) {
  value = value ?? ''
  let res = value
    .toString()
    .replace(/[^\d.-]/g, '')
    .replace(/\.{2,}/g, '.')
  const arr = res.split('.')
  if (arr[1] && precision > 0) {
    res = arr[0] + '.' + arr[1].substring(0, precision)
  } else if (arr.length > 1 && precision > 0) {
    res = arr[0] + '.'
  } else {
    res = arr[0]
  }
  if (!res) {
    return undefined
  } else if (!res.split('').some((t) => t != 0)) {
    return Number(res).toString().substring(0, 10)
  } else {
    return res.substring(0, 10)
  }
}

// bignumber fixed number
export function fixedNumber(num, decimals = 0, isStr = false) {
  const result = new BigNumber(num).toFixed(decimals, 1)
  if (isStr) {
    return result
  } else {
    return parseFloat(result)
  }
}

// 格式化分组数据图表数据
export function formatRangeData(list, unit) {
  list = list ?? []
  const data = []
  const dateFormat = unit === 'day' ? '{m}-{d}' : '{h}:{i}'
  list.forEach((t) => {
    const date = parseTime(t.xstep, dateFormat)
    const item = data.find((d) => d.xstep === t.xstep)
    if (item) {
      item.thash = plus(item.thash, t.thash)
      item.hash_with_unit[0] = plus(item.hash_with_unit[0], t.item.hash_with_unit[0])
    } else {
      data.push({
        ...t,
        date
      })
    }
  })
  return data
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const weekStr = (str) => {
    return str
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday

    if (key === 'a') {
      return [weekStr('monday'), weekStr('tuesday'), weekStr('wednesday'), weekStr('thursday'), weekStr('friday'), weekStr('saturday'), weekStr('sunday')][
        value
      ]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function containerHeight(header = true, footer = true) {
  const headerHeight = document.getElementById('header').offsetHeight
  const footerHeight = document.getElementById('footer').offsetHeight
  let height = window.innerHeight
  if (header) height -= headerHeight
  if (footer) height -= footerHeight
  return height
}

export function formatFileSize(fileSize) {
  let temp = 0
  if (fileSize < 1024) {
    return fileSize + 'B'
  } else if (fileSize < 1024 * 1024) {
    temp = fileSize / 1024
    temp = temp.toFixed(2)
    return temp + 'KB'
  } else if (fileSize < 1024 * 1024 * 1024) {
    temp = fileSize / (1024 * 1024)
    temp = temp.toFixed(2)
    return temp + 'MB'
  } else {
    temp = fileSize / (1024 * 1024 * 1024)
    temp = temp.toFixed(2)
    return temp + 'GB'
  }
}

export function bytesToSize(bytes) {
  if (!bytes) return null
  if (bytes === 0) return '0 B'
  var k = 1000, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

export function randomString(len = 32, chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678') {
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function getParam(key) {
  const params = querystring.parse(location.hash.split('?')[1])
  return params[key]
}

export function stringToHex(str) {
  return '0x' + Buffer.from(str, 'utf8').toString('hex')
}

export function priceToAmount(price, precision = 9) {
  return price * 10 ** precision
}

export function durationToSeconds(days) {
  return Math.floor(Date.now() / 1000 + days * 24 * 60 * 60)
}

export function getSuffix(str) {
  let suffix = ''
  if (str) {
    const url = str.split('?')[0]
    const pos = url.lastIndexOf('.')
    if (pos != -1) {
      suffix = url.substring(pos)
    }
  }
  return suffix
}

export function getBodyHeight(percent = 1) {
  return Math.ceil((document.body.clientHeight * percent) / 100)
}

/**
 * Shorty address
 * @param {String} address
 * @returns string | null
 */
export function shortyAddress(address) {
  if (address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  return null
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function formatPrice(price, digits = 4, token = '') {
  return `${(price / 10 ** 9).toFixed(digits)} ${token}`.trim()
}
