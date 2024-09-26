import { defineTableColumns, FormSchema } from "advint-ui"
import type { LoginLogRecord, IOperaRecord } from "@user-admin/types"
import { STATUS_LABEL_LIST } from "../constant"

export const tableConfig = defineTableColumns<LoginLogRecord>([
  {
    label: "姓名",
    prop: "userName"
  },
  {
    label: "IP地址",
    prop: "ipAddr"
  },
  {
    label: "浏览器",
    prop: "browser"
  },
  {
    label: "操作系统",
    prop: "loginOs"
  },
  {
    label: "登录状态",
    prop: "infoStatus",
    dictEnum: STATUS_LABEL_LIST
  },
  {
    label: "操作信息",
    prop: "infoMsg"
  },
  {
    label: "登录时间",
    prop: "accessTime",
    isFormatTime: true,
    width: 160
  }
])
export const tableOperConfig = defineTableColumns<IOperaRecord>([
  {
    label: "用户",
    prop: "operName"
  },
  {
    label: "系统模块",
    prop: "module"
  },
  {
    label: "操作地址",
    prop: "operUrl"
  },
  {
    label: "操作状态",
    prop: "status",
    dictEnum: STATUS_LABEL_LIST
  },
  {
    label: "操作类型",
    prop: "businessType"
  },
  {
    label: "消耗时间(ms)",
    prop: "costTime"
  },
  {
    label: "操作日期",
    prop: "operTime",
    columnsExtra: {
      sortable: true
    },
    isFormatTime: true
  },
  {
    label: "操作",
    fixed: "right",
    type: "operation",
    width: 100,
    operationType: ["view"]
  }
])
export const loginSearchSchemas: FormSchema[] = [
  {
    label: "用户名",
    prop: "userName",
    component: "input"
  },
  {
    label: "状态",
    prop: "infoStatus",
    component: "select",
    componentProps: {
      options: STATUS_LABEL_LIST
    }
  },
  {
    prop: "accessTime",
    component: "date-picker",
    label: "登录时间",
    componentProps: {
      type: "daterange"
    }
  }
]
export const operSearchSchemas: FormSchema[] = [
  {
    label: "用户名",
    prop: "operName",
    component: "input"
  },
  {
    label: "系统模块",
    prop: "module",
    component: "input"
  },
  {
    label: "操作类型",
    prop: "businessType",
    component: "input"
  },
  {
    label: "状态",
    prop: "status",
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
