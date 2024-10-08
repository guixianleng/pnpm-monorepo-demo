<template>
  <adv-form @register="register" />
</template>

<script setup lang="ts">
import { useForm, AdvForm } from "advint-ui"
import { Formschemas } from "../enums/form.enum"
import { PostForm } from "@user-admin/types"
import { addPost, getPost, updatePost } from "@user-admin/api"
const props = withDefaults(
  defineProps<{
    editData?: PostForm
  }>(),
  {
    editData: () => ({}) as PostForm
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
  values.postId ? await updatePost(values) : await addPost(values)
  ElMessage.success("操作成功")
}

const handleOpened = async () => {
  if (props.editData.postId) {
    const { data } = await getPost(props.editData.postId)
    setFieldsValue(data)
  }
}

onMounted(() => handleOpened())

defineExpose({
  submitForm
})
</script>
