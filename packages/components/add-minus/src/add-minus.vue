<template>
  <TransitionGroup name="list" tag="div" :class="['add-minus', className]">
    <div v-for="(item, index) in modelValue" :key="maxLength + index">
      <div class="add-minus--item" :style="{ 'margin-bottom': space }">
        <div class="add-minus--item-top">
          <!-- 内容 -->
          <slot v-if="index < maxLength" :row="item" :index="index"></slot>
        </div>
        <!-- 图标 -->
        <div class="icons">
          <!-- 新增 -->
          <span
            :class="{
              disabled: isDisabled,
              add: true
            }"
            @click="handleAdd(item, index)"
          >
            <el-icon :size="24" :color="isDisabled ? '#D7E3FD' : '#3673F5'">
              <CirclePlusFilled style="font-size: 18px" />
            </el-icon>
          </span>
          <!-- 删除 -->
          <span
            v-if="index !== modelValue.length - 1 || index > 0 || delFirstEnable"
            @click="handleRemove(item, index)"
          >
            <el-icon :size="24" color="#F5392E">
              <RemoveFilled style="font-size: 18px" />
            </el-icon>
          </span>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup name="advAddMinus">
import { CirclePlusFilled, RemoveFilled } from "@element-plus/icons-vue"
import { computed } from "vue"

import { isArray, isBoolean, isNull, isNumber, isObject } from "@adv/utils"

const props = withDefaults(
  defineProps<{
    modelValue: any[]
    // 最大项目数
    maxLength?: number
    // 是否禁用
    disabled?: boolean
    // 垂直方式布局
    alignItems?: "center" | "left" | "right"
    // 自定义样式类名
    className?: string
    // 相邻之间间距
    space?: string
    // 是否可以删除第一个
    delFirstEnable?: boolean
  }>(),
  {
    modelValue: () => [],
    maxLength: 10000,
    disabled: false,
    alignItems: "center",
    className: "",
    space: "18px",
    delFirstEnable: false
  }
)

const emits = defineEmits<{
  (event: "update:modelValue", val: any): void
  (event: "remove", row: any, index: number): void
  (event: "add", row: any, index: number): void
}>()

const isDisabled = computed(() => props.disabled || props.maxLength <= props.modelValue.length)
// 删除
const handleRemove = (row: any, index: number) => {
  if (props.disabled || row.removeDisabled) {
    return false
  }
  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue.splice(index, 1)
  emits("update:modelValue", props.modelValue)
  emits("remove", row, index)
}

// 增加
const handleAdd = (row: any, index: number) => {
  if (props.disabled || props.maxLength <= props.modelValue.length || row.addDisabled) {
    return false
  }
  const result: any = {}
  Object.keys(row).forEach(key => {
    if (isArray(row[key])) {
      result[key] = []
    } else if (isObject(row[key])) {
      result[key] = {}
    } else if (isNull(row[key])) {
      result[key] = null
    } else if (isBoolean(row[key])) {
      result[key] = false
    } else if (isNumber(row[key])) {
      result[key] = 0
    } else {
      result[key] = ""
    }
  })
  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue.splice(index + 1, 0, result)
  emits("update:modelValue", props.modelValue)
  emits("add", row, index)
}
</script>

<style lang="scss" scoped>
@use "./style.scss";
</style>
