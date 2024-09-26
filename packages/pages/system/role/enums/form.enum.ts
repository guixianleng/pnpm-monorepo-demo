import type { FormSchema } from "advint-ui"
import { ScopeOptions } from "./options.enum"
import { useDict } from "@user-admin/utils"

const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

export const Formschemas: FormSchema[] = [
  {
    prop: "roleId",
    component: "input",
    label: "",
    isShow: false
  },
  {
    prop: "roleName",
    component: "input",
    label: "角色名称",
    required: true
  },
  {
    prop: "roleCode",
    component: "input",
    label: "权限字符",
    helpMessage: "控制器中定义的权限字符，如：@SaCheckRole(`admin`)",
    required: true
  },
  {
    prop: "roleSort",
    component: "input-number",
    label: "角色顺序",
    required: true,
    componentProps: {
      controlsPosition: "right",
      min: 0
    }
  },
  {
    prop: "roleStatus",
    component: "RadioGroup",
    label: "状态",
    defaultValue: "1",
    isShow({ values }) {
      return values.menuType !== "B"
    },
    componentProps: {
      options: sys_normal_disable
    }
  },
  {
    prop: "menuIds",
    component: "slot",
    label: "菜单权限",
    slot: "menu"
  },
  {
    prop: "roleRemark",
    component: "input",
    label: "备注",
    componentProps: {
      type: "textarea",
      autoSize: {
        minRows: 2,
        maxRows: 4
      }
    }
  }
]

// 数据权限弹框表单项
export const DataFormschemas: FormSchema[] = [
  {
    prop: "dictCode",
    component: "input",
    label: "",
    isShow: false
  },
  {
    prop: "roleName",
    component: "input",
    label: "角色名称",
    componentProps: {
      disabled: true
    }
  },
  {
    prop: "roleCode",
    component: "input",
    label: "权限字符",
    componentProps: {
      disabled: true
    }
  },
  {
    prop: "dataScope",
    component: "select",
    label: "权限范围",
    required: true,
    defaultValue: "1",
    componentProps: {
      options: ScopeOptions
    }
  },
  {
    prop: "",
    component: "slot",
    slot: "data",
    label: "数据权限",
    isShow: ({ values }) => {
      return values.dataScope === 2
    }
  }
]
