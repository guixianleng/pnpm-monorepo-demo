<script setup lang="ts">
import type { PostVO } from "@user-admin/types"
import { listPost } from "@user-admin/api"

const postIds = defineModel({
  type: Array,
  default: () => []
})
const postList = ref<PostVO[]>([])
onMounted(() => {
  if (postList.value.length) return
  listPost({
    pageNum: 1,
    pageSize: 999,
    postStatus: 1
  }).then(res => {
    const { list = [] } = res.data
    postList.value = list
  })
})
</script>

<template>
  <el-select-v2
    v-model="postIds"
    multiple
    :props="{
      value: 'postId',
      label: 'postName'
    }"
    :options="postList"
  >
  </el-select-v2>
</template>

<style scoped lang="scss"></style>
