import { ref, nextTick } from "vue"

import type { Fn } from "../types"

interface IProcess {
  xhr: ProgressEvent
  isMultiple: boolean
  load: Fn
  filePath: string[] | string
}

export function useProcess() {
  const loaderIndex = ref<number>(0)

  // 处理加载进度
  function onProcess({ xhr, isMultiple, filePath, load }: IProcess) {
    const process = Math.floor((xhr.loaded / xhr.total) * 100)
    if (process === 100) {
      // 加载完成时的处理逻辑
      if (isMultiple && filePath.length > loaderIndex.value) {
        // 如果有多个模型，继续加载下一个模型
        nextTick(() => {
          loaderIndex.value++
          if (loaderIndex.value === filePath.length) {
            loaderIndex.value = 0
            return
          }
          load()
        })
      } else {
        loaderIndex.value = 0
      }
    }
  }

  return {
    loaderIndex,
    onProcess
  }
}
