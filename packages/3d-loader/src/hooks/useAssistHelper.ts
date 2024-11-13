import { Ref, unref } from "vue"
import { AxesHelper, GridHelper } from "three"
import Stats from "three/examples/jsm/libs/stats.module"

import type { BasePropsType } from "../props"

let axesHelper: AxesHelper = null as any
let gridHelper: GridHelper = null as any
let stats: any = null

interface IHelperContext {
  ElRef: Ref<HTMLElement | null>
}

export function useAssistHelper({ ElRef }: IHelperContext) {
  // 设置坐标轴和网格助手
  function setAxesAndGridHelper(props: BasePropsType, scene: any) {
    const { enableAxesHelper, enableGridHelper, axesHelperSize } = props
    // 如果启用坐标轴助手，则添加坐标轴，红色为 X 轴，绿色为 Y 轴，蓝色为 Z 轴
    if (enableAxesHelper) {
      axesHelper = new AxesHelper(axesHelperSize)
      scene.add(axesHelper)
    } else {
      if (axesHelper) {
        scene.remove(axesHelper)
      }
    }

    // 如果启用网格助手，则添加网格
    if (enableGridHelper) {
      gridHelper = new GridHelper(2000, 100)
      scene.add(gridHelper)
    } else {
      if (gridHelper) {
        scene.remove(gridHelper)
      }
    }
  }

  // 显示 FPS 统计
  function updateFps(showFps: boolean) {
    if (showFps) {
      if (!stats) {
        stats = new Stats()
      }
      unref(ElRef)?.appendChild(stats.dom)
    }
  }

  return {
    setAxesAndGridHelper,
    updateFps
  }
}
