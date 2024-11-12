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

export declare type EmitType = ReturnType<typeof defineEmits>

export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

export declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null
