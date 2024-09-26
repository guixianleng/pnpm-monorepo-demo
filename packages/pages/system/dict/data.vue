<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table
      :column="DataColumns"
      @selection-change="handleSelectionChange"
      @click-row-delete="handleDelete"
      @click-row-edit="handleUpdate"
      @register="register"
    >
      <template #toolbar>
        <el-button v-hasPermi="PermDataEnum.ADD" type="primary" icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button
          v-hasPermi="PermDataEnum.DELETE"
          type="danger"
          plain
          icon="Delete"
          @click="hanldeBatchDel"
        >
          批量删除
        </el-button>
      </template>
    </adv-form-table>
  </adv-page>
  <!-- 弹框 -->
  <data-dialog
    v-if="dialogShow"
    v-model="dialogShow"
    :edit-data="editRow"
    @success="reload"
  ></data-dialog>
</template>

<script setup name="AdvDictData" lang="ts">
import { useMessageBox, AdvFormTable, useFormTable, AdvPage } from "advint-ui"

import { getType } from "../../../api/dict/type"
import { listData, delData } from "@user-admin/api"
import { DictDataForm, DictDataVO } from "../../../api/dict/data/types"

import DataDialog from "./components/DataDialog.vue"
import { DataColumns, SearchSchemas } from "./enums/data-table.enum"
import { PermDataEnum } from "./enums/permission.enum"

const route = useRoute()

const ids = ref<Array<string | number>>([])

const [register, { getForm, reload }] = useFormTable({
  apiFunc: listData,
  formConfig: {
    schemas: SearchSchemas
  },
  immediate: false,
  pagination: true,
  inPage: true
})

const dialogShow = ref<boolean>(false)
const editRow = ref<DictDataForm>({})

/** 新增操作 */
const handleAdd = () => {
  dialogShow.value = true
  editRow.value = { dictType: getForm().getFieldsValue().dictType }
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: DictDataVO[]) => {
  ids.value = selection.map(item => item.dictCode)
}

/** 修改操作 */
const handleUpdate = async (row?: DictDataVO) => {
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
const handleDelete = async (row?: DictDataVO) => {
  const dictCodes = row?.dictCode || ids.value
  useMessageBox({
    tip: "是否确认删除所选项？",
    api: delData,
    params: dictCodes,
    successMsg: "删除成功",
    callback: reload
  })
}

/** 查询字典类型详细 */
const getTypes = async (dictId: string | number) => {
  const { data } = await getType(dictId)
  await getForm().setFieldsValue(data)
  reload()
}

onMounted(() => {
  getTypes(route.params && (route.params.dictId as string))
})
</script>
