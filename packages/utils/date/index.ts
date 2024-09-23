import { isDate } from '../is'

/**
 * @description 日期的月或日补零操作
 * @param {String} value 需要补零的值
 */
export function padZero(value: number | string) {
  return `00${value}`.slice(-2)
}

function convertToDate(date: string | number) {
  let time
  if (isDate(date)) {
    time = new Date(date)
  } else if (/^\d{10}$/.test(date.toString().trim())) {
    // 若为时间戳，则转为毫秒时间戳
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    time = new Date(date * 1000)
  } else if (typeof date === 'string' && /^\d+$/.test(date.trim())) {
    // 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
    time = new Date(Number(date))
  } else {
    time = new Date(typeof date === 'string' ? date.replace(/-/g, '/') : date)
  }
  return time
}

type FormatOptions = 'YYYY' | 'MM' | 'DD' | 'HH' | 'hh' | 'mm' | 'ss' | 'A' | 'a' | 'h' | 'm' | 's'

/**
 * 时间格式化
 * @param dateTime 日期或者时间戳
 * @param format[string] 格式化规则 YYYY:MM:DD|YYYY:MM|YYYY年MM月DD日，可自定义组合 默认YYYY-MM-DD
 * @returns
 */
export function formatDate(dateTime: string | number, format = 'YYYY-MM-DD'): string {
  let date
  // 若传入时间为假值，则取当前时间
  if (!dateTime) {
    date = new Date()
  } else {
    date = convertToDate(dateTime)
  }

  const replacements: { [key in FormatOptions]: string } = {
    YYYY: String(date.getFullYear()),
    MM: padZero(date.getMonth() + 1),
    DD: padZero(date.getDate()),
    HH: padZero(date.getHours()),
    hh: padZero(((date.getHours() + 11) % 12) + 1),
    mm: padZero(date.getMinutes()),
    ss: padZero(date.getSeconds()),
    h: String(((date.getHours() + 11) % 12) + 1),
    m: date.getMinutes(),
    s: date.getSeconds(),
    A: date.getHours() >= 12 ? 'PM' : 'AM',
    a: date.getHours() >= 12 ? 'pm' : 'am',
  }

  return format.replace(
    /YYYY|MM|DD|HH|hh|mm|ss|h|m|s|A|a/g,
    match => replacements[match as FormatOptions]
  )
}

/**
 * @description 时间戳转为多久之前
 * @param {String|Number} timestamp 时间戳
 * @returns {string} 距今多久之前
 */
export function timeAgo(timestamp: string | number) {
  if (timestamp == null) timestamp = Number(new Date())
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  timestamp = parseInt(timestamp)
  // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
  if (timestamp.toString().length == 10) timestamp *= 1000
  const timer = (new Date().getTime() - timestamp) / 1000
  switch (true) {
    case timer < 60:
      return `${Math.floor(timer)}秒前`
    case timer >= 60 && timer < 3600:
      return `${Math.floor(timer / 60)}分钟前`
    case timer >= 3600 && timer < 86400:
      return `${Math.floor(timer / 3600)}小时前`
    case timer >= 86400 && timer < 2592000:
      return `${Math.floor(timer / 86400)}天前`
    case timer >= 2592000 && timer < 31536000:
      return `${Math.floor(timer / 2592000)}个月前`
    default:
      return `${Math.floor(timer / 31536000)}年前`
  }
}
