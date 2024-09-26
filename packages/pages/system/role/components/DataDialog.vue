<template>
  <adv-dialog
    v-model="dialogVisible"
    title="分配数据权限"
    width="500px"
    append-to-body
    :before-sure="submitForm"
    @opened="handleOpened"
  >
    <adv-form @register="register" @field-value-change="handleFormChange">
      <template #data>
        <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">
          展开/折叠
        </el-checkbox>
        <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">
          全选/全不选
        </el-checkbox>
        <el-checkbox v-model="deptCheckStrictly" @change="handleCheckedTreeConnect($event)">
          父子联动
        </el-checkbox>
        <el-tree
          ref="deptRef"
          class="tree-border"
          :data="deptOptions"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="checkedKeys"
          :check-strictly="!deptCheckStrictly"
          :props="{ label: 'label', children: 'children' }"
        ></el-tree>
      </template>
    </adv-form>
  </adv-dialog>
</template>

<script setup lang="ts">
import { useForm, AdvForm, AdvDialog } from "advint-ui"
import { dataScope, deptTreeByRole } from "@user-admin/api"
import type { RoleVO, DeptTreeOption } from "@user-admin/types"

import { DataFormschemas } from "../enums/form.enum"

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    editData: RoleVO
  }>(),
  {
    modelValue: false,
    editData: () => ({})
  }
)

const emits = defineEmits<{
  (event: "update:modelValue", val: boolean): void
  (event: "success"): void
}>()

// 注册use-form
const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
  baseColProps: {
    span: 24
  },
  schemas: DataFormschemas
})

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits("update:modelValue", val)
  }
})

// 树处理
const deptRef = ref<ElTreeInstance>()
const deptExpand = ref(true)
const deptNodeAll = ref(false)
const deptOptions = ref<DeptTreeOption[]>([])
const deptCheckStrictly = ref(true)
const checkedKeys = ref([])

const handleOpened = async () => {
  const { roleId } = props.editData
  const res = await getRoleDeptTreeSelect(roleId)
  checkedKeys.value = res.checkedKeys
  await nextTick(() => {
    deptRef.value?.setCheckedKeys(res.checkedKeys)
    setFieldsValue(props.editData)
  })
}

/** 所有部门节点数据 */
const getDeptAllCheckedKeys = (): any => {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value?.getCheckedKeys()
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value?.getHalfCheckedKeys()
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys)
  }
  return checkedKeys
}

/** 根据角色ID查询部门树结构 */
const getRoleDeptTreeSelect = async (roleId: string | number) => {
  const res = await deptTreeByRole(roleId)
  deptOptions.value = res.data.depts
  return res.data
}

/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value: boolean) => {
  let treeList = deptOptions.value
  for (let i = 0; i < treeList.length; i++) {
    if (deptRef.value) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value
    }
  }
}
/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: any) => {
  deptRef.value?.setCheckedNodes(value ? (deptOptions.value as any) : [])
}
/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: any) => {
  deptCheckStrictly.value = value
}

const handleFormChange = (prop: string, val: any) => {
  // 选择角色权限范围触发
  if (prop === "dataScope") {
    val.dataScope !== 2 && deptRef.value?.setCheckedKeys([])
  }
}

// 提交
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  const { roleId, isRoot } = props.editData
  const params = {
    ...values,
    isRoot,
    roleId,
    deptIds: getDeptAllCheckedKeys()
  }
  await dataScope(params)
  ElMessage.success("操作成功")
  dialogVisible.value = false
  emits("success")
}
</script>
