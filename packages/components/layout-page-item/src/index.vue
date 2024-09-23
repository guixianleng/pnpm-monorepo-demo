<template>
  <section class="adv-layout_page_item" :class="{ 'page-item_no_margin': noMargin }">
    <slot />
  </section>
</template>

<script setup lang="ts" name="AdvLayoutPageItem">
defineProps({
  noMargin: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.adv-layout_page_item {
  // margin: 8px;
  padding: 16px;
  background: var(--el-bg-color);
  border-radius: 4px;
}
.page-item_no_margin {
  margin: 0;
  padding: 0;
}
</style>
