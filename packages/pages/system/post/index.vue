<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table
      :column="DataColumns"
      @register="register"
      @selection-change="handleSelectionChange"
      @click-row-delete="handleDelete"
      @click-row-edit="handleUpdate"
    >
      <template #toolbar>
        <el-button v-hasPermi="permission.ADD" type="primary" icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button
          v-if="ids.length > 0"
          v-hasPermi="permission.DELETE"
          type="danger"
          plain
          icon="Delete"
          @click="handleDelete"
        >
          批量删除
        </el-button>
        <el-button v-hasPermi="permission.EXPORT" plain icon="Download" @click="handleExport">
          导出
        </el-button>
      </template>
      <template #postStatus="{ row }">
        <el-switch
          v-model="row.postStatus"
          v-hasPermi="permission.EDIT"
          :active-value="1"
          :inactive-value="0"
          @change="handleStatusChange(row)"
        ></el-switch>
      </template>
    </adv-form-table>
  </adv-page>
</template>

<script setup name="AdvPost" lang="ts">
import { useMessageBox, AdvFormTable, AdvPage, useFormTable, useDialog } from "advint-ui"
import { listPost, delPost, updatePost } from "@user-admin/api"
import ModifyDialog from "./components/ModifyDialog.vue"
import { DataColumns, SearchSchemas } from "./enums/table.enum"
import type { PostVO } from "@user-admin/types"
import { permission } from "./permission/index"

const [register, { reload }] = useFormTable({
  apiFunc: listPost,
  formConfig: {
    schemas: SearchSchemas,
    baseColProps: {
      span: 6
    }
  },
  pagination: true,
  inPage: true
})

const ids = ref<Array<number | string>>([])
const editRow = ref()

/** 新增按钮操作 */
const handleAdd = async () => {
  const formRef = ref()
  useDialog({
    title: "新增岗位",
    width: "600px",
    contentRenderer: () => h(ModifyDialog, { ref: formRef }),
    beforeSure: async () => {
      await formRef.value.submitForm()
      reload()
    }
  })
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: PostVO[]) => {
  ids.value = selection.map(item => item.postId)
}

/** 部门状态修改 */
const handleStatusChange = async (row: PostVO) => {
  let text = row.postStatus === 1 ? "启用" : "停用"
  const backStatus = row.postStatus === 0 ? 1 : 0
  try {
    await useMessageBox({
      tip: '确认要"' + text + '""' + row.postName + '"岗位吗?',
      api: updatePost,
      params: row,
      successMsg: text + "成功",
      callback: reload,
      onCancel: () => (row.postStatus = backStatus)
    })
  } catch {
    row.postStatus = backStatus
  }
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PostVO) => {
  const formRef = ref()
  editRow.value = row
  useDialog({
    title: "岗位修改",
    width: "600px",
    contentRenderer: () =>
      h(ModifyDialog, {
        ref: formRef,
        editData: editRow.value
      }),
    beforeSure: async () => {
      await formRef.value.submitForm()
      reload()
    }
  })
}

/** 删除按钮操作 */
const handleDelete = async (row?: PostVO) => {
  const postIds = row?.postId || ids.value
  await useMessageBox({
    tip: "是否确认删除所选项？",
    api: delPost,
    params: postIds,
    successMsg: "删除成功",
    callback: reload
  })
}

/** 导出按钮操作 */
const handleExport = () => {}
</script>

<style lang="scss" scoped>
.page-list {
  margin: 24px;
}
</style>
