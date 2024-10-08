import { defineTableColumns, type FormSchema, type IEnumItem } from "advint-ui"
import TableMoreOp from "../components/TableMoreOp.vue"
import { STATUS_LABEL_LIST } from "../constants"
import { DataScopeList } from "@user-admin/enums"
import { useHasPermission } from "@user-admin/hooks"
import { permission } from "../permission"
export const tableEnum = defineTableColumns([
  {
    label: "",
    type: "selection"
  },
  {
    prop: "loginName",
    label: "登录名"
  },
  {
    prop: "userName",
    label: "用户名"
  },
  {
    prop: "userPhone",
    label: "手机号"
  },
  {
    prop: "userEmail",
    label: "邮箱",
    width: 180
  },
  {
    prop: "userStatus",
    label: "状态",
    dictEnum: STATUS_LABEL_LIST as IEnumItem[]
  },
  {
    prop: "userSource",
    label: "来源",
    slotKey: "disposeSlot"
  },
  {
    prop: "createTime",
    isFormatTime: true,
    width: 180,
    label: "创建时间"
  },
  {
    label: "操作",
    fixed: "right",
    operationType: [
      {
        type: "edit",
        permission: () => {
          return useHasPermission(permission.EDIT)
        }
      },
      {
        type: "delete",
        permission: () => {
          return useHasPermission(permission.DELETE)
        }
      },
      {
        type: "more",
        render: ({ row }) =>
          h(TableMoreOp, {
            row
          }),
        permission: () => {
          return useHasPermission([...permission.CZMM, ...permission.AUTH_ROLE])
        }
      }
    ],
    width: 230
  }
])
export const SearchSchemas: FormSchema[] = [
  {
    label: "登录名",
    prop: "loginName",
    component: "input"
  },
  {
    label: "用户名",
    prop: "userName",
    component: "input"
  },
  {
    label: "手机号",
    prop: "userPhone",
    component: "input"
  },
  {
    label: "状态",
    prop: "userStatus",
    component: "select",
    componentProps: {
      options: STATUS_LABEL_LIST
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
export const rolesTableEnums = defineTableColumns([
  {
    type: "selection",
    label: "",
    width: 50
  },
  {
    label: "角色编码",
    prop: "roleCode"
  },
  {
    label: "角色名称",
    prop: "roleName"
  },
  {
    label: "数据范围",
    prop: "dataScope",
    dictEnum: DataScopeList
  }
])
export const roleSchemas: FormSchema[] = [
  {
    label: "登录名",
    prop: "loginName",
    component: "input",
    componentProps: {
      disabled: true
    }
  },
  {
    label: "用户名",
    prop: "userName",
    componentProps: {
      disabled: true
    },
    component: "input"
  }
]
