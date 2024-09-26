<template>
  <adv-dialog
    v-model="dialogVisible"
    :title="dialogTitle + '字典类型'"
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
import { addType, updateType } from "../../../../api/dict/type"

import { Formschemas } from "../enums/form.enum"
import { DictTypeForm } from "../../../../api/dict/type/types"

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    editData: DictTypeForm
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

const dialogTitle = computed(() => (props.editData.dictId ? "编辑" : "添加"))

const handleOpened = () => {
  if (props.editData.dictId) {
    setFieldsValue(props.editData)
  }
}

// 注册use-form
const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
  baseColSpan: 24,
  schemas: Formschemas
})

// 提交
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  values.dictId ? await updateType(values) : await addType(values)
  ElMessage.success("操作成功")
  dialogVisible.value = false
  emits("success")
}
</script>
