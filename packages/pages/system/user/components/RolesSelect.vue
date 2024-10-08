<script setup lang="ts">
import type { RoleVO } from "@user-admin/types"
import { listRole } from "@user-admin/api"

const rolesIds = defineModel({
  type: Array,
  default: () => []
})
const rolesList = ref<RoleVO[]>([])
onMounted(() => {
  if (rolesList.value.length) return
  listRole({
    pageNum: 1,
    pageSize: 999,
    roleStatus: 1
  }).then(res => {
    const { list = [] } = res.data
    rolesList.value = list
  })
})
</script>

<template>
  <el-select-v2
    v-model="rolesIds"
    multiple
    :props="{
      value: 'roleId',
      label: 'roleName'
    }"
    :options="rolesList"
  >
  </el-select-v2>
</template>

<style scoped lang="scss"></style>
