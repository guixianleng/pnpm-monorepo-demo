import type { LabelValueOptions, IEnumItem } from "advint-ui"

// 菜单类型
export const MenuEnum: LabelValueOptions[] = [
  {
    label: "目录",
    value: "M"
  },
  {
    label: "菜单",
    value: "C"
  },
  {
    label: "按钮",
    value: "B"
  }
]

export enum MenuTypeEnum {
  /**
   * 目录
   */
  M = "M",
  /**
   * 菜单
   */
  C = "C",

  /**
   * 按钮
   */
  B = "B"
}

/**
 * 角色数据范围枚举
 */
export enum DataScopeEnum {
  /**
   * 全部数据权限
   */
  ALL = 1,
  /**
   * 自定数据权限
   */
  CUSTOM = 2,
  /**
   * 本部门数据权限
   */
  DEPT = 3,
  /**
   * 本部门及以下数据权限
   */
  OTHER = 4,
  /**
   * 仅本人数据权限
   */
  SELF = 5
}
export const DataScopeList: IEnumItem[] = [
  {
    value: DataScopeEnum.ALL,
    label: "全部数据权限"
  },
  {
    value: DataScopeEnum.CUSTOM,
    label: "自定数据权限"
  },
  {
    value: DataScopeEnum.DEPT,
    label: "本部门数据权限"
  },
  {
    value: DataScopeEnum.OTHER,
    label: "本部门及以下数据权限"
  },
  {
    value: DataScopeEnum.SELF,
    label: "仅本人数据权限"
  }
]
