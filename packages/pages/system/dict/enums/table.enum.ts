import { defineTableColumns, FormSchema } from "advint-ui"
import { useHasPermission } from "@user-admin/hooks"

import { permEnum } from "./permission.enum"

export const SearchSchemas: FormSchema[] = [
  {
    label: "字典名称",
    prop: "dictName",
    component: "input"
  },
  {
    label: "字典类型",
    prop: "dictType",
    component: "input"
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
    label: "字典编号",
    prop: "dictName"
  },
  {
    label: "字典类型",
    prop: "dictType"
  },
  {
    label: "备注",
    prop: "dictRemark"
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
          return useHasPermission(permEnum.EDIT)
        }
      }
    ]
  }
]
