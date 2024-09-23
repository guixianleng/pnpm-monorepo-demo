import { intersectionWith, isEqual, mergeWith, unionWith } from "lodash-es"

import { isArray, isObject } from "./is"

/**
 * 对象转url参数
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ""
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&"
  }
  parameters = parameters.replace(/&$/, "")
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, "?") + parameters
}

/**
 * 递归合并两个对象。
 *
 * @param source 要合并的源对象。
 * @param target  目标对象，合并后结果存放于此。
 * @param mergeArrays
 *        如何合并数组。默认为replace。
 *        - "union": 对数组执行并集操作。
 *        - "intersection": 对数组执行交集操作。
 *        - "concat": 连接数组。
 *        - "replace": 用目标数组替换源数组。
 * @returns 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: "union" | "intersection" | "concat" | "replace" = "replace"
): T & U {
  if (!target) {
    return source as T & U
  }
  if (!source) {
    return target as T & U
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case "union":
          return unionWith(sourceValue, targetValue, isEqual)
        case "intersection":
          return intersectionWith(sourceValue, targetValue, isEqual)
        case "concat":
          return sourceValue.concat(targetValue)
        case "replace":
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays)
    }
    return undefined
  })
}

// 类型判断
export const getObjType = (obj: any) => {
  const toString = Object.prototype.toString
  const map: any = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  }
  if (obj instanceof Element) {
    return "element"
  }
  return map[toString.call(obj)]
}

/**
 * 深度克隆
 * @param data 克隆的数据
 */
export const deepClone = (data: any) => {
  const type = getObjType(data)
  let obj: any
  if (type === "array") obj = []
  else if (type === "object") obj = {}
  else return data
  if (type === "array") {
    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i]
        }
        return data[i]
      })()
      if (data[i]) {
        delete data[i].$parent
      }
      obj.push(deepClone(data[i]))
    }
  } else if (type === "object") {
    for (const key in data) {
      if (data) {
        delete data.$parent
      }
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

/**
 * 过滤对象空值
 * @param {*} obj 过滤的对象
 * @returns 新的对象
 */
export function filterObj<T extends object>(obj: T): Partial<T> {
  const result = {} as Partial<T>
  for (const key in obj) {
    const value = obj[key as keyof T] as any
    if (
      (value === 0 || value === false || value) &&
      value.toString().replace(/(^\s*)|(\s*$)/g, "") !== ""
    ) {
      result[key as keyof T] = value
    }
  }

  return result
}

/**
 * 对象数组去重
 * @param params 去重 params 为对象中的参数
 * @param arr 返回去重后的数据
 */
export function uniqueArr(params: string, arr: any[]) {
  const obj: any = {}
  arr = arr.reduce((item: any, next: any) => {
    // eslint-disable-next-line no-unused-expressions
    obj[next[params]] ? "" : (obj[next[params]] = true && item.push(next))
    return item
  }, [])
  return arr
}

// export function parseHeight(height: number | string) {
//   if (typeof height === 'number') {
//     return height
//   }
//   if (typeof height === 'string') {
//     if (/^\d+(?:px)?$/.test(height)) {
//       return Number.parseInt(height, 10)
//     } else {
//       return height
//     }
//   }
//   return null
// }
