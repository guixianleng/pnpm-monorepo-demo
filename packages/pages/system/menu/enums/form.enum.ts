import type { FormSchema } from "advint-ui"

import { listMenu } from "@user-admin/api"
import { MenuEnum, MenuTypeEnum } from "../../../../enums/menuEnum"

import { YNOptions } from "./options.enum"

import { useDict } from "@user-admin/utils"

const { sys_show_hide, sys_normal_disable } = toRefs<any>(
  useDict("sys_show_hide", "sys_normal_disable")
)

export const Formschemas: FormSchema[] = [
  {
    prop: "menuId",
    component: "input",
    label: "",
    isShow: false
  },
  {
    prop: "parentId",
    component: "TreeSelect",
    label: "上级菜单",
    required: true,
    componentProps: {
      api: listMenu,
      nodeKey: "menuId",
      props: {
        label: "menuName",
        children: "children"
      },
      parentNode: { menuId: 0, menuName: "主类目", children: [] },
      defaultExpandAll: true,
      checkStrictly: true
    }
  },
  {
    prop: "menuType",
    component: "RadioGroup",
    defaultValue: MenuTypeEnum.M,
    label: "菜单类型",
    required: true,
    componentProps: {
      options: MenuEnum
    }
  },
  {
    prop: "menuIcon",
    component: "input",
    label: "菜单图标",
    required: true,
    slot: "icon",
    isShow({ values }) {
      return values.menuType !== "B"
    }
  },
  {
    prop: "menuName",
    component: "input",
    label: "菜单名称",
    required: true,
    colSpan: 12
  },
  {
    prop: "orderNum",
    component: "input-number",
    label: "显示排序",
    required: true,
    componentProps: {
      controlsPosition: "right",
      min: 0
    },
    colSpan: 12
  },
  {
    prop: "isFrame",
    component: "RadioGroup",
    label: "是否外链",
    helpMessage: "选择是外链则路由地址需要以`http(s)://`开头",
    isShow({ values }) {
      return values.menuType !== "B"
    },
    colSpan: 12,
    defaultValue: "1",
    componentProps: {
      options: YNOptions
    }
  },
  {
    prop: "menuUrl",
    component: "input",
    label: "路由地址",
    required: true,
    helpMessage: "访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头",
    isShow({ values }) {
      return values.menuType !== "B"
    },
    colSpan: 12
  },
  {
    prop: "component",
    component: "input",
    label: "组件路径",
    helpMessage: "访问的组件路径，如：`system/user/index`，默认在`views`目录下",
    isShow({ values }) {
      return values.menuType === "C"
    },
    colSpan: 12
  },
  {
    prop: "menuPerms",
    component: "input",
    label: "权限字符",
    helpMessage: "控制器中定义的权限字符，如：@SaCheckPermission(`system:user:list`)",
    isShow({ values }) {
      return values.menuType !== "M"
    },
    colSpan: 12
  },
  // {
  //   prop: 'queryParam',
  //   component: 'input',
  //   label: '路由参数',
  //   helpMessage: '访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`',
  //   isShow({ values }) {
  //     return values.menuType === 'C'
  //   },
  //   colSpan: 12,
  // },
  // {
  //   prop: 'isCache',
  //   component: 'RadioGroup',
  //   label: '是否缓存',
  //   helpMessage: '访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`',
  //   componentProps: {
  //     options: CacheOptions,
  //   },
  //   defaultValue: 0,
  //   isShow({ values }) {
  //     return values.menuType === 'C'
  //   },
  //   colSpan: 12,
  // },
  {
    prop: "isShow",
    component: "RadioGroup",
    label: "显示状态",
    labelInValue: true,
    helpMessage: "选择隐藏则路由将不会出现在侧边栏，但仍然可以访问",
    isShow({ values }) {
      return values.menuType !== "B"
    },
    defaultValue: 1,
    colSpan: 12,
    componentProps: {
      options: sys_show_hide
    }
  },
  {
    prop: "menuStatus",
    component: "RadioGroup",
    label: "菜单状态",
    helpMessage: "选择停用则路由将不会出现在侧边栏，也不能被访问",
    defaultValue: 1,
    colSpan: 12,
    componentProps: {
      options: sys_normal_disable
    }
  }
]
