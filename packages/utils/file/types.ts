export declare type BlobPart = ArrayBufferView | ArrayBuffer | Blob | string

export interface UrlData {
  url: string
  target?: "_self" | "_blank"
  fileName?: string
}

export declare type Nullable<T> = T | null
