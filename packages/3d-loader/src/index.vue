<template>
  <div ref="containerElement" class="viewer-container">
    <canvas ref="canvasElement" class="viewer-canvas" />
  </div>
</template>

<script setup lang="ts" name="Vue3dLoader">
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
import { getSize, getCenter, getLoader, getMTLLoader } from "../util/loaderModel"
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
    renderer = null as any
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
    outputEncoding,
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

  // WebGLRenderer参数配置
  const options: WebGLRendererParameters = createWebGLRendererOptions(webGLRendererOptions)

  // 初始化 WebGLRenderer
  if (!renderer) {
    initializeRenderer(options, outputEncoding)
  }

  // 初始化 OrbitControls
  if (!controls) {
    initializeControls(enableDamping, dampingFactor, el)
  }

  // 设置垂直和水平控制
  setVerticalHorizontalControls()

  // 设置坐标轴和网格帮助器
  setAxesAndGridHelper()

  // 加载模型
  loadModelSelect()

  // 启动更新循环
  update()

  // 启用鼠标移动事件
  enableMousemoveEvent(true)

  // 绑定鼠标事件
  bindMouseEvents(el)

  // 监听窗口大小变化
  window.addEventListener("resize", onResize, false)

  // 如果需要显示FPS
  if (showFps) {
    initializeStats(el)
  }

  // 启动动画循环
  animate()

  // 初始化标签
  if (labels && labels.length > 0) {
    setSpriteLabel()
  }
}

// 创建 WebGLRenderer 的配置
function createWebGLRendererOptions(webGLRendererOptions: any): WebGLRendererParameters {
  const WEB_GL_OPTIONS = { antialias: true, alpha: true }
  return Object.assign({}, WEB_GL_OPTIONS, webGLRendererOptions, {
    canvas: canvasElement.value as any
  })
}

// 初始化 WebGLRenderer
function initializeRenderer(options: WebGLRendererParameters, outputEncoding?: string) {
  renderer = new WebGLRenderer(options)
  renderer.shadowMap.enabled = true // 启用阴影映射
  console.log(outputEncoding, "outputEncoding")
  // const encoding = outputEncoding === "linear" ? 3000 : 3001
  // renderer.outputEncoding = encoding
}

// 初始化 OrbitControls
function initializeControls(enableDamping: boolean, dampingFactor: number, el: any) {
  controls = new OrbitControls(camera, el)
  if (enableDamping) {
    controls.enableDamping = true
    if (dampingFactor !== undefined) {
      controls.dampingFactor = dampingFactor
    }
  }
}

// 绑定鼠标事件
function bindMouseEvents(el: any) {
  el.addEventListener("mousedown", onMouseDown, false)
  el.addEventListener("mouseup", onMouseUp, false)
  el.addEventListener("click", onClick, false)
  el.addEventListener("dblclick", onDblclick, false)
}

// 初始化 FPS 显示
function initializeStats(el: any) {
  stats = new Stats()
  el.appendChild(stats.dom)
}
// 设置容器大小
function setContainerElementStyle(el: HTMLElement) {
  // 获取 props 中的 width 和 height
  const { width, height } = props

  // 如果 width 存在，设置容器的宽度
  if (width) {
    el.style.width = `${width}px`
  }

  // 如果 height 存在，设置容器的高度
  if (height) {
    el.style.height = `${height}px`
  }
}

// 2. Toggle mousemove event listener based on `enable` flag.
function enableMousemoveEvent(enable: boolean) {
  const el: any = containerElement.value

  // 根据 enable 标志来添加或移除 mousemove 事件监听器
  if (enable) {
    el.addEventListener("mousemove", onMouseMove, false)
  } else {
    el.removeEventListener("mousemove", onMouseMove, false)
  }
}

// 3. Handle resize event, updating container size if not provided in props.
function onResize() {
  const { width, height } = props

  // 如果没有设置宽度或高度，则通过容器的实际尺寸来设置
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

// 4. Handle mouse down event. Disable mousemove events and emit mousedown.
function onMouseDown(event: MouseEvent) {
  // 禁用 mousemove 事件，避免拖动时不停触发 mousemove
  enableMousemoveEvent(false)

  // 获取鼠标点击位置的交互物体（例如 3D 场景中的对象）
  const intersected = pick(event.clientX, event.clientY)

  // 触发 `mousedown` 事件
  emit("mousedown", event, intersected)
}

// 5. Handle mouse move event. Emit mousemove with intersected object.
function onMouseMove(event: MouseEvent) {
  // 获取鼠标移动位置的交互物体
  const intersected = pick(event.clientX, event.clientY)

  // 触发 `mousemove` 事件
  emit("mousemove", event, intersected)
}

// 6. Handle mouse up event. Emit mouseup and re-enable mousemove events.
function onMouseUp(event: MouseEvent) {
  // 获取鼠标释放位置的交互物体
  const intersected = pick(event.clientX, event.clientY)

  // 触发 `mouseup` 事件
  emit("mouseup", event, intersected)

  // 重新启用 mousemove 事件监听
  enableMousemoveEvent(true)
}

// 7. Handle click event. Emit click with intersected object.
function onClick(event: MouseEvent) {
  // 获取点击位置的交互物体
  const intersected = pick(event.clientX, event.clientY)

  // 触发 `click` 事件
  emit("click", event, intersected)
}

// 8. Handle double click event. Emit dblclick with intersected object.
function onDblclick(event: MouseEvent) {
  // 获取双击位置的交互物体
  const intersected = pick(event.clientX, event.clientY)

  // 触发 `dblclick` 事件
  emit("dblclick", event, intersected)
}

// 9. Pick the intersected object at a given mouse position (x, y).
function pick(x: number, y: number) {
  const obj = getAllObject() // 获取所有可交互的对象

  // 如果没有对象或容器元素，则返回 null
  if (!obj || !containerElement.value) return null

  // 获取容器元素的矩形边界，计算鼠标相对于容器的坐标
  const rect = (containerElement.value as HTMLElement).getBoundingClientRect()
  x -= rect.left
  y -= rect.top

  // 归一化鼠标坐标至 [-1, 1] 范围
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
  if (!object) return // 如果没有对象，直接返回

  const index = isMultipleModels.value ? getObjectIndex(object) : null // 如果有多个模型，获取当前模型的索引
  const { position, rotation, scale } = props // 解构出传入的位置信息、旋转信息和缩放信息

  // 更新位置
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

  // 更新渲染器尺寸
  renderer.setSize(size.value.width, size.value.height)

  // 设置设备像素比，确保在高分辨率设备上渲染清晰
  renderer.setPixelRatio(window.devicePixelRatio || 1)

  // 更新渲染器的背景颜色和透明度
  renderer.setClearColor(new Color(backgroundColor).getHex())
  renderer.setClearAlpha(backgroundAlpha as any)
}

// 4. 更新相机的位置、旋转和视角
function updateCamera(isResize?: boolean) {
  const { cameraPosition, cameraRotation, cameraUp, cameraLookAt } = props

  // 更新相机的宽高比，并更新投影矩阵
  camera.aspect = size.value.width / size.value.height
  camera.updateProjectionMatrix()

  // 如果是窗口大小改变的情况，直接返回，不更新相机
  if (isResize) return

  // 如果没有传入 cameraLookAt 和 cameraUp，默认让相机看向物体
  if (!cameraLookAt || !cameraUp) {
    if (!object) return // 如果没有对象，直接返回

    const distance = getSize(object).length() // 获取物体的大小，用于计算相机与物体的距离
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
    // 如果传入了 cameraLookAt 和 cameraUp，则根据这些信息设置相机
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
// 1. 更新光源
function updateLights() {
  const { lights } = props

  // 移除当前场景中的所有光源
  scene.remove(...allLights)
  allLights = []

  // 遍历传入的光源数据，动态创建并添加到场景中
  lights.forEach((item: any) => {
    if (!item.type) return // 如果没有光源类型，跳过

    const type = item.type.toLowerCase() // 获取光源类型并转为小写
    let light: any = null // 初始化光源变量

    // 2. 环境光源 (Ambient Light)
    if (type === "ambient" || type === "ambientlight") {
      const color = item.color === 0x000000 ? item.color : item.color || 0x404040
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
      light = new AmbientLight(color, intensity) // 创建环境光源
    }

    // 3. 点光源 (Point Light)
    if (type === "point" || type === "pointlight") {
      const color = item.color === 0x000000 ? item.color : item.color || 0xffffff
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
      const distance = item.distance || 0
      const decay = item.decay === 0 ? item.decay : item.decay || 1
      light = new PointLight(color, intensity, distance, decay) // 创建点光源
      if (item.position) {
        light.position.copy(item.position) // 设置光源位置
      }
    }

    // 4. 平行光源 (Directional Light)
    if (type === "directional" || type === "directionallight") {
      const color = item.color === 0x000000 ? item.color : item.color || 0xffffff
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
      light = new DirectionalLight(color, intensity) // 创建平行光源
      if (item.position) {
        light.position.copy(item.position) // 设置光源位置
      }
      if (item.target) {
        light.target.copy(item.target) // 设置光源目标
      }
    }

    // 5. 半球光源 (Hemisphere Light)
    if (type === "hemisphere" || type === "hemispherelight") {
      const skyColor = item.skyColor === 0x000000 ? item.skyColor : item.skyColor || 0xffffff
      const groundColor =
        item.groundColor === 0x000000 ? item.groundColor : item.groundColor || 0xffffff
      const intensity = item.intensity === 0 ? item.intensity : item.intensity || 1
      light = new HemisphereLight(skyColor, groundColor, intensity) // 创建半球光源
      if (item.position) {
        light.position.copy(item.position) // 设置光源位置
      }
    }

    // 6. 如果光源有效，则将其添加到场景中
    if (light) {
      allLights.push(light) // 将光源添加到光源数组中
      scene.add(light) // 将光源添加到场景
    }
  })
}

// 7. 更新控制器
function updateControls() {
  const { controlsOptions } = props

  // 如果传入了控制器选项，则更新控制器的配置
  if (controlsOptions) {
    Object.assign(controls, controlsOptions) // 使用 Object.assign 合并控制器的配置
  }
}

// 8. 加载选择的模型
function loadModelSelect() {
  const { filePath, parallelLoad } = props

  // 如果启用了并行加载且是多个模型
  if (parallelLoad && isMultipleModels) {
    ;(filePath as any).forEach((path: string, index: number) => {
      load(index) // 根据模型索引加载模型
    })
  } else {
    load() // 否则加载单个模型
  }
}
function load(fileIndex?: number) {
  // 解构获取必要的 props 参数
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

  // 如果没有文件路径，则直接返回
  if (!filePath) return

  // 确定文件的索引，使用传入的 fileIndex 或默认的 loaderIndex
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

  loader = loaderObject3d.loader // 获取 loader
  const getObjectFun = loaderObject3d.getObject ? loaderObject3d.getObject : getObject // 获取获取对象的函数

  // 如果场景中已经有对象，并且是第一个模型，则移除之前的对象
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
    const isMultipleMTL = typeof mtlPath === "object" // 判断是否是多个材质
    if (!isMultipleMTL) {
      // 如果是单一材质，直接加载
      loadMtl(filePathString, getObjectFun, index)
    } else {
      // 如果有多个材质，加载对应的材质和模型
      if (!mtlPath[index]) {
        loadFilePath(filePathString, getObjectFun, index) // 没有材质时直接加载模型
        return
      }
      loadMtl(filePathString, getObjectFun, index) // 加载材质
    }
  } else {
    // 如果没有材质，则直接加载模型
    loadFilePath(filePathString, getObjectFun, index)
  }
}

// 加载文件路径的函数
function loadFilePath(filePath: string, getObject: any, index: number) {
  const { textureImage, parallelLoad } = props

  // 使用 loader 加载文件
  loader.load(
    filePath,
    (...args: any) => {
      const obj = getObject(...args) // 获取加载后的对象
      object = obj
      addObject(object, filePath) // 将对象添加到场景中

      // 如果需要加载纹理，设置纹理
      if (textureImage) {
        const _texture = typeof textureImage === "string" ? textureImage : textureImage[index]
        if (_texture) {
          addTexture(object, _texture) // 添加纹理到对象
        }
      }

      // 触发加载完成事件
      emit("load", scene)
    },
    (event: ProgressEvent) => {
      // 如果不是并行加载，更新进度
      if (!parallelLoad) {
        onProcess(event)
      }
      const modelIndex = loaderIndex.value + 1
      emit("process", event, modelIndex) // 触发加载进度事件
    },
    (error: ErrorEvent) => {
      emit("error", error) // 触发加载错误事件
    }
  )
}

// 加载材质的函数
function loadMtl(filePath: string, getObject: any, index: number) {
  const { crossOrigin, requestHeader, mtlPath } = props

  // 获取材质加载器
  const mtlLoader = getMTLLoader()

  // 设置跨域和请求头（如果有）
  if (crossOrigin) {
    mtlLoader.setCrossOrigin(crossOrigin)
  }
  if (requestHeader) {
    mtlLoader.setRequestHeader(requestHeader as any)
  }

  // 获取对应索引的材质路径
  const mtl = typeof mtlPath === "string" ? mtlPath : mtlPath[index]
  const mtlPathArray: any = /^(.*\/)([^/]*)$/.exec(mtl)
  const path = mtlPathArray[1] // 获取路径
  const file = mtlPathArray[2] // 获取文件名

  // 设置材质加载器的路径并加载材质
  mtlLoader.setPath(path).load(file, (materials: any) => {
    materials.preload() // 预加载材质
    loader.setMaterials(materials) // 将材质应用到加载器中
    loadFilePath(filePath, getObject, index) // 加载文件路径
  })
}
// 获取对象
function getObject(object: any) {
  return object
}

// 向场景中添加对象
function addObject(obj: Object3D, filePath: string) {
  const center = getCenter(object) // 获取对象的中心点

  // 只在加载第一个模型时设置场景的位置信息，防止每次加载模型时修改场景位置
  if (!objectPositionHasSet.value) {
    scene.position.copy(center.negate()) // 设置场景位置为负的中心点
    objectPositionHasSet.value = true // 标记已经设置过位置
  }

  object = obj // 将传入的对象赋值给当前对象

  // 提取文件名并赋值给对象
  let fileName = filePath.split("/").pop() // 获取文件路径中的文件名
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
  requestAnimationId = requestAnimationFrame(animate) // 循环调用动画帧
  updateStats() // 更新性能统计

  const delta = clock.getDelta() // 获取上一帧与当前帧之间的时间差

  // 更新动画混合器
  if (mixers) {
    if (mixers instanceof AnimationMixer) {
      mixers.update(delta) // 单个动画混合器更新
    } else if (Array.isArray(mixers)) {
      mixers.forEach((m: any) => m.update(delta)) // 多个动画混合器更新
    }
  }

  // 更新控制器
  if (controls) {
    controls.update()
  }

  // 渲染场景
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

  // 如果需要显示帧率，则更新性能统计
  if (showFps) {
    stats.update()
  }
}

// 处理加载进度
function onProcess(xhr: ProgressEvent) {
  const { filePath } = props

  // 计算加载进度百分比
  let process = Math.floor((xhr.loaded / xhr.total) * 100)

  if (process === 100) {
    // 加载完成时的处理逻辑
    if (isMultipleModels.value && filePath.length > loaderIndex.value) {
      // 如果有多个模型，继续加载下一个模型
      nextTick(() => {
        loaderIndex.value++
        if (loaderIndex.value === filePath.length) {
          loaderIndex.value = 0 // 加载完毕，重置索引
          return
        }
        load() // 加载下一个模型
      })
    } else {
      loaderIndex.value = 0 // 如果只有一个模型，重置索引
    }
  }
}

// 向对象添加纹理
function addTexture(object: Object3D, texture: any) {
  if (!textureLoader) {
    textureLoader = new TextureLoader() // 如果没有创建过纹理加载器，则创建一个
  }

  // 遍历对象中的每一个子对象，找到网格并加载纹理
  object.traverse((child: any) => {
    if (child.isMesh) {
      // 如果是网格对象
      textureLoader.load(
        texture,
        (_texture: any) => {
          child.material.map = _texture // 设置纹理到网格的材质上
          child.material.needsUpdate = true // 通知材质更新
        },
        () => {}, // 加载进度的回调（这里未做处理）
        (err: any) => {
          emit("error", err) // 出现错误时触发 error 事件
        }
      )
    }
  })
}

// 清空场景
function clearWholeScene() {
  scene.clear() // 清空场景中的所有对象
}

// 设置对象的属性（例如位置、缩放、旋转等）
function setObjectAttribute(type: string, val: any) {
  const obj = getAllObject() // 获取对象（场景或单个对象）
  if (!obj) return // 如果没有对象，直接返回

  if (isMultipleModels.value) {
    // 如果是多个模型
    obj.children.forEach((item: any) => {
      // 遍历每个子对象
      const index = getObjectIndex(item) // 获取当前子对象的索引
      const v = type === "scale" ? 1 : 0 // 如果是缩放属性，设置为1，否则设置为0
      // 如果索引对应的值存在，设置对应的属性，否则设置默认值
      val[index]
        ? item[type].set(val[index].x, val[index].y, val[index].z)
        : item[type].set(v, v, v)
    })
    return
  }
  // 如果是单个模型，直接设置属性
  obj[type].set(val.x, val.y, val.z)
}

// 获取场景中的所有对象
function getAllObject() {
  return isMultipleModels.value ? scene : object // 如果是多个模型，返回场景对象，否则返回单个对象
}

// 设置精灵标签
function setSpriteLabel() {
  const { labels } = props // 获取标签数据
  if (!labels || labels.length <= 0) return // 如果没有标签，直接返回

  clearSprite() // 清空已有的精灵标签

  // 获取对象（场景或单个对象）
  const obj = isMultipleModels.value ? scene : object

  // 加载图片纹理
  const spriteImageLabel = (image: any) => {
    if (!textureLoader) {
      textureLoader = new TextureLoader() // 如果没有创建纹理加载器，则创建一个
    }
    const imageTexture = textureLoader.load(image) // 加载图片纹理
    return imageTexture
  }

  // 生成文本纹理
  const spriteTextLabel = (text: string, style: object) => {
    const canvas = generateCanvas(text, style) // 生成画布
    const texture = new Texture(canvas) // 创建纹理
    texture.needsUpdate = true // 标记纹理需要更新
    return texture
  }

  // 遍历所有标签并添加到场景中
  labels.forEach((item: any) => {
    const spriteMap = item.image
      ? spriteImageLabel(item.image) // 如果有图片，加载图片纹理
      : spriteTextLabel(item.text, item.textStyle || {}) // 否则，生成文本纹理

    const spriteMaterial = new SpriteMaterial({
      map: spriteMap, // 设置纹理
      color: item.spriteMaterialColor || 0xffffff // 设置精灵材质颜色
    })
    const sprite: any = new Sprite(spriteMaterial) // 创建精灵

    // 设置精灵的缩放
    if (item.scale) {
      sprite.scale.set(item.scale.x || 1, item.scale.y || 1, item.scale.z || 0) // 设置缩放
    } else {
      sprite.scale.set(1, 1, 0) // 默认缩放
    }

    // 设置精灵的位置
    if (item.position) {
      sprite.position.set(item.position.x, item.position.y, item.position.z)
    }

    // 设置精灵的SID（唯一标识符）
    if (item.sid) {
      sprite.sid = item.sid
    }

    obj.add(sprite) // 将精灵添加到场景或对象中
  })
}

// 清除场景中的所有精灵标签
function clearSprite() {
  const sceneChildren = scene.children // 获取场景中的所有子对象

  for (let i = sceneChildren.length - 1; i >= 0; i--) {
    // 从后往前遍历
    const item = sceneChildren[i]
    if (item) {
      // 如果是组对象且包含子对象，移除组内的精灵
      if (item instanceof Group && item.children) {
        scene.children[i].children = item.children
          .map((_item: any) => {
            if (_item instanceof Sprite) {
              return null // 如果是精灵，返回 null
            }
            return _item // 否则，保留原对象
          })
          .filter((item: any) => item) // 过滤掉 null 值
      }

      // 如果是精灵，直接从场景中移除
      if (item instanceof Sprite) {
        scene.remove(item)
      }
    }
  }
}
// 生成包含文本的 Canvas 元素
function generateCanvas(text: string, style: any) {
  // 绘制圆角矩形的函数
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

  // 从样式中获取设置，如果没有则使用默认值
  const fontFamily = style.fontFamily || "Arial" // 字体
  const fontSize = style.fontSize || 18 // 字号，默认 18px
  const fontColor = style.color || "#ffffff" // 字体颜色，默认白色
  const fontWeight = style.fontWeight || "normal" // 字体粗细，默认普通
  const borderWidth = style.borderWidth || 4 // 边框宽度，默认 4px
  const borderColor = style.borderColor || "rgba(0,0,0,1)" // 边框颜色，默认黑色
  const borderRadius = style.borderRadius || 4 // 边框圆角，默认 4px
  const backgroundColor = style.backgroundColor || "rgba(255, 255, 255, 1)" // 背景色，默认白色

  // 创建 canvas 元素，并获取 2D 上下文
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (context) {
    // 设置字体样式
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`

    // 获取文本的宽度
    const metrics = context.measureText(text)
    const textWidth = metrics.width

    // 设置背景色
    context.fillStyle = backgroundColor

    // 设置边框颜色和宽度
    context.strokeStyle = borderColor
    context.lineWidth = borderWidth

    // 绘制带圆角的矩形
    roundRect(
      context,
      borderWidth / 2,
      borderWidth / 2,
      textWidth + borderWidth,
      fontSize * 1.4 + borderWidth,
      borderRadius
    )

    // 设置文本颜色并绘制文本
    context.fillStyle = fontColor
    context.fillText(text, borderWidth, fontSize + borderWidth)
  }

  return canvas // 返回生成的 canvas 元素
}

// 获取对象在文件路径数组中的索引
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
      .filter(i => i != undefined)[0] // 过滤 undefined 并返回第一个匹配的索引
  }

  return objIndex
}

// 播放动画函数
function playAnimations() {
  const obj = getAllObject() // 获取所有对象

  if (!obj) return // 如果没有对象，直接返回

  if (isMultipleModels.value) {
    playMultipleModels(obj) // 如果是多个模型，播放多个模型的动画
    return
  }

  playSingleModel(obj) // 否则播放单个模型的动画
}

// 播放单个模型动画
function playSingleModel(item: Object3D) {
  const { autoPlay } = props // 获取是否自动播放的设置
  mixers = new AnimationMixer(item) // 创建动画混合器

  // 如果模型有动画，则为每个动画设置动作
  if (item.animations && item.animations.length > 0) {
    item.animations.forEach((clip: AnimationClip) => {
      if (clip) {
        const action = (mixers as AnimationMixer).clipAction(clip)
        if (autoPlay) {
          action.play() // 如果设置为自动播放，则播放动画
        } else {
          action.stop() // 否则停止动画
        }
      }
    })
  }
}

// 播放多个模型动画
function playMultipleModels(obj: Object3D) {
  const { autoPlay } = props // 获取是否自动播放的设置
  mixers = [] // 初始化动画混合器数组

  // 遍历每个子模型，为每个子模型创建动画混合器并播放动画
  obj.children.forEach((item: any, index: number) => {
    ;(mixers as AnimationMixer[]).push(new AnimationMixer(item)) // 创建动画混合器并推入数组
    if (item.animations && item.animations.length > 0) {
      item.animations.forEach((clip: AnimationClip) => {
        if (clip) {
          const action = (mixers as AnimationMixer[])[index].clipAction(clip)
          if (autoPlay) {
            action.play() // 如果设置为自动播放，则播放动画
          } else {
            action.stop() // 否则停止动画
          }
        }
      })
    }
  })
}
// 设置垂直和水平控制
function setVerticalHorizontalControls() {
  if (!controls) {
    return // 如果 controls 对象不存在，直接返回
  }

  const { verticalCtrl, horizontalCtrl, minDistance, maxDistance } = props

  // 设置垂直控制
  if (verticalCtrl) {
    if (typeof verticalCtrl === "boolean") {
      // 如果 verticalCtrl 是布尔值，则禁用垂直旋转（锁定角度范围为 -2π 到 2π）
      controls.minAzimuthAngle = -2 * Math.PI
      controls.maxAzimuthAngle = -2 * Math.PI
    } else if (typeof verticalCtrl === "object") {
      // 如果 verticalCtrl 是对象，设置自定义的最小和最大水平旋转角度
      controls.minAzimuthAngle = verticalCtrl.min
      controls.maxAzimuthAngle = verticalCtrl.max
    }
  }

  // 设置水平控制
  if (horizontalCtrl) {
    if (typeof horizontalCtrl === "boolean") {
      // 如果 horizontalCtrl 是布尔值，锁定极角角度为固定值
      controls.minPolarAngle = 1
      controls.maxPolarAngle = 1
    } else if (typeof horizontalCtrl === "object") {
      // 如果 horizontalCtrl 是对象，设置自定义的最小和最大极角值
      controls.minPolarAngle = horizontalCtrl.min
      controls.maxPolarAngle = horizontalCtrl.max
    }
  }

  // 设置最小距离和最大距离
  if (typeof minDistance === "number" && minDistance !== 0) {
    controls.minDistance = minDistance // 如果 minDistance 是数字且不为 0，则设置最小距离
  }
  if (typeof maxDistance === "number" && maxDistance !== Infinity) {
    controls.maxDistance = maxDistance // 如果 maxDistance 是数字且不为 Infinity，则设置最大距离
  }
}

// 设置坐标轴和网格助手
function setAxesAndGridHelper() {
  const { enableAxesHelper, enableGridHelper, axesHelperSize } = props

  // 如果启用坐标轴助手，则添加坐标轴
  if (enableAxesHelper) {
    axesHelper = new AxesHelper(axesHelperSize) // AxesHelperSize 是坐标轴的大小，红色代表 x 轴，绿色代表 y 轴，蓝色代表 z 轴
    scene.add(axesHelper) // 将坐标轴助手添加到场景中
  } else {
    if (axesHelper) {
      scene.remove(axesHelper) // 如果已存在坐标轴助手，则从场景中移除
    }
  }

  // 如果启用网格助手，则添加网格
  if (enableGridHelper) {
    gridHelper = new GridHelper(2000, 100) // 网格的大小为 2000，分为 100 格
    scene.add(gridHelper) // 将网格助手添加到场景中
  } else {
    if (gridHelper) {
      scene.remove(gridHelper) // 如果已存在网格助手，则从场景中移除
    }
  }
}

// 光源跟随相机
function setLightFollowCamera() {
  const vector = camera.position.clone() // 克隆相机的位置，确保光源位置与相机同步

  // 遍历场景中的所有对象，查找 PointLight 类型的光源
  scene.children.forEach((item: any) => {
    if (item instanceof PointLight) {
      // 如果是 PointLight，则将光源的位置设置为相机的位置
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

<style scoped lang="scss">
@use "./style.scss";
</style>
