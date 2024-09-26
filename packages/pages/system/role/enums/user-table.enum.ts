import { defineTableColumns, FormSchema } from "advint-ui"
import { useHasPermission } from "@user-admin/hooks"
import { permEnum } from "./permission.enum"

export const SearchSchemas: FormSchema[] = [
  {
    label: "用户名称",
    prop: "userName",
    component: "input"
  },
  {
    label: "手机号码",
    prop: "userPhone",
    component: "input"
  }
]

// 选择用户列表
export const UserColumns: defineTableColumns[] = [
  {
    type: "selection",
    width: 60
  },
  {
    label: "用户名称",
    prop: "userName"
  },
  {
    label: "用户昵称",
    prop: "loginName"
  },
  {
    label: "邮箱",
    prop: "userEmail"
  },
  {
    label: "手机",
    prop: "userPhone"
  },
  {
    label: "状态",
    prop: "userStatus"
  },
  {
    label: "创建时间",
    prop: "createTime"
  }
]

// 分配用户列表
export const AuthUserColumns: defineTableColumns[] = [
  ...UserColumns,
  {
    width: 100,
    type: "operation",
    label: "操作",
    fixed: "right",
    operationType: [
      {
        label: "删除",
        type: "delete",
        permission: () => {
          return useHasPermission(permEnum.DELUSER)
        }
      }
    ]
  }
]
