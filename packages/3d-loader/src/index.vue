<template>
  <div ref="containerElement" class="viewer-container">
    <canvas ref="canvasElement" class="viewer-canvas" />
  </div>
</template>
<script setup lang="ts" name="vue3dLoader">
import {
  Object3D,
  Scene,
  Vector3,
  Color,
  WebGLRenderer,
  PerspectiveCamera,
  Texture,
  TextureLoader,
  Clock,
  Sprite,
  SpriteMaterial,
  WebGLRendererParameters,
  Group
} from "three"
import { onMounted, ref, watch, onBeforeUnmount, computed } from "vue"

import { baseProps, baseEmits, BasePropsType } from "./props"
import { getSize, getCenter, getLoader, getMTLLoader } from "./util/loadModel"
import { generateCanvas } from "./util/helpers"
import { useAssistHelper } from "./hooks/useAssistHelper"
import { useAnimations } from "./hooks/useAnimations"
import { useListenerEvents } from "./hooks/useListenerEvents"
import { useProcess } from "./hooks/useOnprocess"
import { useControls } from "./hooks/useSetControls"
import { useLights } from "./hooks/useLights"

const props = defineProps(baseProps)

// emit
const emit = defineEmits(baseEmits)

// 定义响应式变量
let object: any = null
let scene: Scene = new Scene()
const camera = new PerspectiveCamera(45, 1, 0.1, 100000)
const clock = new Clock()
let renderer: WebGLRenderer = null as any
let loader: any = null
let requestAnimationId: number = 0
let textureLoader: any = null

// responsive variable
const objectPositionHasSet = ref(false)
const containerElement = ref<HTMLElement | null>(null)
const canvasElement = ref<HTMLCanvasElement>()

const getProps = computed((): BasePropsType => {
  return props
})

// 动画相关
const { updateAnimate, isMultipleModels, playAnimations } = useAnimations({
  getObject: getAllObject
})
// 辅助、性能调试相关
const { setAxesAndGridHelper, updateFps } = useAssistHelper({
  ElRef: containerElement
})
// 监听事件相关
const { size, onResize, addEventsLinstener, removeEventsListener } = useListenerEvents({
  ElRef: containerElement,
  getModelObject: getAllObject,
  getProps: props,
  camera: camera,
  emit: emit
})
// 处理加载进度
const { loaderIndex, onProcess } = useProcess()
// 控制器相关
const {
  updateControls,
  initControls,
  setVerticalHorizontalControls,
  destroyControls,
  controlsUpdate
} = useControls({ getProps })
// 光源相关
const { updateLights, setLightFollowCamera } = useLights({ getProps, scene })

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroyScene()
})

watch(
  () => props.autoPlay,
  val => {
    playAnimations(val)
  }
)

watch(
  () => [props.width, props.height],
  () => {
    size.value = {
      width: props.width || 0,
      height: props.height || 0
    }
  }
)

watch(
  () => [props.enableAxesHelper, props.axesHelperSize, props.enableGridHelper],
  () => {
    setAxesAndGridHelper(props, scene)
  }
)

watch(
  () => [props.minDistance, props.maxDistance],
  () => {
    setVerticalHorizontalControls()
  }
)

watch(
  [
    () => props.filePath,
    () => props.fileType,
    () => props.mtlPath,
    () => props.clearScene,
    () => props.backgroundAlpha,
    () => props.backgroundColor
  ],
  valueArray => {
    if (valueArray[0] || valueArray[1]) {
      resetScene()
    }
    if (valueArray[2]) {
      loadModelSelect()
    }
    if (valueArray[3]) {
      clearWholeScene()
    }
    if (valueArray[4] || valueArray[5]) {
      updateRenderer()
    }
  },
  { deep: true }
)
watch(
  () => [props.rotation, props.position, props.scale, props.lights],
  valueArray => {
    const attr = ["rotation", "position", "scale"]
    valueArray.forEach((item, index) => {
      if (index < 3 && item) {
        setObjectAttribute(attr[index], item)
      } else {
        updateLights()
      }
    })
  },
  { deep: true }
)

watch(
  () => size,
  () => {
    updateCamera(true)
    updateRenderer()
  },
  { deep: true }
)

watch(
  () => props.controlsOptions,
  () => {
    updateControls()
  },
  { deep: true }
)

watch(
  () => [props.cameraRotation, props.cameraPosition],
  () => {
    updateCamera()
  },
  { deep: true }
)

watch(
  () => props.labels,
  () => {
    setSpriteLabel()
  },
  { deep: true }
)

// Dynamic reload filePath
function resetScene() {
  destroyScene()
  init()
}

function destroyScene() {
  if (requestAnimationId) {
    cancelAnimationFrame(requestAnimationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  destroyControls()
  // 移除事件监听器
  removeEventsListener()
  object = null
  if (scene) {
    scene.clear()
  }
}

function init() {
  const { filePath, webGLRendererOptions, labels } = props

  // 判断是否为多个模型
  if (filePath && Array.isArray(filePath)) {
    isMultipleModels.value = true
  }

  // 获取容器元素并设置样式
  const el = containerElement.value as HTMLElement
  setContainerElementStyle(el)

  // 初始化画布尺寸
  onResize()
  // 初始化 WebGL 渲染器参数
  const options: WebGLRendererParameters = {
    antialias: true,
    alpha: true,
    ...webGLRendererOptions,
    canvas: canvasElement.value
  }

  if (!renderer) {
    renderer = new WebGLRenderer(options)
    // renderer.hadowMapEnabled = true
    renderer.shadowMap.enabled = true
  }

  initControls(camera, el)
  setVerticalHorizontalControls()
  // 设置坐标轴和网格助手
  setAxesAndGridHelper(props, scene)
  loadModelSelect()
  update()
  // 添加事件监听器
  addEventsLinstener()
  animate()
  // Init labels
  if (labels && labels.length > 0) {
    setSpriteLabel()
  }
}

// 获取场景中的所有对象
function getAllObject() {
  // 如果是多个模型，返回场景对象，否则返回单个对象
  return isMultipleModels.value ? scene : object
}

function setContainerElementStyle(el: HTMLElement) {
  const { width, height } = props
  if (width) {
    el.style.width = `${width}px`
  }
  if (height) {
    el.style.height = `${height}px`
  }
}

// 更新渲染器、相机、光源和控制器
function update() {
  updateRenderer()
  updateCamera()
  updateLights()
  updateControls()
}

// 更新模型的位置信息、旋转信息和缩放信息
function updateModel() {
  if (!object) return
  const index = isMultipleModels.value ? getObjectIndex(object) : null
  const { position, rotation, scale } = props
  if (position) {
    // 判断 position 是否为数组，若是数组则处理为多个模型的情况
    if (position instanceof Array) {
      // 如果是数组且存在索引，更新对应索引位置的模型位置，否则设置为默认位置 (0, 0, 0)
      if (index != null) {
        object.position.set(position[index].x, position[index].y, position[index].z)
      } else {
        object.position.set(0, 0, 0)
      }
    } else {
      // 如果 position 是单个对象，直接更新位置
      object.position.set(position.x, position.y, position.z)
    }
  }

  // 更新旋转
  if (rotation) {
    if (rotation instanceof Array) {
      if (index != null) {
        // 如果是数组且存在索引，更新对应索引位置的旋转
        object.rotation.set(rotation[index].x, rotation[index].y, rotation[index].z)
      } else {
        // 如果没有索引，设置为默认旋转值 (0, 0, 0)
        object.rotation.set(0, 0, 0)
      }
    } else {
      // 如果 rotation 是单个对象，直接更新旋转
      object.rotation.set(rotation.x, rotation.y, rotation.z)
    }
  }

  // 更新缩放
  if (scale) {
    if (scale instanceof Array) {
      if (index != null) {
        // 如果是数组且存在索引，更新对应索引位置的缩放
        object.scale.set(scale[index].x, scale[index].y, scale[index].z)
      } else {
        // 如果没有索引，设置为默认缩放 (1, 1, 1)
        object.scale.set(1, 1, 1)
      }
    } else {
      // 如果 scale 是单个对象，直接更新缩放
      object.scale.set(scale.x, scale.y, scale.z)
    }
  }
}

// 更新渲染器设置，包括背景色、分辨率等
function updateRenderer() {
  const { backgroundColor, backgroundAlpha } = props
  renderer.setSize(size.value.width, size.value.height)

  // 设置设备像素比，确保在高分辨率设备上渲染清晰
  renderer.setPixelRatio(window.devicePixelRatio || 1)

  // 更新渲染器的背景颜色和透明度
  renderer.setClearColor(new Color(backgroundColor).getHex())
  renderer.setClearAlpha(backgroundAlpha as any)
}

// 更新相机的位置、旋转和视角
function updateCamera(isResize?: boolean) {
  const { cameraPosition, cameraRotation, cameraUp, cameraLookAt } = props

  // 更新相机的宽高比，并更新投影矩阵
  camera.aspect = size.value.width / size.value.height
  camera.updateProjectionMatrix()
  if (isResize) return

  // 如果没有传入 cameraLookAt 和 cameraUp，默认让相机看向物体
  if (!cameraLookAt || !cameraUp) {
    if (!object) return
    const distance = getSize(object).length()
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    if (cameraRotation) {
      // 如果有旋转信息，更新相机的旋转
      camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z)
    }

    // 如果相机的位置是原点 (0, 0, 0)，则将相机放置在物体的距离上
    if (cameraPosition.x === 0 && cameraPosition.y === 0 && cameraPosition.z === 0) {
      camera.position.z = distance
    }

    // 默认相机看向原点
    camera.lookAt(new Vector3())
  } else {
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    if (cameraRotation) {
      camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z)
    }

    // 设置相机的上方向
    camera.up.set(cameraUp.x, cameraUp.y, cameraUp.z)

    // 设置相机的目标位置，让相机朝向指定位置
    camera.lookAt(new Vector3(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z))
  }
}
// 更新光源

// 加载选择的模型
function loadModelSelect() {
  const { filePath, parallelLoad } = props
  // If enable parallel load
  if (parallelLoad && isMultipleModels.value) {
    ;(filePath as any).forEach((path: string, index: number) => {
      // 根据模型索引加载模型
      load(index)
    })
  } else {
    // 否则加载单个模型
    load()
  }
}
function load(fileIndex?: number) {
  const {
    filePath,
    fileType,
    crossOrigin,
    requestHeader,
    mtlPath,
    enableDraco,
    dracoDir,
    plyMaterial
  } = props
  if (!filePath) return
  const index = fileIndex || loaderIndex.value

  // 根据是否是多个模型，确定文件路径的类型
  const filePathString: any = !isMultipleModels.value ? filePath : filePath[index]
  const fileTypeString: string =
    typeof fileType === "string" ? fileType : fileType ? fileType[index] : ""

  // 获取加载器对象，包含 loader 和 getObject 等方法
  const loaderObject3d: any = getLoader(
    filePathString,
    fileTypeString,
    enableDraco,
    plyMaterial,
    dracoDir
  )
  loader = loaderObject3d.loader
  const getObjectFun = loaderObject3d.getObject ? loaderObject3d.getObject : getObject
  if (object && index === 0) {
    scene.remove(object)
  }

  // 设置请求头和跨域设置（如果有的话）
  if (requestHeader) {
    loader.setRequestHeader(requestHeader)
  }
  if (crossOrigin) {
    loader.setCrossOrigin(crossOrigin)
  }

  // 如果存在 mtlPath，则加载材质
  if (mtlPath) {
    // load materials
    const isMultipleMTL = typeof mtlPath === "object"
    if (!isMultipleMTL) {
      // 如果是单一材质，直接加载
      loadMtl(filePathString, getObjectFun, index)
    } else {
      if (!mtlPath[index]) {
        loadFilePath(filePathString, getObjectFun, index)
        return
      }
      loadMtl(filePathString, getObjectFun, index)
    }
  } else {
    // 如果没有材质，则直接加载模型
    loadFilePath(filePathString, getObjectFun, index)
  }
}

// 加载文件路径的函数
function loadFilePath(filePath: string, getObject: any, index: number) {
  const { textureImage, parallelLoad } = props
  loader.load(
    filePath,
    (...args: any) => {
      const obj = getObject(...args)
      object = obj
      // 将对象添加到场景中
      addObject(object, filePath)
      // 如果需要加载纹理，设置纹理
      if (textureImage) {
        const _texture = typeof textureImage === "string" ? textureImage : textureImage[index]
        if (_texture) {
          addTexture(object, _texture)
        }
      }
      emit("load", scene)
    },
    (event: ProgressEvent) => {
      // 如果不是并行加载，更新进度
      if (!parallelLoad) {
        onProcess({
          xhr: event,
          isMultiple: isMultipleModels.value,
          load,
          filePath: props.filePath
        })
      }
      const modelIndex = loaderIndex.value + 1
      emit("process", event, modelIndex)
    },
    (error: ErrorEvent) => {
      emit("error", error)
    }
  )
}

// 加载材质的函数
function loadMtl(filePath: string, getObject: any, index: number) {
  const { crossOrigin, requestHeader, mtlPath } = props

  // 获取材质加载器
  const mtlLoader = getMTLLoader()
  if (crossOrigin) {
    mtlLoader.setCrossOrigin(crossOrigin)
  }
  if (requestHeader) {
    mtlLoader.setRequestHeader(requestHeader as any)
  }

  // 获取对应索引的材质路径
  const mtl = typeof mtlPath === "string" ? mtlPath : mtlPath[index]
  const mtlPathArray: any = /^(.*\/)([^/]*)$/.exec(mtl)
  const path = mtlPathArray[1]
  const file = mtlPathArray[2]
  // 设置材质加载器的路径并加载材质
  mtlLoader.setPath(path).load(file, (materials: any) => {
    materials.preload()
    loader.setMaterials(materials)
    loadFilePath(filePath, getObject, index)
  })
}
function getObject(object: any) {
  return object
}

// 向场景中添加对象
function addObject(obj: Object3D, filePath: string) {
  // 获取对象的中心点位置
  const center = getCenter(object)

  // 只在加载第一个模型时设置场景的位置信息，防止每次加载模型时修改场景位置
  if (!objectPositionHasSet.value) {
    scene.position.copy(center.negate())
    // 标记已经设置过位置
    objectPositionHasSet.value = true
  }
  object = obj
  // 提取文件名并赋值给对象
  let fileName: any = filePath.split("/")
  fileName = fileName[fileName.length - 1]
  object.fileName = fileName

  // 将对象添加到场景中
  scene.add(object)

  // 更新相机和模型
  updateCamera()
  updateModel()

  // 播放动画
  playAnimations(props.autoPlay)
}

// 动画更新函数
function animate() {
  requestAnimationId = requestAnimationFrame(animate)
  updateFps(props.showFps)

  // 更新动画
  const delta = clock.getDelta()
  updateAnimate(delta)

  // 更新控制器
  controlsUpdate()

  render()
}

// 渲染函数
function render() {
  const { pointLightFollowCamera } = props

  // 如果启用点光源跟随相机，则设置光源跟随相机
  if (pointLightFollowCamera) {
    setLightFollowCamera(camera)
  }

  // 渲染场景和相机
  renderer.render(scene, camera)
}

// 向对象添加纹理
function addTexture(object: Object3D, texture: any) {
  if (!textureLoader) {
    textureLoader = new TextureLoader()
  }
  object.traverse((child: any) => {
    if (child.isMesh) {
      textureLoader.load(
        texture,
        (_texture: any) => {
          child.material.map = _texture
          child.material.needsUpdate = true
        },
        () => {},
        (err: any) => {
          emit("error", err)
        }
      )
    }
  })
}

// 清空场景
function clearWholeScene() {
  scene.clear()
}

// 设置对象的属性（例如位置、缩放、旋转等）
function setObjectAttribute(type: string, val: any) {
  const obj = getAllObject()
  if (!obj) return
  if (isMultipleModels.value) {
    obj.children.forEach((item: any) => {
      const index = getObjectIndex(item)
      const v = type === "scale" ? 1 : 0
      val[index]
        ? item[type].set(val[index].x, val[index].y, val[index].z)
        : item[type].set(v, v, v)
    })
    return
  }
  obj[type].set(val.x, val.y, val.z)
}

function setSpriteLabel() {
  const { labels } = props
  if (!labels || labels.length <= 0) return
  clearSprite()
  const obj = isMultipleModels.value ? scene : object
  const spriteImageLabel = (image: any) => {
    if (!textureLoader) {
      textureLoader = new TextureLoader()
    }
    const imageTexture = textureLoader.load(image)
    return imageTexture
  }

  // 生成文本纹理
  const spriteTextLabel = (text: string, style: object) => {
    const canvas = generateCanvas(text, style)
    const texture = new Texture(canvas)
    texture.needsUpdate = true
    return texture
  }

  labels.forEach((item: any) => {
    const spriteMap = item.image
      ? spriteImageLabel(item.image)
      : spriteTextLabel(item.text, item.textStyle || {})
    const spriteMaterial = new SpriteMaterial({
      map: spriteMap,
      color: item.spriteMaterialColor || 0xffffff
      // useScreenCoordinates: false
      // alignment: spriteAlignment
    })
    const sprite: any = new Sprite(spriteMaterial)

    // 设置缩放
    if (item.scale) {
      sprite.scale.set(item.scale.x || 1, item.scale.y || 1, item.scale.z || 0)
    } else {
      sprite.scale.set(1, 1, 0)
    }
    // 设置位置
    if (item.position) {
      sprite.position.set(item.position.x, item.position.y, item.position.z)
    }

    // 设置SID（唯一标识符）
    if (item.sid) {
      sprite.sid = item.sid
    }
    obj.add(sprite)
  })
}
function clearSprite() {
  const sceneChildren = scene.children
  for (let i = sceneChildren.length - 1; i >= 0; i--) {
    const item = sceneChildren[i]
    if (item) {
      // If have only one model the Sprite in Group
      if (item instanceof Group && item.children) {
        scene.children[i].children = item.children
          .map((_item: any) => {
            if (_item instanceof Sprite) {
              return null
            }
            return _item
          })
          .filter((item: any) => item)
      }
      // If have multiple models the Sprite in children
      if (item instanceof Sprite) {
        scene.remove(item)
      }
    }
  }
}

// 获取索引的对象
function getObjectIndex(object: any) {
  const { filePath } = props
  let objIndex: any

  // 如果 filePath 是数组，则查找文件名匹配的索引
  if (Array.isArray(filePath)) {
    objIndex = filePath
      .map((item, index) => {
        if (item.indexOf(object.fileName) > -1) {
          return index
        }
      })
      .filter(i => i != undefined)[0]
  }
  return objIndex
}

// 导出公共变量，供外部访问
defineExpose({
  camera,
  scene
})
</script>
<style scoped lang="scss">
@use "./style.scss";
</style>
