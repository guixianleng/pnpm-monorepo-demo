<template>
  <adv-page :header-style="{ marginTop: 0 }">
    <adv-form-table
      :column="DataColumns"
      @selection-change="handleSelectionChange"
      @click-row-delete="handleDelete"
      @click-row-edit="handleUpdate"
      @register="register"
    >
      <template #toolbar>
        <el-button v-hasPermi="permEnum.ADD" type="primary" icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button
          v-hasPermi="permEnum.DELETE"
          type="danger"
          plain
          icon="Delete"
          @click="hanldeBatchDel"
        >
          批量删除
        </el-button>
      </template>
      <template #dictType="scope">
        <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
          <span>{{ scope.row.dictType }}</span>
        </router-link>
      </template>
    </adv-form-table>
  </adv-page>
  <!-- 弹框 -->
  <modify-dialog
    v-if="dialogShow"
    v-model="dialogShow"
    :edit-data="editRow"
    @success="reload"
  ></modify-dialog>
</template>

<script setup name="AdvDictType" lang="ts">
import { useMessageBox, useFormTable, AdvFormTable, AdvPage } from "advint-ui"
import { listType, delType } from "@user-admin/api"
import type { DictTypeForm, DictTypeVO } from "@user-admin/types"

import ModifyDialog from "./components/ModifyDialog.vue"
import { DataColumns, SearchSchemas } from "./enums/table.enum"
import { permEnum } from "./enums/permission.enum"

// 注册use-form
const [register, { reload }] = useFormTable({
  apiFunc: listType,
  pagination: true,
  formConfig: {
    schemas: SearchSchemas,
    // 格式化需要的时间
    fieldMapToTime: [
      ["params.createTime", ["params.beginTime", "params.endTime"], "YYYY-MM-DD hh:mm:ss"]
    ]
  },
  inPage: true
})

const ids = ref<Array<number | string>>([])

const dialogShow = ref<boolean>(false)
const editRow = ref<DictTypeForm>({})

/** 新增按钮操作 */
const handleAdd = () => {
  dialogShow.value = true
  editRow.value = {}
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: DictTypeVO[]) => {
  ids.value = selection.map(item => item.dictId)
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DictTypeVO) => {
  dialogShow.value = true
  editRow.value = row
}

const hanldeBatchDel = () => {
  // 批量删除
  if (ids.value.length === 0) {
    ElMessage.info("请选择需要删除的项")
    return false
  }
  handleDelete()
}

/** 删除按钮操作 */
const handleDelete = async (row?: DictTypeVO) => {
  const dictIds = row?.dictId || ids.value
  useMessageBox({
    tip: "是否确认删除所选项？",
    api: delType,
    params: dictIds,
    successMsg: "删除成功",
    callback: reload
  })
}
</script>
