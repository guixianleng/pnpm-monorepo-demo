<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table
      :column="DataColumns"
      @selection-change="handleSelectionChange"
      @click-row-delete="handleDelete"
      @click-row-edit="handleUpdate"
      @click-btn="handleTableAction"
      @register="register"
    >
      <template #toolbar>
        <el-button v-hasPermi="permEnum.ADD" type="primary" icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button v-hasPermi="permEnum.DELETE" type="danger" @click="hanldeBatchDel">
          删除
        </el-button>
        <el-button v-hasPermi="permEnum.EXPORT" plain icon="Download" @click="handleExport">
          导出
        </el-button>
      </template>
      <template #roleStatus="scope">
        <el-switch
          v-model="scope.row.roleStatus"
          :active-value="1"
          :inactive-value="0"
          @change="handleStatusChange(scope.row)"
        ></el-switch>
      </template>
    </adv-form-table>
  </adv-page>
  <!-- 弹框 -->
  <modify-dialog
    v-if="dialogShow"
    v-model="dialogShow"
    :edit-data="editRow"
    @success="getList"
  ></modify-dialog>
  <!-- 分配权限弹框 -->
  <data-dialog
    v-if="dataScopeShow"
    v-model="dataScopeShow"
    :edit-data="editDataRow"
    @success="getList"
  ></data-dialog>
</template>

<script setup name="AdvRole" lang="ts">
import {
  useMessageBox,
  AdvFormTable,
  useFormTable,
  // downloadByData,
  AdvPage
} from "advint-ui"
import { changeRoleStatus, delRole, listRole } from "@user-admin/api"
import { RoleVO } from "@user-admin/types"

import ModifyDialog from "./components/ModifyDialog.vue"
import DataDialog from "./components/DataDialog.vue"
import { DataColumns, SearchSchemas } from "./enums/table.enum"
import { permEnum } from "./enums/permission.enum"

const router = useRouter()

// 注册use-form
const [register, { reload }] = useFormTable({
  apiFunc: listRole,
  pagination: true,
  formConfig: {
    schemas: SearchSchemas,
    // 格式化需要的时间
    fieldMapToTime: [["params.createTime", ["params.beginTime", "params.endTime"], "YYYY-MM-DD"]]
  },
  inPage: true
})
const ids = ref<Array<string | number>>([])
// 新增、编辑弹框相关
const dialogShow = ref<boolean>(false)
const editRow = ref<RoleVO>({})
// 分配权限弹框
const dataScopeShow = ref<boolean>(false)
const editDataRow = ref<RoleVO>({})

// 批量删除
const hanldeBatchDel = () => {
  if (ids.value.length === 0) {
    ElMessage.info("请选择需要删除的项")
    return false
  }
  handleDelete()
}

/**删除按钮操作 */
const handleDelete = async (row?: RoleVO) => {
  const roleids = row?.roleId || ids.value
  useMessageBox({
    tip: "是否确认删除该角色？",
    api: delRole,
    params: roleids,
    successMsg: "删除成功",
    callback: reload
  })
}

/** 导出按钮操作 */
const handleExport = () => {
  // downloadByData system/role/export
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: RoleVO[]) => {
  ids.value = selection.map((item: RoleVO) => item.roleId)
}

/** 角色状态修改 */
const handleStatusChange = async (row: RoleVO) => {
  let text = row.roleStatus === 1 ? "启用" : "停用"
  const backStatus = row.roleStatus === 0 ? 1 : 0
  try {
    useMessageBox({
      tip: "确认要" + text + row.roleName + "角色吗?",
      api: changeRoleStatus,
      params: {
        roleId: row.roleId,
        roleStatus: row.roleStatus
      },
      successMsg: text + "成功",
      callback: reload,
      onCancel: () => (row.roleStatus = backStatus)
    })
  } catch {
    row.roleStatus = backStatus
  }
}

// 列表操作
const handleTableAction = (type: string, row: any) => {
  switch (type) {
    case "user":
      handleAuthUser(row)
      break
    case "data":
      handleDataScope(row)
      break
    default:
      break
  }
}

/** 分配用户 */
const handleAuthUser = (row: RoleVO) => {
  router.push("/system/role-auth/user/" + row.roleId)
}

/** 分配数据权限操作 */
const handleDataScope = async (row: RoleVO) => {
  editDataRow.value = row
  dataScopeShow.value = true
}

/** 添加角色 */
const handleAdd = () => {
  dialogShow.value = true
  editRow.value = {}
}
/** 修改角色 */
const handleUpdate = async (row?: RoleVO) => {
  dialogShow.value = true
  editRow.value = row
}
</script>
