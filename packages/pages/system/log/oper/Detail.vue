<script setup lang="ts">
import "vue-json-pretty/lib/styles.css"

import { useLabelByVal } from "co-utils-vue"
import { PropType } from "vue"
import VueJsonPretty from "vue-json-pretty"

import type { IOperaRecord } from "@user-admin/types"

import { STATUS_LABEL_LIST } from "../constant"

const props = defineProps({
  item: {
    type: Object as PropType<IOperaRecord>,
    default: () => {
      return {} as IOperaRecord
    }
  }
})
const visible = defineModel("visible", {
  type: Boolean,
  default: false
})
const computedItem = computed(() => props.item)
const handleJson = (js: string) => {
  try {
    return JSON.parse(js)
  } catch (e) {
    console.log(e)
    return js
  }
}
const handleCosTime = (row: IOperaRecord) => {
  return row.costTime
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :align-center="false"
    :center="false"
    append-to-body
    draggable
    modal
    title="操作详情"
  >
    <div class="zk-px-3">
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="操作模块：">
          {{ computedItem.title }}
        </el-descriptions-item>
        <el-descriptions-item label="请求地址：">
          {{ computedItem.operUrl }}
        </el-descriptions-item>
        <el-descriptions-item label="操作方法：">
          {{ computedItem.method }}
        </el-descriptions-item>
        <el-descriptions-item label="请求方式：">
          {{ computedItem.requestMethod }}
        </el-descriptions-item>
        <el-descriptions-item label="请求参数:">
          <VueJsonPretty virtual :height="200" :data="handleJson(computedItem.operParam)" />
        </el-descriptions-item>
        <el-descriptions-item label="请求结果：">
          <VueJsonPretty virtual :height="100" :data="handleJson(computedItem.jsonResult)" />
        </el-descriptions-item>
        <el-descriptions-item>
          <div class="zk-flex zk-justify-between">
            <div>
              <span
                >操作状态：
                <el-tag :type="useLabelByVal(STATUS_LABEL_LIST, computedItem.status)?.typeTag">
                  {{ useLabelByVal(STATUS_LABEL_LIST, computedItem.status) }}
                </el-tag>
              </span>
            </div>
            <div>
              <span>消耗时间(ms)：{{ handleCosTime(computedItem) }}</span>
            </div>
            <div>
              <span>操作时间：{{ computedItem.operTime }}</span>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button icon="Close" @click="visible = false"> 取消 </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
