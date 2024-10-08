import { getDicts } from "@user-admin/api"
import { getCurrentInstance } from "vue"
import { useDictStore } from "@user-admin/store"
/**
 * 获取字典数据
 */
export const useDict = (...args: string[]): { [key: string]: DictDataOption[] } => {
  const res = ref<{
    [key: string]: DictDataOption[]
  }>({})

  const appContext = getCurrentInstance()?.appContext.config.globalProperties
  if (!appContext?.$pinia) return {}
  return (() => {
    args.forEach(async dictType => {
      res.value[dictType] = []
      const dicts = useDictStore().getDict(dictType)
      if (dicts) {
        res.value[dictType] = dicts
      } else {
        await getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data?.map(
            (p): DictDataOption => ({
              label: p.dictLabel,
              value: (/^\d+$/.test(p.dictValue)
                ? Number(p.dictValue)
                : p.dictValue) as unknown as string,
              elTagType: p.listClass,
              elTagClass: p.cssClass
            })
          )
          useDictStore().setDict(dictType, res.value[dictType])
        })
      }
    })
    return res.value
  })()
}
