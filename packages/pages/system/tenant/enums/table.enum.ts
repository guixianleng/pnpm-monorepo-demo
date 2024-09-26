import { FormSchema } from "advint-ui"
import { useHasPermission } from "@user-admin/hooks"

import { permEnum } from "./permission.enum"

export const SearchSchemas: FormSchema[] = [
  {
    label: "租户名称",
    prop: "tenantName",
    component: "input"
  },
  {
    label: "企业名称",
    prop: "tenantCompany",
    component: "input"
  }
]

export const DataColumns = [
  {
    type: "selection",
    width: 55
  },
  {
    label: "租户名称",
    prop: "tenantName"
  },
  {
    label: "企业名称",
    prop: "tenantCompany"
  },
  {
    label: "过期时间",
    prop: "expireTime"
  },
  {
    label: "租户状态",
    prop: "tenantStatus"
  },
  {
    width: 160,
    type: "operation",
    label: "操作",
    fixed: "right",
    operationType: [
      {
        label: "修改",
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
        },
        extra: {
          type: "danger",
          link: true
        }
      }
    ]
  }
]
