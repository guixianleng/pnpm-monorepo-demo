const { toString } = Object.prototype

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== "undefined"
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, "Object")
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isString(val: unknown): val is string {
  return is(val, "String")
}

export function isFunction(val: unknown) {
  return typeof val === "function"
}

export function isNumber(val: unknown): val is number {
  return is(val, "Number")
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isDate(val: unknown): val is Date {
  return is(val, "Date")
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, "Boolean")
}

// 是否为http(s)链接
export function isHttpUrl(path: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  return reg.test(path)
}

// 是否为驼峰
export function isPascalCase(str: string): boolean {
  const regex = /^[A-Z][A-Za-z]*$/
  return regex.test(str)
}

/**
 * 验证十进制数字
 */
export function isDigit(value: string) {
  // eslint-disable-next-line no-useless-escape
  return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}
