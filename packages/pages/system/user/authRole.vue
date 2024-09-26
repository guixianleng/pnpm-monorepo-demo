<script lang="ts" setup>
import { AdvForm, AdvTable, useForm, useTableSearch } from "advint-ui"
import { rolesTableEnums, roleSchemas } from "./enums/table.enum"
import { getUser, updateAuthRole, listRole } from "@user-admin/api"
import { useRoute } from "vue-router"
import type { UserInfoVO, RoleVO } from "@user-admin/types"
import { ElMessage } from "element-plus"
const { tableData, currentPage, pageSize, total, loading, search } = useTableSearch({
  api: listRole
})
const route = useRoute()
const userId = route.params && (route.params.userId as string)
const userInfo = ref<UserInfoVO>({} as UserInfoVO)
const tableRef = ref<InstanceType<typeof AdvTable>>()
const selectionList = ref<RoleVO[]>([])
const [register, { setFieldsValue }] = useForm({
  schemas: roleSchemas,
  baseColSpan: 6
})
const getList = async () => {
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    roleStatus: 1,
    sortType: "desc",
    sortColumn: "createTime",
    params: {}
  }
  await search(params)
  handleSelected()
}
const handlePage = (val: any) => {
  currentPage.value = val.page
  pageSize.value = val.limit
  getList()
}
/**
 * 处理已经选择的角色
 */
const handleSelected = () => {
  nextTick(() => {
    userInfo.value?.roles?.forEach(item => {
      const _index = tableData.value.findIndex(data => data.roleId === item.roleId)
      if (_index !== -1) {
        tableRef.value?.toggleRowSelection(tableData.value[_index], true)
      }
    })
  })
}
const getUserInfo = () => {
  getUser(userId as string).then(res => {
    userInfo.value = res.data
    setFieldsValue(userInfo.value)
    getList()
  })
}
onMounted(() => {
  getUserInfo()
})
const submitForm = async () => {
  if (selectionList.value.length === 0) return
  const roleIds = selectionList.value.map(item => {
    return item.roleId as string
  })
  await updateAuthRole({
    roleIds,
    userId
  })
  ElMessage.success("提交成功")
  tableRef.value?.clearSelection()
  getUserInfo()
}

const handleClickSelect = (selections: RoleVO[]) => {
  selectionList.value = selections
}
</script>
<template>
  <div class="adv-mx-4 adv-p-3 adv-bg-white">
    <div
      class="adv-flex adv-space-x-5 adv-items-center adv-my-3 adv-py-2 adv-text-blue-300 adv-border-b adv-border-[#ddd] adv-border-solid"
    >
      <h1>基本信息</h1>
    </div>
    <adv-form @register="register"> </adv-form>
    <div
      class="adv-flex adv-space-x-5 adv-items-center adv-w-full adv-my-3 adv-py-2 adv-text-blue-300 adv-border-b adv-border-[#ddd] adv-border-solid"
    >
      <div>角色信息</div>
      <el-button size="small" type="primary" @click="submitForm()"> 提交 </el-button>
    </div>
    <AdvTable
      ref="tableRef"
      key="roleId"
      v-model:pa-limit="pageSize"
      v-model:pa-page="currentPage"
      v-loading="loading"
      border
      pagination
      :height="535"
      row-key="roleId"
      :column="rolesTableEnums"
      :data="tableData"
      :pa-total="total"
      @page-change="handlePage"
      @selection-change="handleClickSelect"
    >
    </AdvTable>
  </div>
</template>
