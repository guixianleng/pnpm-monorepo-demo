<script setup lang="ts">
import type { DeptVO } from "../../../../api/dept/types"
import { listDept } from "@user-admin/api"
import { useTransformTree } from "co-utils-vue"
import { watchEffect } from "vue"
const deptIds = defineModel({
  type: [String, Number]
})
watchEffect(() => {
  console.log(1111, deptIds.value)
})
const deptList = ref<DeptVO[]>([])
onMounted(() => {
  if (deptList.value.length) return

  listDept({
    pageNum: 1,
    pageSize: 999,
    deptStatus: 1
  }).then(res => {
    deptList.value = useTransformTree(res.data.list || [], {
      parent: "parentId",
      key: "deptId",
      pid: 0
    })
  })
})
</script>

<template>
  <el-tree-select
    v-model="deptIds"
    value-key="deptId"
    check-strictly
    show-checkbox
    placeholder="请选择归属部门"
    :props="{
      value: 'deptId',
      label: 'deptName'
    }"
    :data="deptList"
  >
  </el-tree-select>
</template>

<style scoped lang="scss"></style>
