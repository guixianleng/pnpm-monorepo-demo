<template>
  <div
    ref="LayoutPageRef"
    class="adv-layout_page"
    :class="{ 'layout-page_no_margin': noMargin }"
    @scroll="(e: any) => (scrollTop = e.target.scrollTop)"
  >
    <slot />
    <div v-if="backtop" class="back_to_top">
      <div v-if="isShowGoTopButton" @click="backToTop">
        <el-icon v-bind="{ size: 24, ...$attrs }"><CaretTop /></el-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="AdvLayoutPage">
import { onActivated, onMounted, ref, watch } from "vue"

const props = defineProps({
  scrollDisabled: {
    type: Boolean,
    default: false
  },
  noMargin: {
    type: Boolean,
    default: false
  },
  // 是否显示返回顶部按钮
  backtop: {
    type: Boolean,
    default: true
  },
  // 滚动条位置
  scrollToTop: {
    type: Number,
    default: 100
  }
})
const isShowGoTopButton = ref<boolean>(false)
const LayoutPageRef = ref<any>(null)
const scrollTop = ref<number>(0)

watch(
  () => scrollTop.value,
  newVal => {
    if (newVal > props.scrollToTop) {
      isShowGoTopButton.value = true
    } else {
      isShowGoTopButton.value = false
    }
  }
)

const backToTop = () => {
  scrollTop.value = 0
  ;(LayoutPageRef.value as any).scrollTop = 0
}

onMounted(() => {
  const pageItems = (LayoutPageRef.value as any).querySelectorAll(".adv-layout_page_item")
  if (pageItems.length === 2) {
    pageItems[0].style.marginBottom = "8px"
  }
  if (pageItems.length > 2) {
    pageItems.forEach((item: any) => {
      item.style.marginBottom = "8px"
    })
    pageItems[pageItems.length - 1].style.marginBottom = "0"
  }
})

onActivated(() => {
  if (!props.scrollDisabled) {
    ;(LayoutPageRef.value as any).scrollTop = scrollTop
  }
})
</script>

<style lang="scss" scoped>
.adv-layout_page {
  display: flex;
  flex-direction: column;
  padding: 8px;
  width: 100%;
  height: 100%;
  overflow: auto;
  .back_to_top {
    position: fixed;
    right: 10px;
    bottom: 100px;
    z-index: 100;
    box-shadow: 0 5px 6px 2px rgba(0, 0, 0, 0.5);
    background: #fff;
    border-radius: 5px;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }

    > div {
      cursor: pointer;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-icon {
        color: #9b59b6;
      }
    }
  }
}
.layout-page_no_margin {
  padding: 0;
}
</style>
