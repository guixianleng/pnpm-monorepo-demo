import { Slots } from "vue"

import { isFunction } from "./is"

/**
 * @name: LenGxin
 * @description: 插槽处理
 */
export function getSlot(slots: Slots, slot = "default", data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

/**
 * @name LenGxin
 * @param slots
 * @param excludeKeys
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots)
  const ret: any = {}
  // eslint-disable-next-line array-callback-return
  slotKeys.map(key => {
    if (excludeKeys.includes(key)) {
      return null
    }
    ret[key] = () => getSlot(slots, key)
  })
  return ret
}
