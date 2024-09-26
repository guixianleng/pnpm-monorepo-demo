import { listDeptAll, listUserAll } from "@user-admin/api"
import type { FormSchema } from "advint-ui"
import { useDict, handleTree } from "@user-admin/utils"
const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

const getListDeptAll = async () => {
  const { data } = await listDeptAll()
  return { data: handleTree(data, "deptId") }
}

export const Formschemas: FormSchema[] = [
  {
    prop: "deptId",
    component: "input",
    isShow: false,
    label: "部门Id"
  },
  {
    prop: "parentId",
    component: "TreeSelect",
    label: "上级部门",
    required: true,
    componentProps: {
      api: getListDeptAll,
      props: {
        children: "children",
        label: "deptName"
      },
      nodeKey: "deptId",
      checkStrictly: true,
      defaultExpandAll: true
    }
  },
  {
    prop: "deptName",
    component: "input",
    label: "部门名称",
    required: true,
    colSpan: 12
  },
  {
    prop: "orderNum",
    component: "input-number",
    label: "排序",
    required: true,
    colSpan: 12
  },
  {
    prop: "leader",
    component: "select",
    label: "负责人",
    colSpan: 12,
    componentProps: {
      api: listUserAll,
      labelField: "userName",
      valueField: "userId"
    }
  },
  {
    prop: "phone",
    component: "input",
    label: "联系电话",
    colSpan: 12,
    rules: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入合法手机号", trigger: "blur" }]
  },
  {
    prop: "email",
    component: "input",
    label: "邮箱",
    colSpan: 12,
    rules: [
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "请输入合法邮箱",
        trigger: "blur"
      }
    ]
  },
  {
    prop: "deptStatus",
    component: "RadioGroup",
    label: "部门状态",
    required: true,
    colSpan: 12,
    componentProps: {
      options: sys_normal_disable
    }
  }
]
