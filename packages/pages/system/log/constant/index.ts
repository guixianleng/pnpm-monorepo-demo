// 状态枚举
import type { IEnumItem } from "advint-ui"

export enum STATUS_ENUM {
  SUCCESS = 1,
  FAILED = 0
}

export const STATUS_LABEL_LIST: IEnumItem[] = [
  {
    value: STATUS_ENUM.SUCCESS,
    label: "成功",
    tagType: "primary"
  },
  {
    value: STATUS_ENUM.FAILED,
    label: "失败",
    tagType: "danger"
  }
]

/**
 * 设备枚举
 */
export enum CLIENT_ENUM {
  MOBILE = 0,
  PC = 1
}

export const CLIENT_LABEL_LIST: IEnumItem[] = [
  {
    value: CLIENT_ENUM.MOBILE,
    label: "PC端"
  },
  {
    value: CLIENT_ENUM.PC,
    label: "移动端"
  }
]

/**
 * 模型枚举
 */
export enum MODEL_ENUM {
  "GPT3.5" = "GPT3.5",
  "TIMI" = "TIMI",
  "TYQW" = "Qwen"
}

export const MODEL_LABEL_LIST: IEnumItem[] = [
  {
    value: MODEL_ENUM["GPT3.5"],
    label: "ChatGPT3.5"
  },
  {
    value: MODEL_ENUM.TYQW,
    label: "通义千问"
  },
  {
    value: MODEL_ENUM.TIMI,
    label: "讯飞星火"
  }
]
