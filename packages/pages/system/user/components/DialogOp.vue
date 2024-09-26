<script setup lang="ts">
import { useForm, AdvForm, isObject, AdvDialog } from "advint-ui"
import { formSchema } from "../enums/form.enum"
import { updateUser, addUser, getUser } from "@user-admin/api"
import PostSelect from "./PostSelect.vue"
import RoleSelect from "./RolesSelect.vue"
import DeptSelect from "./DeptSelect.vue"
import { useMerge } from "co-utils-vue"
import { md5 } from "js-md5"
// 注册use-form
const [register, { validate, setFieldsValue, getFieldsValue, resetFields }] = useForm({
  schemas: formSchema,
  baseColSpan: 12
})
const emits = defineEmits<{
  (event: "success"): void
}>()
const dialogVisible = defineModel("visible", {
  type: Boolean,
  default: false
})
const props = defineProps({
  editData: {
    type: Object,
    default: () => ({})
  }
})
const dialogTitle = computed(() => (props.editData.userId ? "编辑" : "添加"))
const handleCancel = () => {
  dialogVisible.value = false
}
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  if (values.userPwd && props.editData.userId) {
    values.userPwd = md5(values.userPwd)
  } else {
    delete values.userPwd
  }
  values.userId ? await updateUser(values) : await addUser(values)
  ElMessage.success("操作成功")
  dialogVisible.value = false
  emits("success")
}
const handleOpened = () => {
  if (props.editData.userId) {
    getUser(props.editData.userId).then(res => {
      const postIds = res.data.posts.map(_id => {
        if (isObject(_id)) return _id.postId
        return _id
      })
      const roleIds = res.data.roles.map(_id => {
        if (isObject(_id)) return _id.roleId
        return _id
      })
      setFieldsValue(
        useMerge(res.data, {
          roleIds,
          postIds
        })
      )
    })
  } else {
    resetFields()
  }
}
</script>
<template>
  <adv-dialog
    v-model="dialogVisible"
    :title="dialogTitle + '用户'"
    width="50%"
    append-to-body
    @opened="handleOpened"
  >
    <adv-form @register="register">
      <template #postIds="{ form }">
        <PostSelect v-model="form.postIds"></PostSelect>
      </template>
      <template #roleIds="{ form }">
        <RoleSelect v-model="form.roleIds"></RoleSelect>
      </template>
      <template #deptId="{ form }">
        <DeptSelect v-model="form.deptId"></DeptSelect>
      </template>
    </adv-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </template>
  </adv-dialog>
</template>

<style scoped lang="scss"></style>
