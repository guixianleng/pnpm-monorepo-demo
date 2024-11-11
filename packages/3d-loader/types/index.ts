export interface ICoordinates {
  x: number
  y: number
  z: number
}

export interface IControlsValue {
  min: number
  max: number
}

export type IPlyMaterial = "MeshBasicMaterial" | "MeshStandardMaterial"
export type IEncode = "linear" | "sRGB"
