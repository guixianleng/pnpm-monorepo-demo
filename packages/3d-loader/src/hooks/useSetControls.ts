import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BasePropsType } from "../props"
import { ComputedRef, unref } from "vue"

interface IControlsContext {
  getProps: ComputedRef<BasePropsType>
}

let controls: OrbitControls = {} as any

export function useControls({ getProps }: IControlsContext) {
  // 初始化控制器
  function initControls(camera: any, el: HTMLElement) {
    const { enableDamping, dampingFactor } = unref(getProps)
    if (!controls || Object.keys(controls).length <= 0) {
      controls = new OrbitControls(camera, el)
      if (enableDamping) {
        controls.enableDamping = true
        if (dampingFactor != undefined) {
          controls.dampingFactor = dampingFactor
        }
      }
    }
  }

  // 设置垂直水平控件
  function setVerticalHorizontalControls() {
    if (!controls) return

    const { verticalCtrl, horizontalCtrl, minDistance, maxDistance } = unref(getProps)

    // 设置垂直控制
    if (verticalCtrl) {
      if (typeof verticalCtrl === "boolean") {
        controls.minAzimuthAngle = controls.maxAzimuthAngle = -2 * Math.PI
      } else if (typeof verticalCtrl === "object") {
        controls.minAzimuthAngle = verticalCtrl.min ?? -2 * Math.PI
        controls.maxAzimuthAngle = verticalCtrl.max ?? 2 * Math.PI
      }
    }

    // 设置水平控制
    if (horizontalCtrl) {
      if (typeof horizontalCtrl === "boolean") {
        controls.minPolarAngle = controls.maxPolarAngle = 1
      } else if (typeof horizontalCtrl === "object") {
        controls.minPolarAngle = horizontalCtrl.min ?? 0
        controls.maxPolarAngle = horizontalCtrl.max ?? Math.PI
      }
    }

    // 设置距离限制
    if (typeof minDistance === "number" && minDistance !== 0) {
      controls.minDistance = minDistance
    }
    if (typeof maxDistance === "number" && maxDistance !== Infinity) {
      controls.maxDistance = maxDistance
    }
  }

  function destroyControls() {
    if (controls && Object.keys(controls).length > 0) {
      controls.dispose()
      controls = {} as any
    }
  }

  // 更新控制器
  function updateControls() {
    const { controlsOptions } = unref(getProps)
    if (controlsOptions) {
      Object.assign(controls, controlsOptions)
    }
  }

  function controlsUpdate() {
    controls?.update()
  }

  return {
    initControls,
    setVerticalHorizontalControls,
    destroyControls,
    updateControls,
    controlsUpdate
  }
}
