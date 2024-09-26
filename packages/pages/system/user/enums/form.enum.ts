import type { FormSchema } from "advint-ui"
import { SEX_LABEL_LIST, STATUS_LABEL_LIST } from "../constants"
import { isPhone } from "co-utils-vue"
export const formSchema: FormSchema[] = [
  {
    prop: "userId",
    component: "input",
    label: "",
    isShow: false
  },
  {
    prop: "loginName",
    component: "input",
    label: "登录名",
    required: true
  },
  {
    prop: "userName",
    component: "input",
    label: "用户名",
    required: true
  },
  {
    prop: "userPhone",
    component: "input",
    label: "手机号",
    rules: [
      {
        required: true,
        message: "手机号不能为空",
        trigger: "blur"
      },
      {
        required: true,
        trigger: "blur",
        validator(_rule, value, callback) {
          if (!isPhone(value)) {
            return callback(new Error("手机号无效"))
          }
          return callback()
        }
      }
    ]
  },
  {
    prop: "deptId",
    component: "input",
    slot: "deptId",
    label: "部门",
    required: true
  },
  {
    prop: "postIds",
    component: "input",
    slot: "postIds",
    label: "岗位",
    required: true
  },
  {
    prop: "roleIds",
    component: "input",
    slot: "roleIds",
    label: "角色",
    required: true
  },
  {
    prop: "userEmail",
    component: "input",
    label: "邮箱"
  },
  {
    prop: "userSex",
    component: "RadioGroup",
    required: true,
    label: "性别",
    componentProps: {
      options: SEX_LABEL_LIST
    }
  },
  {
    prop: "userPwd",
    component: "input",
    label: "密码",
    componentProps: {
      type: "password",
      showPassword: true
    }
  },
  {
    prop: "userStatus",
    component: "RadioGroup",
    required: true,
    label: "状态",
    componentProps: {
      options: STATUS_LABEL_LIST
    }
  },
  {
    prop: "userRemark",
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
