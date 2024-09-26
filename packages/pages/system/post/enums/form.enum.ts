import type { FormSchema } from "advint-ui"
import { useDict } from "@user-admin/utils"
const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

export const Formschemas: FormSchema[] = [
  {
    prop: "postId",
    component: "input",
    label: "岗位Id",
    isShow: false
  },
  {
    prop: "postName",
    component: "input",
    label: "岗位名称",
    required: true,
    colSpan: 12
  },
  {
    prop: "postCode",
    component: "input",
    label: "岗位编码",
    required: true,
    colSpan: 12
  },
  {
    prop: "postSort",
    component: "input-number",
    label: "岗位顺序",
    colSpan: 12
  },
  {
    prop: "postStatus",
    component: "RadioGroup",
    label: "岗位状态",
    required: true,
    colSpan: 12,
    componentProps: {
      options: sys_normal_disable
    }
  },
  {
    prop: "remark",
    component: "input",
    label: "备注",
    colSpan: 24,
    componentProps: {
      type: "textarea"
    }
  }
]
