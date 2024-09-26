import type { FormSchema } from "advint-ui"

export const Formschemas: FormSchema[] = [
  {
    prop: "",
    component: "card",
    label: "基本信息",
    colSpan: 24
  },
  {
    prop: "tenantId",
    component: "input",
    label: "id",
    isShow: false
  },
  {
    prop: "tenantName",
    component: "input",
    label: "租户名称",
    required: true
  },
  {
    prop: "tenantCompany",
    component: "input",
    label: "企业名称",
    required: true
  },
  {
    prop: "userName",
    component: "input",
    label: "用户名",
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "password",
    component: "input",
    label: "用户密码",
    componentProps: {
      type: "password"
    },
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "accountCount",
    component: "input-number",
    label: "用户数量",
    helpMessage: "-1表示不限制",
    defaultValue: -1,
    componentProps: {
      min: -1,
      controlsPosition: "right"
    }
  },
  {
    prop: "expireTime",
    component: "date-picker",
    label: "过期时间",
    componentProps: {
      type: "datetime"
    }
  },
  {
    prop: "userRemark",
    component: "input",
    label: "备注",
    colSpan: 24,
    componentProps: {
      type: "textarea"
    }
  },
  {
    prop: "",
    component: "card",
    label: "数据源信息",
    colSpan: 24
  },
  {
    prop: "datasource.dsName",
    component: "input",
    label: "数据源名称",
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "datasource.dsType",
    component: "input",
    label: "数据源类型",
    defaultValue: "MySQL",
    componentProps: {
      disabled: true
    },
    required: true
  },
  {
    prop: "datasource.dsHost",
    component: "input",
    label: "数据源IP",
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "datasource.dsPort",
    component: "input",
    label: "数据源端口",
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "datasource.dsUser",
    component: "input",
    label: "帐号",
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "datasource.dsPwd",
    component: "input",
    label: "密码",
    required: true,
    componentProps: {
      type: "password"
    },
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "datasource.dsDatabase",
    component: "input",
    label: "库名称",
    required: true,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    }
  },
  {
    prop: "datasource.dsParsms",
    component: "input",
    label: "自定义参数",
    colSpan: 16,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    },
    componentProps: {
      type: "textarea",
      autosize: {
        minRows: 2
      }
    }
  },
  {
    prop: "datasource.userRemark",
    component: "input",
    label: "数据源描述",
    colSpan: 16,
    dynamicDisabled({ values }) {
      return !!values.tenantId
    },
    componentProps: {
      type: "textarea"
    }
  },
  {
    prop: "",
    component: "card",
    label: "菜单权限",
    colSpan: 24
  },
  {
    prop: "menuIds",
    component: "slot",
    label: "菜单权限",
    slot: "menu",
    colSpan: 24,
    required: true
  }
]
