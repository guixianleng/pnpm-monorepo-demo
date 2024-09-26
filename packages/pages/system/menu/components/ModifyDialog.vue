<template>
  <adv-dialog
    v-model="dialogVisible"
    :title="dialogTitle + '菜单'"
    :append-to-body="false"
    destroy-on-close
    width="750px"
    @opened="handleOpened"
  >
    <adv-form @register="register">
      <template #icon="{ form }">
        <adv-icon-select v-model="form.menuIcon" :icons="plugins.icons" />
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

<script setup lang="ts" name="ModifyDialog">
import { useForm, AdvForm, AdvDialog, AdvIconSelect } from "advint-ui"
import plugins from "@user-admin/plugins"
import { addMenu, getMenu, updateMenu } from "@user-admin/api"

import { MenuForm } from "@user-admin/types"
import { Formschemas } from "../enums/form.enum"

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    editData: MenuForm
    parentId: string | number
  }>(),
  {
    modelValue: false,
    editData: () => ({}),
    parentId: ""
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

const dialogTitle = computed(() => (props.editData.menuId ? "编辑" : "添加"))

const handleOpened = async () => {
  const { editData, parentId } = props
  setFieldsValue({ parentId })
  if (editData?.menuId) {
    const { data } = await getMenu(props.editData.menuId!)
    setFieldsValue(data)
  }
}

// 注册use-form
const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
  baseColSpan: 24,
  schemas: Formschemas
})

const handleCancel = () => {
  dialogVisible.value = false
}

// 提交
const submitForm = async () => {
  await validate()
  const values = getFieldsValue()
  values.menuId ? await updateMenu(values) : await addMenu(values)
  ElMessage.success("操作成功")
  dialogVisible.value = false
  emits("success")
}
</script>
