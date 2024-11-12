import { Ref, unref, nextTick, ref } from "vue"
import { Vector2, Raycaster } from "three"

import type { Fn, EmitType } from "../types"
import type { BasePropsType } from "../props"

interface IEventsContenxt {
  ElRef: Ref<HTMLElement | null>
  getModelObject: Fn
  camera: any
  emit: EmitType
  getProps: BasePropsType
}

export function useListenerEvents({
  ElRef,
  getModelObject,
  getProps,
  camera,
  emit
}: IEventsContenxt) {
  const raycaster = new Raycaster()
  const mouse = new Vector2()

  const size = ref({ width: getProps.width || 0, height: getProps.height || 0 })

  function enableMousemoveEvent(enable: boolean) {
    // 根据 enable 标志来添加或移除 mousemove 事件监听器
    if (enable) {
      unref(ElRef)?.addEventListener("mousemove", onMouseMove, false)
    } else {
      unref(ElRef)?.removeEventListener("mousemove", onMouseMove, false)
    }
  }

  function onMouseDown(event: MouseEvent) {
    enableMousemoveEvent(false)
    const intersected = pick(event.clientX, event.clientY)
    emit("mousedown", event, intersected)
  }

  // 获取鼠标移动位置的交互物体
  function onMouseMove(event: MouseEvent) {
    const intersected = pick(event.clientX, event.clientY)
    emit("mousemove", event, intersected)
  }

  // 获取鼠标释放位置的交互物体
  function onMouseUp(event: MouseEvent) {
    const intersected = pick(event.clientX, event.clientY)
    emit("mouseup", event, intersected)

    // 重新启用 mousemove 事件监听
    enableMousemoveEvent(true)
  }

  // 获取点击位置的交互物体
  function onClick(event: MouseEvent) {
    const intersected = pick(event.clientX, event.clientY)
    emit("click", event, intersected)
  }

  // 获取双击位置的交互物体
  function onDblclick(event: MouseEvent) {
    const intersected = pick(event.clientX, event.clientY)
    emit("dblclick", event, intersected)
  }

  function pick(x: number, y: number) {
    const obj = getModelObject() // 获取所有可交互的对象

    // 如果没有对象或容器元素，则返回 null
    if (!obj || !ElRef) return null

    // 获取容器元素的矩形边界，计算鼠标相对于容器的坐标
    const rect = unref(ElRef)?.getBoundingClientRect() as DOMRect
    x -= rect.left
    y -= rect.top
    mouse.x = (x / size.value.width) * 2 - 1
    mouse.y = -(y / size.value.height) * 2 + 1

    // 设置射线投射器的相机和鼠标位置
    raycaster.setFromCamera(mouse, camera)

    // 检查射线是否与对象相交，返回第一个相交的对象
    const intersects = raycaster.intersectObject(obj, getProps.intersectRecursive)
    return (intersects && intersects.length) > 0 ? intersects[0] : null
  }

  function onResize() {
    const { width, height } = getProps
    nextTick(() => {
      const el = unref(ElRef) as HTMLElement
      size.value = {
        width: width || el.offsetWidth,
        height: height || el.offsetHeight
      }
    })
  }

  function addEventsLinstener() {
    enableMousemoveEvent(true)
    unref(ElRef)?.addEventListener("mousedown", onMouseDown, false)
    unref(ElRef)?.addEventListener("mouseup", onMouseUp, false)
    unref(ElRef)?.addEventListener("click", onClick, false)
    unref(ElRef)?.addEventListener("dblclick", onDblclick, false)
    window.addEventListener("resize", onResize, false)
  }

  function removeEventsListener() {
    unref(ElRef)?.removeEventListener("mousedown", onMouseDown, false)
    unref(ElRef)?.removeEventListener("mousemove", onMouseMove, false)
    unref(ElRef)?.removeEventListener("mouseup", onMouseUp, false)
    unref(ElRef)?.removeEventListener("click", onClick, false)
    unref(ElRef)?.removeEventListener("dblclick", onDblclick, false)
    window.removeEventListener("resize", onResize, false)
  }

  return {
    enableMousemoveEvent,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onClick,
    onDblclick,
    pick,
    onResize,
    addEventsLinstener,
    removeEventsListener,
    size
  }
}
