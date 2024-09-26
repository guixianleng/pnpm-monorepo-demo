import { defineTableColumns, FormSchema } from "advint-ui"
import { useDict } from "@user-admin/utils"
import { useHasPermission } from "@user-admin/hooks"

import { permEnum } from "./permission.enum"

export const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

export const SearchSchemas: FormSchema[] = [
  {
    label: "菜单名称",
    prop: "menuName",
    component: "input"
  },
  {
    label: "状态",
    prop: "menuStatus",
    component: "select",
    componentProps: {
      options: sys_normal_disable
    }
  }
]

export const DataColumns: defineTableColumns[] = [
  {
    label: "菜单名称",
    prop: "menuName"
  },
  {
    label: "图标",
    prop: "menuIcon"
  },
  {
    label: "排序",
    prop: "orderNum",
    width: 60
  },
  {
    label: "权限标识",
    prop: "menuPerms"
  },
  {
    label: "组件路径",
    prop: "component",
    width: 180
  },
  {
    label: "状态",
    prop: "menuStatus",
    width: 80
  },
  {
    width: 210,
    type: "operation",
    label: "操作",
    fixed: "right",
    operationType: [
      {
        label: "编辑",
        type: "edit",
        permission: () => {
          return useHasPermission(permEnum.EDIT)
        },
        extra: {
          link: true,
          type: "primary"
        }
      },
      {
        label: "新增",
        type: "add",
        permission: () => {
          return useHasPermission(permEnum.ADD)
        },
        extra: {
          link: true
        }
      },
      {
        label: "删除",
        type: "delete",
        permission: () => {
          return useHasPermission(permEnum.EDIT)
        }
      }
    ]
  }
]
