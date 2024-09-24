<template>
  <el-checkbox-group v-bind="attrs" v-model="checkedValue">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <el-checkbox-button v-if="props.isBtn" :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </el-checkbox-button>
      <el-checkbox v-else :value="item.value" :disabled="item.disabled" :border="border">
        {{ item.label }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>
<script lang="ts">
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from "element-plus"
import { get, omit } from "lodash-es"
import { computed, defineComponent, PropType, ref, unref, useAttrs, watch, watchEffect } from "vue"

import { Recordable } from "#/types"

import { isFunction, isObject } from "@adv/utils"
import type { CheckOptionsItem } from "./type"

export default defineComponent({
  name: "AdvCheckboxGroup",
  components: { ElCheckbox, ElCheckboxGroup, ElCheckboxButton },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array as PropType<string[] | number[]>,
      default: () => []
    },
    api: {
      type: Function as PropType<(arg?: Recordable | string) => Promise<CheckOptionsItem[]>>,
      default: null
    },
    params: {
      type: [Object, String] as PropType<Recordable | string>,
      default: () => ({})
    },
    numberToString: {
      type: Boolean,
      default: false
    },
    resultField: {
      type: String,
      default: "data"
    },
    labelField: {
      type: String,
      default: "label"
    },
    valueField: {
      type: String,
      default: "value"
    },
    immediate: {
      type: Boolean,
      default: true
    },
    isBtn: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array as PropType<CheckOptionsItem[]>,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const options = ref<CheckOptionsItem[]>([])
    const loading = ref<boolean>(false)
    const isFirstLoad = ref<boolean>(true)
    const attrs = useAttrs()

    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props

      return unref(options).reduce((prev, next: Recordable) => {
        if (isObject(next)) {
          const value = next[valueField]
          prev.push({
            ...omit(next, [labelField, valueField]),
            label: next[labelField],
            value: numberToString ? `${value}` : value
          })
        } else {
          prev.push({
            label: next,
            value: numberToString ? `${next}` : next
          })
        }
        return prev
      }, [] as CheckOptionsItem[])
    })

    watchEffect(() => {
      if (props.options.length === 0) {
        props.immediate && fetch()
      } else {
        options.value = props.options
      }
    })

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch()
      },
      { deep: true }
    )

    // 数据回显和传递
    const checkedValue = computed({
      get: () => props.modelValue,
      set: val => emit("update:modelValue", val)
    })

    async function fetch() {
      const api = props.api
      if (!api || !isFunction(api)) return
      options.value = []
      try {
        loading.value = true
        const res = await api(props.params)
        if (Array.isArray(res)) {
          options.value = res
          return
        }
        if (props.resultField) {
          options.value = get(res, props.resultField) || []
        }
      } catch (error) {
        console.warn(error)
      } finally {
        loading.value = false
      }
    }

    return { attrs, getOptions, loading, checkedValue, props }
  }
})
</script>
