<template>
  <adv-dialog
    v-model="dialogVisible"
    :title="dialogTitle + '角色'"
    width="600px"
    append-to-body
    :before-sure="submitForm"
    @opened="handleOpened"
  >
    <adv-form @register="register">
      <template #menu>
        <menu-tree-select v-model="menuIds" :role-id="editData?.roleId" />
      </template>
    </adv-form>
  </adv-dialog>
</template>

<script setup lang="ts">
import { useForm, AdvForm, AdvDialog } from "advint-ui"
import { addRole, updateRole } from "@user-admin/api"
import { MenuTreeSelect } from "@user-admin/components"

import { Formschemas } from "../enums/form.enum"
import { RoleVO } from "@user-admin/types"

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
  schemas: Formschemas
})

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits("update:modelValue", val)
  }
})

const dialogTitle = computed(() => (props.editData.roleId ? "编辑" : "添加"))
const menuIds = ref<string[] | number[]>([])

const handleOpened = async () => {
  const { roleId = "" } = props.editData
  if (roleId) {
    setFieldsValue(props.editData)
  }
}

// 提交
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  const params = {
    ...values,
    menuIds: menuIds.value
  }
  values.roleId ? await updateRole(params) : await addRole(params)
  ElMessage.success("操作成功")
  dialogVisible.value = false
  emits("success")
}
</script>
