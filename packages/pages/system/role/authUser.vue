<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table
      :column="AuthUserColumns"
      @selection-change="handleSelectionChange"
      @click-row-delete="cancelAuthUser"
      @register="register"
    >
      <template #toolbar>
        <el-button v-hasPermi="permEnum.ADDUSER" type="primary" icon="Plus" @click="openSelectUser">
          添加用户
        </el-button>
        <el-button
          v-hasPermi="permEnum.BATCHDELUSER"
          type="danger"
          icon="CircleClose"
          @click="cancelAuthUserAll"
        >
          取消授权
        </el-button>
      </template>
      <template #userStatus="scope">
        <dict-tag :options="sys_normal_disable" :value="scope.row.userStatus" />
      </template>
    </adv-form-table>
  </adv-page>
  <!-- 选择用户 -->
  <select-user v-if="dialogShow" v-model="dialogShow" :role-id="currentRoleId" @success="reload" />
</template>

<script setup name="AdvRoleAuth" lang="ts">
import { useMessageBox, useFormTable, AdvFormTable, AdvPage } from "advint-ui"

import { allocatedUserList, authUserCancel, authUserCancelAll } from "@user-admin/api"
import { UserVO } from "@user-admin/types"
import { useDict } from "@user-admin/utils"

import { AuthUserColumns, SearchSchemas } from "./enums/user-table.enum"
import { permEnum } from "./enums/permission.enum"
import SelectUser from "./components/selectUser.vue"

const { sys_normal_disable } = toRefs<any>(useDict("sys_normal_disable"))

const route = useRoute()

// 注册use-form
const [register, { reload }] = useFormTable({
  apiFunc: allocatedUserList,
  formConfig: {
    schemas: SearchSchemas
  },
  pagination: true,
  inPage: true,
  beforeFetch: (params: any) => {
    params.roleId = currentRoleId.value
    return params
  }
})

const currentRoleId = computed(() => route.params.roleId)

const userIds = ref<Array<string | number>>([])
const dialogShow = ref<boolean>(false)

// 多选框选中数据
const handleSelectionChange = (selection: UserVO[]) => {
  userIds.value = selection.map(item => item.userId)
}
/** 打开授权用户表弹窗 */
const openSelectUser = () => {
  dialogShow.value = true
}

// 批量取消授权
const cancelAuthUserAll = () => {
  if (userIds.value.length === 0) {
    ElMessage.info("请选择需要取消授权的项")
    return false
  }
  const uIds = userIds.value.join(",")
  useMessageBox({
    tip: "是否取消选中用户授权数据项?",
    api: authUserCancelAll,
    params: { roleId: currentRoleId.value, userIds: uIds },
    successMsg: "取消授权成功",
    callback: reload
  })
}

/** 取消授权按钮操作 */
const cancelAuthUser = async (row: UserVO) => {
  useMessageBox({
    tip: '确认要取消该用户"' + row.userName + '"角色吗？',
    api: authUserCancel,
    params: { userId: row.userId, roleId: currentRoleId.value },
    successMsg: "取消授权成功",
    callback: reload
  })
}
</script>
