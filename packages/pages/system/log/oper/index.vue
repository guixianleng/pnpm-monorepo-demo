<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table :column="tableOperConfig" @register="register" @click-row-view="handleRowView">
    </adv-form-table>
  </adv-page>
  <Detail v-model:visible="dialog.visible" :item="dialog.item" />
</template>

<script setup lang="ts" name="AdvOperateLog">
import { getOperaList } from "@user-admin/api"
import { tableOperConfig, operSearchSchemas } from "../enums/table.enum"
import { AdvFormTable, AdvPage, useFormTable } from "advint-ui"
import type { IOperaRecord } from "@user-admin/types"
import Detail from "./Detail.vue"

const [register] = useFormTable({
  apiFunc: getOperaList,
  formConfig: {
    schemas: operSearchSchemas,
    baseColProps: {
      span: 8
    },
    // 格式化需要的时间
    fieldMapToTime: [["createTime", ["params.beginTime", "params.endTime"], "YYYY-MM-DD hh:mm:ss"]]
  },
  searchParams: {
    sortColumn: "operTime",
    sortType: "desc"
  },
  inPage: true,
  pagination: true
})

const dialog = ref({
  visible: false,
  item: {} as IOperaRecord
})

const handleRowView = (item: IOperaRecord) => {
  dialog.value.item = item
  dialog.value.visible = true
}
</script>
