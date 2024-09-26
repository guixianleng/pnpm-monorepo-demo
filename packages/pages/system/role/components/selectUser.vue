<template>
  <adv-dialog
    v-model="dialogVisible"
    title="选择用户"
    width="900px"
    append-to-body
    :before-sure="handleSelectUser"
    @opened="handleOpened"
  >
    <adv-form unfold @register="register" @search="handleSearch" @reset="handleSearch"> </adv-form>
    <adv-table
      v-model:pa-limit="pageSize"
      v-model:pa-page="currentPage"
      v-loading="loading"
      :data="tableData"
      :column="UserColumns"
      height="350"
      pagination
      :pa-total="total"
      @selection-change="handleSelectionChange"
      @page-change="handlePage"
    >
      <template #userStatus="scope">
        <dict-tag :options="sys_normal_disable" :value="scope.row.userStatus" />
      </template>
    </adv-table>
  </adv-dialog>
</template>

<script setup name="SelectUser" lang="ts">
import { AdvTable, useForm, AdvForm, useTableSearch, AdvDialog } from "advint-ui"
import { authUserSelectAll, unallocatedUserList } from "@user-admin/api"
import { UserVO } from "@user-admin/types"
import { UserColumns, SearchSchemas } from "../enums/user-table.enum"
import { useDict } from "@user-admin/utils"

const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    roleId: string | number
  }>(),
  {
    modelValue: false,
    roleId: ""
  }
)

const emits = defineEmits<{
  (event: "update:modelValue", val: boolean): void
  (event: "success"): void
}>()

const { tableData, currentPage, pageSize, total, loading, search } = useTableSearch({
  api: unallocatedUserList
})

// 注册use-form
const [register, { getFieldsValue }] = useForm({
  schemas: SearchSchemas,
  baseColSpan: 8,
  searchFilter: true,
  searchAction: true
})

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits("update:modelValue", val)
  }
})

const userIds = ref<Array<string | number>>([])

// const tableRef = ref<ElTableInstance>()

const handleOpened = () => {
  props.roleId && getList()
}

/**
 * 选择行
 */
// const clickRow = (row: any) => {
//   // ele的bug
//   tableRef.value?.toggleRowSelection(row, false)
// }

/** 多选框选中数据 */
const handleSelectionChange = (selection: UserVO[]) => {
  userIds.value = selection.map((item: UserVO) => item.userId)
}

/** 查询数据 */
const getList = async () => {
  const values = getFieldsValue()
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    roleId: props.roleId,
    values
  }
  search(params)
}

/** 搜索按钮操作 */
const handleSearch = () => {
  currentPage.value = 1
  getList()
}

// 分页处理
const handlePage = (val: any) => {
  currentPage.value = val.page
  pageSize.value = val.limit
  getList()
}

/**选择授权用户操作 */
const handleSelectUser = async () => {
  if (userIds.value.length === 0) {
    ElMessage.error("请选择要分配的用户")
    return
  }
  await authUserSelectAll({ roleId: props.roleId, userIds: userIds.value.join(",") })
  ElMessage.success("分配成功")
  dialogVisible.value = false
  emits("success")
}
</script>
