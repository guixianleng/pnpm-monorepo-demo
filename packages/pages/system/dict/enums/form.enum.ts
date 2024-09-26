import type { FormSchema } from "advint-ui"

export const Formschemas: FormSchema[] = [
  {
    prop: "dictId",
    component: "input",
    label: "",
    isShow: false
  },
  {
    prop: "dictName",
    component: "input",
    label: "字典名称",
    required: true
  },
  {
    prop: "dictType",
    component: "input",
    label: "字典类型",
    required: true
  },
  {
    prop: "dictRemark",
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

// 字段数据表单项
export const DataFormschemas: FormSchema[] = [
  {
    prop: "dictCode",
    component: "input",
    label: "",
    isShow: false
  },
  {
    prop: "dictType",
    component: "input",
    label: "字典类型",
    componentProps: {
      disabled: true
    }
  },
  {
    prop: "dictLabel",
    component: "input",
    label: "数据标签",
    required: true
  },
  {
    prop: "dictValue",
    component: "input",
    label: "数据键值",
    required: true
  },
  {
    prop: "dictSort",
    component: "input-number",
    label: "显示排序",
    required: true,
    componentProps: {
      controlsPosition: "right",
      min: 0
    }
  },
  {
    prop: "dictRemark",
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
