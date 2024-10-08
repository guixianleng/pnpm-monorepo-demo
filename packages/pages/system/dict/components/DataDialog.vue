<template>
  <adv-dialog
    v-model="dialogVisible"
    :title="dialogTitle + '字典数据'"
    width="500px"
    append-to-body
    :before-sure="submitForm"
    @opened="handleOpened"
  >
    <adv-form @register="register"></adv-form>
  </adv-dialog>
</template>

<script setup lang="ts">
import { useForm, AdvForm, AdvDialog } from "advint-ui"
import { addData, updateData } from "@user-admin/api"

import { DataFormschemas } from "../enums/form.enum"
import { DictDataForm } from "@user-admin/types"

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    editData: DictDataForm
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

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits("update:modelValue", val)
  }
})

const dialogTitle = computed(() => (props.editData.dictCode ? "编辑" : "添加"))

const handleOpened = () => {
  setFieldsValue(props.editData)
}

// 注册use-form
const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
  baseColSpan: 24,
  schemas: DataFormschemas
})

// 提交
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  values.dictCode ? await updateData(values) : await addData(values)
  ElMessage.success("操作成功")
  dialogVisible.value = false
  emits("success")
}
</script>
