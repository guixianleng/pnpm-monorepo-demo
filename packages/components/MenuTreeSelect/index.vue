<template>
  <div class="menu-tree">
    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">
      展开/折叠
    </el-checkbox>
    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">
      全选/全不选
    </el-checkbox>
    <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event)">
      父子联动
    </el-checkbox>
    <el-tree
      ref="menuRef"
      :data="menuOptions"
      show-checkbox
      :node-key="nodeKey"
      :check-strictly="!menuCheckStrictly"
      empty-text="加载中，请稍候"
      :props="{ label: propLabel, children: 'children' }"
      class="tree-border"
      @check-change="handleTreeChange"
    ></el-tree>
    <div :class="{ 'disabled-select': disabled }"></div>
  </div>
</template>

<script setup lang="ts" name="MenuTreeSelect">
import { MenuTreeOption, RoleMenuTree } from "@user-admin/types"
import { listMenu as menuTreeselect, roleMenuTreeselect } from "@user-admin/api"

import { propTypes } from "advint-ui"

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[] | number[]>,
    default: () => []
  },
  // 对应角色id
  roleId: propTypes.oneOfType([propTypes.string, propTypes.number]).def(""),
  // 选入的选入菜单的ids
  menuIds: {
    type: Array as PropType<string[] | number[]>,
    default: () => []
  },
  // 是否禁用选择树
  disabled: propTypes.bool.def(false)
})

const propLabel = computed(() => (props.roleId ? "label" : "menuName"))
const nodeKey = computed(() => (props.roleId ? "id" : "menuId"))

const emits = defineEmits(["update:modelValue"])

// 菜单树相关
const menuRef = ref<ElTreeInstance>()
const menuOptions = ref<MenuTreeOption[]>([])
const menuExpand = ref<boolean>(false)
const menuNodeAll = ref<boolean>(false)
const menuCheckStrictly = ref<boolean>(true)

watchEffect(() => {
  // 处理回显数据
  if (props.menuIds?.length > 0 && menuOptions.value.length) {
    props.menuIds.forEach(v => {
      nextTick(() => {
        menuRef.value?.setChecked(v, true, false)
        // 展开所选项
        // menuRef.value.store.nodesMap[v].expanded = true
      })
    })
  }
})

/** 查询菜单树结构 */
const getMenuTreeselect = async () => {
  const { data } = await menuTreeselect({})
  menuOptions.value = data as any
}

/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = (roleId: string | number) => {
  return roleMenuTreeselect(roleId).then((res): RoleMenuTree => {
    menuOptions.value = res.data.menus
    return res.data
  })
}

/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value: boolean) => {
  let treeList = menuOptions.value
  for (let i = 0; i < treeList.length; i++) {
    if (menuRef.value) {
      console.log(value)
      // menuRef.value.store.nodesMap[treeList[i]?.menuId].expanded = value
    }
  }
}

/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: any) => {
  menuRef.value?.setCheckedNodes(value ? (menuOptions.value as any) : [])
}

/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: any) => {
  menuCheckStrictly.value = value
}

/** 所有菜单节点数据 */
const getMenuAllCheckedKeys = (): any => {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value?.getCheckedKeys()
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value?.getHalfCheckedKeys()
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys)
  }
  return checkedKeys
}

// 更改树触发
const handleTreeChange = () => {
  const values = getMenuAllCheckedKeys()
  emits("update:modelValue", values)
}

onMounted(async () => {
  const { roleId } = props
  if (roleId) {
    const res = await getRoleMenuTreeselect(roleId)
    res.checkedKeys.forEach(v => {
      nextTick(() => {
        menuRef.value?.setChecked(v, true, false)
        // 展开所选项
        // menuRef.value?.store.nodesMap[v].expanded = true
      })
    })
  } else {
    getMenuTreeselect()
  }
})
</script>

<style lang="scss" scoped>
.menu-tree {
  width: 100%;
  height: 100%;
  position: relative;
  .tree-border {
    margin-top: 5px;
    border: 1px solid #e5e6e7;
    background: #fff none;
    border-radius: 4px;
    width: 100%;
  }
  .disabled-select {
    background-color: rgba(245, 247, 250, 0.5);
    cursor: not-allowed;
    z-index: 1010;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
