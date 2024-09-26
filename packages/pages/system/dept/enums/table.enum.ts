import { FormSchema } from "advint-ui"
import { useDict } from "@user-admin/utils"
import { useHasPermission } from "@user-admin/hooks"
import { permission } from "../permission"
const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

export const SearchSchemas: FormSchema[] = [
  {
    label: "部门名称",
    prop: "deptName",
    component: "input"
  },
  {
    label: "状态",
    prop: "deptStatus",
    component: "select",
    componentProps: {
      options: sys_normal_disable
    }
  },
  {
    prop: "createTime",
    component: "date-picker",
    label: "创建时间",
    componentProps: {
      type: "daterange"
    }
  }
]

export const DataColumns = [
  {
    type: "selection",
    width: 80
  },
  {
    label: "部门名称",
    prop: "deptName"
  },
  {
    label: "排序",
    prop: "orderNum"
  },
  {
    label: "状态",
    prop: "deptStatus"
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
