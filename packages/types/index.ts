export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

export declare type EmitType = ReturnType<typeof defineEmits>

export declare type Recordable<T = any> = Record<string, T>

export declare type Nullable<T> = T | null

export declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

export declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

export declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

export type TimeoutHandle = ReturnType<typeof setTimeout>

export declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]
