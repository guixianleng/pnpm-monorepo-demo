<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table :column="tableConfig" @register="register"> </adv-form-table>
  </adv-page>
</template>
<script setup lang="ts" name="AdvLoginLog">
import { getLoginList } from "@user-admin/api"
import { tableConfig, loginSearchSchemas } from "../enums/table.enum"
import { AdvFormTable, AdvPage, useFormTable } from "advint-ui"

const [register] = useFormTable({
  apiFunc: getLoginList,
  formConfig: {
    schemas: loginSearchSchemas,
    // 格式化需要的时间
    fieldMapToTime: [["createTime", ["beginTime", "endTime"], "YYYY-MM-DD hh:mm:ss"]]
  },
  pagination: true,
  inPage: true,
  searchParams: {
    sortColumn: "accessTime",
    sortType: "desc"
  }
})
</script>
