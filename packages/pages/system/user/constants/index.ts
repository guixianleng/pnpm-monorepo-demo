/**
 * 状态常量
 */
export enum STATUS_ENUM {
  NORMAL = 1,
  DEACTIVATE = 0
}
export enum SEX_ENUM {
  FEMALE = 1,
  MALE = 0,
  UNKNOWN = 2
}
export const STATUS_LABEL_LIST = [
  {
    value: STATUS_ENUM.NORMAL,
    label: "正常",
    tagType: "primary"
  },
  {
    value: STATUS_ENUM.DEACTIVATE,
    label: "停用",
    tagType: "danger"
  }
]

export const SEX_LABEL_LIST = [
  {
    value: SEX_ENUM.FEMALE,
    label: "女"
  },
  {
    value: SEX_ENUM.MALE,
    label: "男"
  },
  {
    value: SEX_ENUM.UNKNOWN,
    label: "未知"
  }
]
