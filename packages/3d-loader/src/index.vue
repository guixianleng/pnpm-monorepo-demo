<template>
  <div ref="containerElement" class="viewer-container">
    <canvas ref="canvasElement" class="viewer-canvas" />
  </div>
</template>
<script setup lang="ts" name="vue3dLoader">
import {
  Object3D,
  Vector2,
  Vector3,
  Color,
  Scene,
  Raycaster,
  WebGLRenderer,
  PerspectiveCamera,
  AmbientLight,
  PointLight,
  HemisphereLight,
  DirectionalLight,
  Texture,
  TextureLoader,
  AnimationMixer,
  Clock,
  Sprite,
  SpriteMaterial,
  WebGLRendererParameters,
  AnimationClip,
  Light,
  AxesHelper,
  GridHelper,
  Group
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"
import { getSize, getCenter, getLoader, getMTLLoader } from "../util/loadModel"
import { onMounted, ref, withDefaults, nextTick, watch, onBeforeUnmount } from "vue"
import type { ICoordinates, IControlsValue, IPlyMaterial, IEncode } from "../types"

interface Props {
  filePath: string | string[] // 文件路径，可以是字符串或字符串数组
  fileType?: string | string[] // 文件类型（3D 模型文件的扩展名），用于文件路径没有扩展名的情况
  width?: number // 3D 视图的宽度
  height?: number // 3D 视图的高度
  position?: ICoordinates | ICoordinates[] // 3D 对象的位置，单个或多个坐标
  rotation?: ICoordinates | ICoordinates[] // 3D 对象的旋转，单个或多个坐标
  scale?: ICoordinates | ICoordinates[] // 3D 对象的缩放，单个或多个坐标
  lights?: object[] // 灯光配置数组
  cameraPosition?: ICoordinates // 摄像机位置坐标
  cameraRotation?: ICoordinates // 摄像机旋转坐标
  cameraUp?: ICoordinates // 摄像机的“上”方向
  cameraLookAt?: ICoordinates // 摄像机的“注视”点坐标
  backgroundColor?: number | string // 背景颜色，支持数值或字符串
  backgroundAlpha?: number // 背景透明度
  controlsOptions?: object // 控件选项
  crossOrigin?: string // 资源跨域配置
  requestHeader?: object // 请求头配置
  outputEncoding?: IEncode // 输出编码
  webGLRendererOptions?: object // WebGL 渲染器的其他选项
  mtlPath?: string | string[] // 材质文件路径
  showFps?: boolean // 是否显示 FPS
  textureImage?: string | string[] // 纹理图片路径
  clearScene?: boolean // 是否清除场景
  parallelLoad?: boolean // 是否并行加载
  labels?: object[] // 标签对象数组
  autoPlay?: boolean // 是否自动播放
  enableDraco?: boolean // 是否启用 Draco 压缩加载
  dracoDir?: string // Draco 解码路径
  intersectRecursive?: boolean // 是否递归检测交互
  enableDamping?: boolean // 是否启用阻尼
  dampingFactor?: number // 阻尼系数
  verticalCtrl?: boolean | IControlsValue // 是否启用垂直控制，或垂直控制的值
  horizontalCtrl?: boolean | IControlsValue // 是否启用水平控制，或水平控制的值
  plyMaterial?: IPlyMaterial // PLY 模型的材质
  enableAxesHelper?: boolean // 是否启用坐标轴助手
  axesHelperSize?: number // 坐标轴助手大小
  enableGridHelper?: boolean // 是否启用网格助手
  minDistance?: number // 摄像机最小距离
  maxDistance?: number // 摄像机最大距离
  pointLightFollowCamera?: boolean // 点光源是否跟随摄像机
}

const props = withDefaults(defineProps<Props>(), {
  fileType: "", // 默认文件类型为空字符串
  width: 800, // 默认宽度为 800
  height: 600, // 默认高度为 600
  position: () => ({ x: 0, y: 0, z: 0 }), // 默认位置为原点
  rotation: () => ({ x: 0, y: 0, z: 0 }), // 默认旋转为 0
  scale: () => ({ x: 1, y: 1, z: 1 }), // 默认缩放为 1
  lights: () => [
    {
      type: "AmbientLight",
      color: 0xaaaaaa // 环境光，默认颜色为淡灰色
    },
    {
      type: "DirectionalLight",
      position: { x: 1, y: 1, z: 1 }, // 平行光，默认位置
      color: 0xffffff, // 默认白色光
      intensity: 0.8 // 默认光强
    }
  ],
  cameraPosition: () => ({ x: 0, y: 0, z: 5 }), // 默认摄像机位置
  cameraRotation: () => ({ x: 0, y: 0, z: 0 }), // 默认摄像机旋转
  cameraUp: () => ({ x: 0, y: 1, z: 0 }), // 默认摄像机“上”方向
  cameraLookAt: () => ({ x: 0, y: 0, z: 0 }), // 默认摄像机注视点
  backgroundColor: 0xffffff, // 默认背景颜色为白色
  backgroundAlpha: 1, // 默认背景透明度为不透明
  controlsOptions: () => ({}), // 默认控件选项为空对象
  crossOrigin: "anonymous", // 默认跨域配置
  requestHeader: () => ({}), // 默认请求头为空对象
  outputEncoding: "linear", // 默认输出编码为线性
  webGLRendererOptions: () => ({}), // 默认 WebGL 渲染器配置为空对象
  mtlPath: "", // 默认材质文件路径为空字符串
  showFps: false, // 默认不显示 FPS
  textureImage: "", // 默认纹理图片路径为空字符串
  clearScene: false, // 默认不清除场景
  parallelLoad: false, // 默认不并行加载
  labels: () => [], // 默认标签为空数组
  autoPlay: true, // 默认自动播放
  enableDraco: false, // 默认不启用 Draco 压缩加载
  dracoDir: "", // 默认 Draco 解码路径为空字符串
  intersectRecursive: false, // 默认不递归检测交互
  enableDamping: false, // 默认不启用阻尼
  dampingFactor: 0.1, // 默认阻尼系数为 0.1
  verticalCtrl: false, // 默认不启用垂直控制
  horizontalCtrl: false, // 默认不启用水平控制
  plyMaterial: "MeshStandardMaterial", // 默认 PLY 材质类型为 MeshStandardMaterial
  enableAxesHelper: false, // 默认不启用坐标轴助手
  axesHelperSize: 100, // 默认坐标轴助手大小为 100
  enableGridHelper: false, // 默认不启用网格助手
  minDistance: 0, // 默认摄像机最小距离为 0
  maxDistance: Infinity, // 默认摄像机最大距离为无穷大
  pointLightFollowCamera: false // 默认点光源不跟随摄像机
})

// Non responsive variable
let object: any = null
const raycaster = new Raycaster()
const mouse = new Vector2()
const camera = new PerspectiveCamera(45, 1, 0.1, 100000)
const clock = new Clock()
let scene: Scene = new Scene()
let renderer: WebGLRenderer = null as any
let controls: OrbitControls = {} as any
let allLights: Light[] = []
let loader: any = null
let requestAnimationId: number = 0
let stats: any = null
let mixers: AnimationMixer | AnimationMixer[] = null as any
let textureLoader: any = null
let axesHelper: AxesHelper = null as any
let gridHelper: GridHelper = null as any

// responsive variable
const size = ref({ width: props.width || 0, height: props.height || 0 })
const loaderIndex = ref(0)
const objectPositionHasSet = ref(false)
const isMultipleModels = ref(false)
const containerElement = ref(null)
const canvasElement = ref(null)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroyScene()
})

watch([() => props.autoPlay], () => {
  playAnimations()
})

watch([() => props.width, () => props.height], () => {
  size.value = {
    width: props.width || 0,
    height: props.height || 0
  }
})

watch(
  [() => props.enableAxesHelper, () => props.axesHelperSize, () => props.enableGridHelper],
  () => {
    setAxesAndGridHelper()
  }
)

watch([() => props.minDistance, () => props.maxDistance], () => {
  setVerticalHorizontalControls()
})

// deep watch
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
  [() => props.rotation, () => props.position, () => props.scale, () => props.lights],
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
  [() => size],
  () => {
    updateCamera(true)
    updateRenderer()
  },
  { deep: true }
)

watch(
  [() => props.controlsOptions],
  () => {
    updateControls()
  },
  { deep: true }
)

watch(
  [() => props.cameraRotation, () => props.cameraPosition],
  () => {
    updateCamera()
  },
  { deep: true }
)

watch(
  [() => props.labels],
  () => {
    setSpriteLabel()
  },
  { deep: true }
)

// emit
const emit = defineEmits([
  "mousedown",
  "mousemove",
  "mouseup",
  "click",
  "dblclick",
  "load",
  "process",
  "error"
])

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
  if (controls && Object.keys(controls).length > 0) {
    controls.dispose()
    controls = {} as any
  }
  const el = containerElement.value as any
  el.removeEventListener("mousedown", onMouseDown, false)
  el.removeEventListener("mousemove", onMouseMove, false)
  el.removeEventListener("mouseup", onMouseUp, false)
  el.removeEventListener("click", onClick, false)
  el.removeEventListener("dblclick", onDblclick, false)
  window.removeEventListener("resize", onResize, false)
  object = null
  if (scene) {
    scene.clear()
  }
}

function init() {
  const {
    filePath,
    // outputEncoding,
    webGLRendererOptions,
    showFps,
    enableDamping,
    dampingFactor,
    labels
  } = props

  // 判断是否为多个模型
  if (filePath && typeof filePath === "object") {
    isMultipleModels.value = true
  }

  // 获取容器元素并设置样式
  const el: any = containerElement.value
  setContainerElementStyle(el)

  // 初始化画布尺寸
  onResize()
  const WEB_GL_OPTIONS = { antialias: true, alpha: true }
  const options: WebGLRendererParameters = Object.assign({}, WEB_GL_OPTIONS, webGLRendererOptions, {
    canvas: canvasElement.value as any
  })
  if (!renderer) {
    renderer = new WebGLRenderer(options)
    // renderer.hadowMapEnabled = true
    renderer.shadowMap.enabled = true
    // const encoding = outputEncoding === "linear" ? 3000 : 3001
    // renderer.outputEncoding = encoding
  }

  if (!controls || Object.keys(controls).length <= 0) {
    controls = new OrbitControls(camera, el)
    if (enableDamping) {
      controls.enableDamping = true
      if (dampingFactor != undefined) {
        controls.dampingFactor = dampingFactor
      }
    }
  }
  setVerticalHorizontalControls()
  setAxesAndGridHelper()
  loadModelSelect()
  update()
  // enable mouse move
  enableMousemoveEvent(true)
  el.addEventListener("mousedown", onMouseDown, false)
  el.addEventListener("mouseup", onMouseUp, false)
  el.addEventListener("click", onClick, false)
  el.addEventListener("dblclick", onDblclick, false)
  window.addEventListener("resize", onResize, false)
  // stats
  if (showFps) {
    stats = new Stats()
    el.appendChild(stats.dom)
  }
  animate()
  // Init labels
  if (labels && labels.length > 0) {
    setSpriteLabel()
  }
}

function setContainerElementStyle(el: any) {
  const { width, height } = props
  if (width) {
    el.style.width = `${width}px`
  }
  if (height) {
    el.style.height = `${height}px`
  }
}
// mouse move event listener
function enableMousemoveEvent(enable: boolean) {
  const el: any = containerElement.value

  // 根据 enable 标志来添加或移除 mousemove 事件监听器
  if (enable) {
    el.addEventListener("mousemove", onMouseMove, false)
  } else {
    el.removeEventListener("mousemove", onMouseMove, false)
  }
}
function onResize() {
  const { width, height } = props
  if (!width || !height) {
    nextTick(() => {
      const el = containerElement.value as any
      size.value = {
        width: width || el.offsetWidth,
        height: height || el.offsetHeight
      }
    })
  }
}
function onMouseDown(event: MouseEvent) {
  enableMousemoveEvent(false)
  const intersected = pick(event.clientX, event.clientY)
  emit("mousedown", event, intersected)
}
function onMouseMove(event: MouseEvent) {
  // 获取鼠标移动位置的交互物体
  const intersected = pick(event.clientX, event.clientY)
  emit("mousemove", event, intersected)
}
function onMouseUp(event: MouseEvent) {
  // 获取鼠标释放位置的交互物体
  const intersected = pick(event.clientX, event.clientY)
  emit("mouseup", event, intersected)

  // 重新启用 mousemove 事件监听
  enableMousemoveEvent(true)
}
function onClick(event: MouseEvent) {
  // 获取点击位置的交互物体
  const intersected = pick(event.clientX, event.clientY)
  emit("click", event, intersected)
}
function onDblclick(event: MouseEvent) {
  // 获取双击位置的交互物体
  const intersected = pick(event.clientX, event.clientY)
  emit("dblclick", event, intersected)
}
function pick(x: number, y: number) {
  const obj = getAllObject() // 获取所有可交互的对象

  // 如果没有对象或容器元素，则返回 null
  if (!obj || !containerElement.value) return null

  // 获取容器元素的矩形边界，计算鼠标相对于容器的坐标
  const rect = (containerElement.value as HTMLElement).getBoundingClientRect()
  x -= rect.left
  y -= rect.top
  mouse.x = (x / size.value.width) * 2 - 1
  mouse.y = -(y / size.value.height) * 2 + 1

  // 设置射线投射器的相机和鼠标位置
  raycaster.setFromCamera(mouse, camera)

  // 检查射线是否与对象相交，返回第一个相交的对象
  const intersects = raycaster.intersectObject(obj, props.intersectRecursive)
  return (intersects && intersects.length) > 0 ? intersects[0] : null
}

// 1. 更新渲染器、相机、光源和控制器
function update() {
  updateRenderer() // 更新渲染器设置
  updateCamera() // 更新相机位置和旋转
  updateLights() // 更新光源（未提供代码）
  updateControls() // 更新控制器（未提供代码）
}

// 2. 更新模型的位置信息、旋转信息和缩放信息
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

// 3. 更新渲染器设置，包括背景色、分辨率等
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
function updateLights() {
  const { lights } = props
  scene.remove(...allLights)
  allLights = []

  // 遍历传入的光源数据，动态创建并添加到场景中
  lights.forEach((item: any) => {
    if (!item.type) return
    const type = item.type.toLowerCase()
    let light: any = null
    // 环境光源 (Ambient Light)
    if (type === "ambient" || type === "ambientlight") {
      const color = item.color === 0x000000 ? item.color : item.color || 0x404040
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
      light = new AmbientLight(color, intensity)
    }

    // 点光源 (Point Light)
    if (type === "point" || type === "pointlight") {
      const color = item.color === 0x000000 ? item.color : item.color || 0xffffff
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
      const distance = item.distance || 0
      const decay = item.decay === 0 ? item.decay : item.decay || 1
      light = new PointLight(color, intensity, distance, decay)
      if (item.position) {
        light.position.copy(item.position)
      }
    }

    // 平行光源 (Directional Light)
    if (type === "directional" || type === "directionallight") {
      const color = item.color === 0x000000 ? item.color : item.color || 0xffffff
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1

      light = new DirectionalLight(color, intensity)

      if (item.position) {
        light.position.copy(item.position)
      }

      if (item.target) {
        light.target.copy(item.target)
      }
    }

    // 半球光源 (Hemisphere Light)
    if (type === "hemisphere" || type === "hemispherelight") {
      const skyColor = item.skyColor === 0x000000 ? item.skyColor : item.skyColor || 0xffffff
      const groundColor =
        item.groundColor === 0x000000 ? item.groundColor : item.groundColor || 0xffffff
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1

      light = new HemisphereLight(skyColor, groundColor, intensity)

      if (item.position) {
        light.position.copy(item.position)
      }
    }

    // 如果光源有效，则将其添加到场景中
    if (light) {
      allLights.push(light)
      scene.add(light)
    }
  })
}

// 更新控制器
function updateControls() {
  const { controlsOptions } = props
  if (controlsOptions) {
    Object.assign(controls, controlsOptions)
  }
}

// 加载选择的模型
function loadModelSelect() {
  const { filePath, parallelLoad } = props
  // If enable parallel load
  if (parallelLoad && isMultipleModels) {
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
  ) // {loader, getObject, mtlLoader}
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
        onProcess(event)
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
  playAnimations()
}

// 动画更新函数
function animate() {
  requestAnimationId = requestAnimationFrame(animate)
  updateStats()
  const delta = clock.getDelta()
  // update play animations
  if (mixers && mixers instanceof AnimationMixer) {
    mixers.update(delta)
  }
  if (mixers && mixers instanceof Array) {
    mixers.forEach((m: any) => {
      m.update(delta)
    })
  }

  // 更新控制器
  if (controls) {
    controls.update()
  }
  render()
}

// 渲染函数
function render() {
  const { pointLightFollowCamera } = props

  // 如果启用点光源跟随相机，则设置光源跟随相机
  if (pointLightFollowCamera) {
    setLightFollowCamera()
  }

  // 渲染场景和相机
  renderer.render(scene, camera)
}

// 更新性能统计
function updateStats() {
  const { showFps } = props
  if (showFps) {
    stats.update()
  }
}

// 处理加载进度
function onProcess(xhr: ProgressEvent) {
  const { filePath } = props
  let process = Math.floor((xhr.loaded / xhr.total) * 100)
  if (process === 100) {
    // 加载完成时的处理逻辑
    if (isMultipleModels.value && filePath.length > loaderIndex.value) {
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

// 获取场景中的所有对象
function getAllObject() {
  // 如果是多个模型，返回场景对象，否则返回单个对象
  return isMultipleModels.value ? scene : object
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
// 生成包含文本的 Canvas 元素
function generateCanvas(text: string, style: any) {
  const roundRect = (ctx: any, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  const fontFamily = style.fontFamily || "Arial"
  const fontSize = style.fontSize === 0 || style.fontSize ? style.fontSize : 18
  const fontColor = style.color || "#ffffff"
  const fontWeight = style.fontWeight || "normal"
  const borderWidth = style.borderWidth === 0 || style.borderWidth ? style.borderWidth : 4
  const borderColor = style.borderColor || "rgba(0,0,0,1)"
  const borderRadius = style.borderRadius === 0 || style.borderRadius ? style.borderRadius : 4
  const backgroundColor = style.backgroundColor || "rgba(255, 255, 255, 1)"
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (context) {
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    // get size data (height depends only on font size)
    const metrics = context.measureText(text)
    const textWidth = metrics.width

    // 设置填充色
    context.fillStyle = backgroundColor

    // 设置边框颜色和宽度
    context.strokeStyle = borderColor
    context.lineWidth = borderWidth
    roundRect(
      context,
      borderWidth / 2,
      borderWidth / 2,
      textWidth + borderWidth,
      fontSize * 1.4 + borderWidth,
      borderRadius
    )
    // text color
    context.fillStyle = fontColor
    context.fillText(text, borderWidth, fontSize + borderWidth)
  }
  return canvas
}
// Get object index
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

// 播放动画函数
function playAnimations() {
  const obj = getAllObject()
  if (!obj) return
  // 如果是多个模型，播放多个模型的动画
  if (isMultipleModels.value) {
    playMultipleModels(obj)
    return
  }
  playSingleModel(obj)
}
// play a single model animation
function playSingleModel(item: Object3D) {
  const { autoPlay } = props
  mixers = new AnimationMixer(item)
  if (item.animations && item.animations.length > 0) {
    item.animations.forEach((clip: AnimationClip) => {
      if (clip) {
        const action = (mixers as AnimationMixer).clipAction(clip)
        if (autoPlay) {
          action.play()
        } else {
          action.stop()
        }
      }
    })
  }
}
// play multiple models animation
function playMultipleModels(obj: Object3D) {
  const { autoPlay } = props
  mixers = []
  obj.children.forEach((item: any, index: number) => {
    ;(mixers as AnimationMixer[]).push(new AnimationMixer(item))
    if (item.animations && item.animations.length > 0) {
      item.animations.forEach((clip: AnimationClip) => {
        if (clip) {
          const action = (mixers as AnimationMixer[])[index].clipAction(clip)
          if (autoPlay) {
            action.play()
          } else {
            action.stop()
          }
        }
      })
    }
  })
}
// set vertical horizontal controls
function setVerticalHorizontalControls() {
  if (!controls) {
    return
  }
  const { verticalCtrl, horizontalCtrl, minDistance, maxDistance } = props
  // set vertical
  if (verticalCtrl && typeof verticalCtrl === "boolean") {
    controls.minAzimuthAngle = -2 * Math.PI
    controls.maxAzimuthAngle = -2 * Math.PI
  }
  if (verticalCtrl && typeof verticalCtrl === "object") {
    // min/max azimuth angle value range [-2 * Math.PI，2 * Math.PI]
    controls.minAzimuthAngle = verticalCtrl.min
    controls.maxAzimuthAngle = verticalCtrl.max
  }
  // 设置水平控制
  if (horizontalCtrl && typeof horizontalCtrl === "boolean") {
    controls.minPolarAngle = 1
    controls.maxPolarAngle = 1
  }
  if (horizontalCtrl && typeof horizontalCtrl === "object") {
    // min/max azimuth angle value range [0，Math.PI]
    controls.minPolarAngle = horizontalCtrl.min
    controls.maxPolarAngle = horizontalCtrl.max
  }
  if (minDistance != 0 && typeof minDistance === "number") {
    controls.minDistance = minDistance
  }
  if (maxDistance != Infinity && typeof maxDistance === "number") {
    controls.maxDistance = maxDistance
  }
}
// set axes and grid helper
function setAxesAndGridHelper() {
  const { enableAxesHelper, enableGridHelper, axesHelperSize } = props

  // 如果启用坐标轴助手，则添加坐标轴
  if (enableAxesHelper) {
    // add axes
    axesHelper = new AxesHelper(axesHelperSize) // axesHelperSize is axes size，red: x, green: y, blue: z
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

// 光源跟随相机
function setLightFollowCamera() {
  const vector = camera.position.clone()
  scene.children.forEach((item: any) => {
    if (item instanceof PointLight) {
      item.position.set(vector.x, vector.y, vector.z)
    }
  })
}

// 导出公共变量，供外部访问
defineExpose({
  camera,
  scene
})
</script>
<style scoped>
.viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  border: 0;
  padding: 0;
}

.viewer-container div {
  position: absolute !important;
  left: 0px !important;
  opacity: 1 !important;
}

.viewer-canvas {
  width: 100%;
  height: 100%;
}
</style>
