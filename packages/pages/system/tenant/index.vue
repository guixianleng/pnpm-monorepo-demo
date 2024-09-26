<template>
  <adv-page can-resize :header-style="{ marginTop: 0 }">
    <template #customHeader>
      <adv-form @register="register" @search="handleSearch" @reset="handleSearch"> </adv-form>
      <el-space class="adv-mb-3">
        <el-button v-hasPermi="permEnum.ADD" type="primary" icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button
          v-if="ids.length > 0"
          v-hasPermi="permEnum.DELETE"
          type="danger"
          plain
          icon="Delete"
          @click="handleDelete()"
        >
          批量删除
        </el-button>
        <!-- <el-button
          v-hasPermi="permEnum.EXPORT"
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
        >
          导出
        </el-button> -->
      </el-space>
    </template>
    <template #default="{ height }">
      <adv-table
        v-model:pa-limit="pageSize"
        v-model:pa-page="currentPage"
        v-loading="loading"
        :data="tableData"
        :column="DataColumns"
        pagination
        :height="height - 35"
        :pa-total="total"
        @page-change="handlePage"
        @selection-change="handleSelectionChange"
        @click-row-delete="handleDelete"
        @click-row-edit="handleUpdate"
      >
        <template #tenantStatus="{ row }">
          <el-switch
            v-model="row.tenantStatus"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </adv-table>
    </template>
  </adv-page>
</template>

<script setup name="AdvTenant" lang="ts">
import {
  useMessageBox,
  AdvTable,
  useForm,
  AdvForm,
  useTableSearch,
  useDialog,
  AdvPage
} from "advint-ui"
import { listTenant, delTenant, changeTenantStatus } from "@user-admin/api"
import type { TenantVO } from "@user-admin/types"

import ModifyDialog from "./components/ModifyDialog.vue"
import { DataColumns, SearchSchemas } from "./enums/table.enum"
import { permEnum } from "./enums/permission.enum"

const { tableData, currentPage, pageSize, total, loading, search } = useTableSearch({
  api: listTenant
})

// 注册use-form
const [register, { getFieldsValue }] = useForm({
  schemas: SearchSchemas,
  baseColProps: {
    span: 8
  },
  showCollapse: true,
  searchAction: true
})

const ids = ref<Array<number | string>>([])
const editRow = ref<TenantVO>({})

/** 查询字典类型列表 */
const getList = () => {
  const values = getFieldsValue()
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    ...values
  }
  search(params)
}

/** 新增按钮操作 */
const handleAdd = async () => {
  const formRef = ref()
  useDialog({
    title: "新增租户",
    width: "700px",
    top: "5vh",
    contentRenderer: () => h(ModifyDialog, { ref: formRef }),
    beforeSure: async () => {
      await formRef.value.submitForm()
      getList()
    }
  })
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: TenantVO[]) => {
  ids.value = selection.map(item => item.tenantId)
}

/** 状态修改 */
const handleStatusChange = async (row: TenantVO) => {
  let text = row.tenantStatus === 1 ? "启用" : "停用"
  const backStatus = row.tenantStatus === 0 ? 1 : 0
  try {
    await useMessageBox({
      tip: "确认要" + text + row.tenantName + "吗?",
      api: changeTenantStatus,
      params: {
        tenantStatus: row.tenantStatus,
        tenantId: row.tenantId
      },
      successMsg: text + "成功",
      callback: () => getList(),
      onCancel: () => (row.tenantStatus = backStatus)
    })
  } catch {
    row.tenantStatus = backStatus
  }
}

/** 修改按钮操作 */
const handleUpdate = async (row?: TenantVO) => {
  const formRef = ref()
  editRow.value = row
  useDialog({
    title: "修改租户",
    width: "700px",
    top: "5vh",
    contentRenderer: () =>
      h(ModifyDialog, {
        ref: formRef,
        editData: editRow.value
      }),
    beforeSure: async () => {
      await formRef.value.submitForm()
      getList()
    }
  })
}

/** 删除按钮操作 */
const handleDelete = async (row?: TenantVO) => {
  const Ids = row?.tenantId || ids.value
  await useMessageBox({
    tip: "是否确认删除所选项？",
    api: delTenant,
    params: Ids,
    successMsg: "删除成功",
    callback: () => {
      getList()
    }
  })
}

/** 导出按钮操作 */
// const handleExport = () => {}

const handleSearch = () => {
  getList()
}

const handlePage = (val: any) => {
  currentPage.value = val.page
  pageSize.value = val.limit
}

onMounted(() => {
  getList()
})
</script>
