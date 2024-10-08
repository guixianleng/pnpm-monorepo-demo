<template>
  <adv-form @register="register">
    <template #menu>
      <menu-tree-select v-model="menuIds" :menu-ids="selectedIds" :disabled="!!editData.tenantId" />
    </template>
  </adv-form>
</template>

<script setup lang="ts">
import { useForm, AdvForm } from "advint-ui"
import md5 from "js-md5"
import CryptoJS from "crypto-js"
import { decode } from "js-base64"
import { Formschemas } from "../enums/form.enum"

import { TenantForm } from "@user-admin/types"
import { addTenant, updateTenant, getTenant, gerDecodeSrcret } from "@user-admin/api"
import { MenuTreeSelect } from "@user-admin/components"

const props = withDefaults(
  defineProps<{
    editData?: TenantForm
  }>(),
  {
    editData: () => ({}) as TenantForm
  }
)

// 注册use-form
const [register, { validate, getFieldsValue, setFieldsValue }] = useForm({
  baseColSpan: 12,
  schemas: Formschemas
})
const menuIds = ref<string[] | number[]>([])
const selectedIds = ref<string[] | number[]>([])
const secretKey = ref<string>("")

// 提交
const submitForm = async () => {
  setFieldsValue({
    menuIds: menuIds.value
  })
  await validate()
  const values = getFieldsValue()
  // 处理数据
  const params: TenantForm = {
    ...values,
    datasource: {
      ...values.datasource,
      dsPwd: encryptValue(values.datasource.dsPwd)
    },
    password: md5(values.password)
  }
  // console.log(params, 'params')
  values.tenantId ? await updateTenant(params) : await addTenant(params)
  ElMessage.success("操作成功")
}

const handleOpened = async () => {
  const { tenantId = "" } = props.editData
  if (tenantId) {
    const { data } = await getTenant(tenantId)
    if (data) {
      setFieldsValue(data)
      selectedIds.value = data.menuIds
    }
  }
}

// 加密
const encryptValue = (val: string) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey.value)
  const encrypted = CryptoJS.TripleDES.encrypt(val, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

onMounted(async () => {
  handleOpened()
  const { data } = await gerDecodeSrcret()
  if (data) {
    secretKey.value = decode(data)
  }
})

defineExpose({
  submitForm
})
</script>
