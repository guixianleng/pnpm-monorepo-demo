import { FormSchema } from "advint-ui"
import { useDict } from "@user-admin/utils"
import { useHasPermission } from "@user-admin/hooks"
import { permission } from "../permission/index"
const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

export const SearchSchemas: FormSchema[] = [
  {
    label: "岗位名称",
    prop: "postName",
    component: "input"
  },
  {
    label: "状态",
    prop: "postStatus",
    component: "select",
    componentProps: {
      options: sys_normal_disable
    }
  }
]

export const DataColumns = [
  {
    type: "selection",
    width: 80
  },
  {
    label: "岗位编码",
    prop: "postCode"
  },
  {
    label: "岗位排序",
    prop: "postSort"
  },
  {
    label: "岗位名称",
    prop: "postName"
  },
  {
    label: "岗位状态",
    prop: "postStatus"
  },
  {
    label: "创建时间",
    prop: "createTime"
  },
  {
    width: 160,
    type: "operation",
    label: "操作",
    fixed: "right",
    operationType: [
      {
        label: "编辑",
        type: "edit",
        permission: () => {
          return useHasPermission(permission.EDIT)
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
          return useHasPermission(permission.DELETE)
        },
        extra: {
          type: "danger",
          link: true
        }
      }
    ]
  }
]
