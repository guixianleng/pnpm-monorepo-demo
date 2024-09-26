import { defineTableColumns, FormSchema } from "advint-ui"
import { useDict } from "@user-admin/utils"
import { useHasPermission } from "@user-admin/hooks"
import { permEnum } from "./permission.enum"

const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

export const SearchSchemas: FormSchema[] = [
  {
    label: "角色名称",
    prop: "roleName",
    component: "input"
  },
  {
    label: "权限字符",
    prop: "roleCode",
    component: "input"
  },
  {
    label: "状态",
    prop: "roleStatus",
    component: "select",
    componentProps: {
      options: sys_normal_disable
    }
  },
  {
    prop: "params.createTime",
    component: "date-picker",
    label: "创建时间",
    componentProps: {
      type: "daterange"
    }
  }
]

export const DataColumns: defineTableColumns[] = [
  {
    type: "selection",
    width: 60
  },
  {
    label: "角色名称",
    prop: "roleName"
  },
  {
    label: "权限字符",
    prop: "roleCode"
  },
  {
    label: "显示顺序",
    prop: "roleSort"
  },
  {
    label: "状态",
    prop: "roleStatus"
  },
  {
    label: "创建时间",
    prop: "createTime",
    width: 160
  },
  {
    width: 300,
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
          type: "primary",
          link: true
        }
      },
      {
        label: "删除",
        type: "delete",
        permission: () => {
          return useHasPermission(permEnum.DELETE)
        }
      },
      {
        label: "数据权限",
        type: "data",
        permission: () => {
          return useHasPermission(permEnum.DATA)
        },
        extra: {
          type: "primary",
          link: true
        }
      },
      {
        label: "分配用户",
        type: "user",
        permission: () => {
          return useHasPermission(permEnum.USER)
        },
        extra: {
          type: "primary",
          link: true
        }
      }
    ]
  }
]
