import { defineTableColumns, FormSchema } from "advint-ui"
import { optionselect as getDictOptionselect } from "@user-admin/api"
import { useHasPermission } from "@user-admin/hooks"

import { PermDataEnum } from "./permission.enum"

export const SearchSchemas: FormSchema[] = [
  {
    label: "字典名称",
    prop: "dictType",
    component: "select",
    componentProps: {
      api: getDictOptionselect,
      labelField: "dictName",
      valueField: "dictType",
      clearable: false
    }
  },
  {
    label: "字典标签",
    prop: "dictLabel",
    component: "input"
  }
]

export const DataColumns: defineTableColumns[] = [
  {
    type: "selection",
    width: 60
  },
  {
    label: "字典标签",
    prop: "dictLabel"
  },
  {
    label: "字典键值",
    prop: "dictValue"
  },
  {
    label: "字典排序",
    prop: "dictSort"
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
          return useHasPermission(PermDataEnum.EDIT)
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
          return useHasPermission(PermDataEnum.DELETE)
        }
      }
    ]
  }
]
