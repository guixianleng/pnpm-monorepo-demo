import { ref } from "vue"
/**
 * 字典数据  数据配置
 */
export declare interface DictDataOption {
  label: string
  value: string
  disabled?: boolean
  elTagType?: "primary" | "success" | "info" | "warning" | "danger"
  elTagClass?: string
}

declare interface IDictList {
  key: string
  value: DictDataOption[]
}

export function dictUtil() {
  const dict = ref<IDictList[]>([])

  /**
   * 获取字典
   * @param _key 字典key
   */
  const getDict = (_key: string): DictDataOption[] | null => {
    if (_key == null && _key == "") {
      return null
    }
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key == _key) {
          return dict.value[i].value
        }
      }
    } catch (e) {
      console.log(e)
      return null
    }
    return null
  }

  /**
   * 设置字典
   * @param _key 字典key
   * @param _value 字典value
   */
  const setDict = (_key: string, _value: DictDataOption[]) => {
    if (_key !== null && _key !== "") {
      dict.value.push({
        key: _key,
        value: _value
      })
    }
  }

  /**
   * 删除字典
   * @param _key
   */
  const removeDict = (_key: string): boolean => {
    let bln = false
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key == _key) {
          dict.value.splice(i, 1)
          return true
        }
      }
    } catch (e) {
      console.log(e)
      bln = false
    }
    return bln
  }

  /**
   * 清空字典
   */
  const cleanDict = (): void => {
    dict.value = []
  }

  return {
    dict,
    getDict,
    setDict,
    removeDict,
    cleanDict
  }
}
