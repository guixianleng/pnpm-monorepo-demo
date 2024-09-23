<template>
  <el-tooltip v-if="showTooltip" v-bind="tooltipProps">
    <el-button v-bind="$attrs" class="adv-button-tip" @click="handleClick">
      <slot />
    </el-button>
  </el-tooltip>
  <el-button v-else v-bind="getBindValue" @click="handleClick">
    <slot />
  </el-button>
</template>

<script setup lang="ts" name="AdvButton">
import { ref, unref, PropType, useAttrs, computed } from "vue"
import { omit } from "lodash-es"
import type { Placement } from "element-plus/es/components/popper"
import type { ElTooltipProps } from "element-plus/es/components/tooltip"
import { ElButton, ElTooltip } from "element-plus"

const props = defineProps({
  tip: {
    type: String,
    default: ""
  },
  placement: {
    type: String as PropType<Placement>,
    default: "top"
  },
  tipProps: {
    type: Object as PropType<ElTooltipProps>,
    default: () => ({})
  },
  debounce: {
    type: Boolean,
    default: true
  },
  delay: {
    type: Number,
    default: 1000
  }
})
// 抛出事件
const emits = defineEmits(["click"])
const record = ref<number>(0)
const attrs = useAttrs()

const getBindValue = computed(() => {
  return { ...attrs }
})

const showTooltip = computed(() => !!unref(tooltipProps).content)

const tooltipProps = computed((): ElTooltipProps => {
  const { tip, placement, tipProps } = props
  const toolProps = omit(tipProps, ["placement", "content"])
  // @ts-ignore
  return {
    ...toolProps,
    content: tip,
    placement
  }
})

const handleClick = () => {
  const { debounce, delay } = props
  if (!debounce) return emits("click")
  const newTime = new Date()
  if (newTime.getTime() - record.value > delay) {
    emits("click")
  }
  record.value = newTime.getTime()
}
</script>
<style lang="scss" scoped>
.adv-button-tip {
  padding: 0;
  height: auto;
  &:hover,
  &:focus {
    animation: jump 0.3s;
  }
}
@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
