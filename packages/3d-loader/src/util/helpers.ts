// 生成包含文本的 Canvas 元素
export function generateCanvas(text: string, style: any) {
  const {
    fontFamily = "Arial",
    fontSize = 18,
    color = "#ffffff",
    fontWeight = "normal",
    borderWidth = 4,
    borderColor = "rgba(0,0,0,1)",
    borderRadius = 4,
    backgroundColor = "rgba(255, 255, 255, 1)"
  } = style

  // 绘制圆角矩形
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
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

  // 创建 Canvas 元素
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) return canvas

  // 设置字体样式和文本尺寸
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  const textWidth = context.measureText(text).width

  // Canvas 宽高设置
  const canvasWidth = textWidth + borderWidth * 2
  const canvasHeight = fontSize * 1.4 + borderWidth * 2
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  // 绘制背景和边框
  context.fillStyle = backgroundColor
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

  // 绘制文本
  context.fillStyle = color
  context.fillText(text, borderWidth, fontSize + borderWidth)

  return canvas
}

const { toString } = Object.prototype

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isString(val: unknown): val is string {
  return is(val, "String")
}

export function isNumber(val: unknown): val is number {
  return is(val, "Number")
}
