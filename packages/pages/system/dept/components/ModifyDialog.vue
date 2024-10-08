<template>
  <adv-form @register="register" />
</template>

<script setup lang="ts">
import { useForm, AdvForm } from "advint-ui"

import { Formschemas } from "../enums/form.enum"
import { DeptForm } from "@user-admin/types"
import { addDept, getDept, updateDept } from "@user-admin/api"
const props = withDefaults(
  defineProps<{
    editData?: DeptForm
  }>(),
  {
    editData: () => ({}) as DeptForm
  }
)

// 注册use-form
const [register, { validate, getFieldsValue, setFieldsValue }] = useForm({
  baseColSpan: 24,
  schemas: Formschemas
})

// 提交
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  values.deptId ? await updateDept(values) : await addDept(values)
  ElMessage.success("操作成功")
}

const handleOpened = async () => {
  if (props.editData.deptId) {
    const { data } = await getDept(props.editData.deptId)
    setFieldsValue(data)
  }
}

onMounted(() => handleOpened())

defineExpose({
  submitForm
})
</script>
