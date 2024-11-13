import { PropType, type ExtractPropTypes } from "vue"
import type { ICoordinates, IControlsValue, IEncode, IPlyMaterial } from "./types"

export const baseProps = {
  // 文件路径
  filePath: {
    type: [String, Array] as PropType<string | string[]>,
    default: ""
  },
  // 文件类型，默认值为空字符串
  fileType: {
    type: [String, Array] as PropType<string | string[]>,
    default: ""
  },
  // 宽度，默认值为 800
  width: {
    type: Number,
    default: 800
  },
  // 高度，默认值为 600
  height: {
    type: Number,
    default: 600
  },
  // 位置，默认值为 { x: 0, y: 0, z: 0 }
  position: {
    type: Object as PropType<ICoordinates | ICoordinates[] | null>,
    default: null
  },
  // 旋转，默认值为 { x: 0, y: 0, z: 0 }
  rotation: {
    type: Object as PropType<ICoordinates | ICoordinates[] | null>,
    default: null
  },
  // 缩放，默认值为 { x: 1, y: 1, z: 1 }
  scale: {
    type: Object as PropType<ICoordinates | ICoordinates[] | null>,
    default: null
  },
  // 灯光，默认值为包含一个环境光和一个平行光的数组
  lights: {
    type: Array as PropType<object[]>,
    default: () => [
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
    ]
  },
  // 摄像机位置
  cameraPosition: {
    type: Object as PropType<ICoordinates>,
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  // 摄像机旋转
  cameraRotation: {
    type: Object as PropType<ICoordinates | null>,
    default: null
  },
  // 摄像机“上”方向，默认值为 { x: 0, y: 1, z: 0 }
  cameraUp: {
    type: Object as PropType<ICoordinates | null>,
    default: null
  },
  // 摄像机注视点
  cameraLookAt: {
    type: Object as PropType<ICoordinates | null>,
    default: null
  },
  // 背景颜色，默认值为 0xffffff（白色）
  backgroundColor: {
    type: [Number, String],
    default: 0xffffff
  },
  // 背景透明度，默认值为 1（不透明）
  backgroundAlpha: {
    type: Number,
    default: 1
  },
  // 控件选项，默认值为空对象
  controlsOptions: {
    type: Object,
    default: () => ({})
  },
  // 跨域配置，默认值为 "anonymous"
  crossOrigin: {
    type: String,
    default: "anonymous"
  },
  // 请求头，默认值为空对象
  requestHeader: {
    type: Object,
    default: () => ({})
  },
  // 输出编码，默认值为 "linear"
  outputEncoding: {
    type: String as PropType<IEncode>,
    default: "linear"
  },
  // WebGL 渲染器配置，默认值为空对象
  webGLRendererOptions: {
    type: Object,
    default: () => ({})
  },
  // 材质文件路径，默认值为空字符串
  mtlPath: {
    type: [String, Array] as PropType<string | string[]>,
    default: ""
  },
  // 是否显示 FPS，默认值为 false
  showFps: {
    type: Boolean,
    default: false
  },
  // 纹理图片路径，默认值为空字符串
  textureImage: {
    type: String,
    default: ""
  },
  // 是否清除场景，默认值为 false
  clearScene: {
    type: Boolean,
    default: false
  },
  // 是否并行加载，默认值为 false
  parallelLoad: {
    type: Boolean,
    default: false
  },
  // 标签，默认值为空数组
  labels: {
    type: Array as PropType<object[]>,
    default: () => []
  },
  // 是否自动播放，默认值为 true
  autoPlay: {
    type: Boolean,
    default: true
  },
  // 是否启用 Draco 压缩加载，默认值为 false
  enableDraco: {
    type: Boolean,
    default: false
  },
  // Draco 解码路径，默认值为空字符串
  dracoDir: {
    type: String,
    default: ""
  },
  // 是否递归检测交互，默认值为 false
  intersectRecursive: {
    type: Boolean,
    default: false
  },
  // 是否启用阻尼，默认值为 false
  enableDamping: {
    type: Boolean,
    default: false
  },
  // 阻尼系数，默认值为 0.1
  dampingFactor: {
    type: Number,
    default: 0.1
  },
  // 是否启用垂直控制，默认值为 false
  verticalCtrl: {
    type: [Boolean, Object] as PropType<boolean | IControlsValue>,
    default: false
  },
  // 是否启用水平控制，默认值为 false
  horizontalCtrl: {
    type: [Boolean, Object] as PropType<boolean | IControlsValue>,
    default: false
  },
  // PLY 材质类型，默认值为 "MeshStandardMaterial"
  plyMaterial: {
    type: String as PropType<IPlyMaterial>,
    default: "MeshStandardMaterial"
  },
  // 是否启用坐标轴助手，默认值为 false
  enableAxesHelper: {
    type: Boolean,
    default: false
  },
  // 坐标轴助手大小，默认值为 100
  axesHelperSize: {
    type: Number,
    default: 100
  },
  // 是否启用网格助手，默认值为 false
  enableGridHelper: {
    type: Boolean,
    default: false
  },
  // 摄像机最小距离，默认值为 0
  minDistance: {
    type: Number,
    default: 0
  },
  // 摄像机最大距离，默认值为 Infinity
  maxDistance: {
    type: Number,
    default: Infinity
  },
  // 点光源是否跟随摄像机，默认值为 false
  pointLightFollowCamera: {
    type: Boolean,
    default: false
  }
}

export type BasePropsType = ExtractPropTypes<typeof baseProps>

export const baseEmits = [
  "mousedown",
  "mousemove",
  "mouseup",
  "click",
  "dblclick",
  "load",
  "process",
  "error"
]
