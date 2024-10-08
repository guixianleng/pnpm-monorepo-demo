<template>
  <div class="adv-pl-3 adv-pr-5">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24">
        <el-card shadow="never" style="height: 100%">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            prefix-icon="Search"
            clearable
          />
          <el-tree
            ref="deptTreeRef"
            class="adv-mt-2 adv-h-full"
            node-key="parentId"
            :data="deptOptions"
            :props="{ label: 'deptName', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>

      <el-col :lg="20" :xs="24" class="adv-bg-white adv-pt-4 adv-pb-4">
        <adv-form-table
          :column="tableEnum"
          @register="register"
          @selection-change="handleSelection"
          @click-row-delete="handleDelete"
          @click-row-edit="handleDialog"
        >
          <template #toolbar>
            <el-button
              v-hasPermi="permission.ADD"
              type="primary"
              icon="plus"
              @click="() => handleDialog({})"
            >
              新增
            </el-button>
            <el-button v-if="false" type="info" icon="Edit">修改</el-button>
            <el-button
              v-hasPermi="permission.DELETE"
              :disabled="selections.length === 0"
              type="danger"
              icon="Delete"
              @click="() => handleDelete()"
            >
              删除
            </el-button>
            <el-button v-hasPermi="permission.EXPORT" type="primary" icon="Upload">
              导入
            </el-button>
            <el-button v-hasPermi="permission.EXPORT" type="info" icon="Download"> 导出 </el-button>
          </template>
          <template #userStatus="{ row }">
            <el-switch
              v-model="row.userStatus"
              :active-value="1"
              :inactive-value="0"
              @change="handleChange(row)"
            >
            </el-switch>
          </template>
        </adv-form-table>

        <dialog-op
          v-model:visible="dialogForm.visible"
          :edit-data="dialogForm.data"
          @success="reload"
        ></dialog-op>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup name="AdvUser">
import { AdvFormTable, useFormTable, useMessageBox } from "advint-ui"
import { tableEnum } from "./enums/table.enum"
import { SearchSchemas } from "./enums/table.enum"
import { delUser, listUser, updateUserStatus, listDept } from "@user-admin/api"
import DialogOp from "./components/DialogOp.vue"
import type { UserVO, DeptVO } from "@user-admin/types"
import { useTransformTree } from "co-utils-vue"
import { ElTree, ElMessage } from "element-plus"
import { watch, ref, onMounted } from "vue"
import { permission } from "./permission"

const selections = ref<UserVO[]>([])
const deptTreeRef = ref<InstanceType<typeof ElTree>>()
const deptName = ref("")
const deptId = ref("")
const deptOptions = ref<DeptVO[]>([])
const dialogForm = ref({
  visible: false,
  data: {}
})

// 注册use-form
const [register, { reload }] = useFormTable({
  apiFunc: listUser,
  formConfig: {
    schemas: SearchSchemas,
    // 格式化需要的时间
    fieldMapToTime: [["createTime", ["params.beginTime", "params.endTime"], "YYYY-MM-DD"]]
  },
  pagination: true,
  inPage: true
})

const handleDialog = (row: any) => {
  dialogForm.value.visible = true
  dialogForm.value.data = row || {}
  console.log(dialogForm.value.data)
}
const handleSelection = (_selections: UserVO[]) => {
  selections.value = _selections
}
const handleDelete = (row?: UserVO) => {
  const userIds = row?.userId || selections.value.map(item => item.userId)
  useMessageBox({
    tip: "是否确认删除？",
    api: delUser,
    params: userIds,
    successMsg: "删除成功",
    callback: reload
  })
}

/** 查询部门下拉树结构 */
const getTreeSelect = async () => {
  const res = await listDept({
    pageNum: 1,
    pageSize: 9999,
    params: {} as any
  })
  deptOptions.value = useTransformTree(res.data.list, {
    parent: "parentId",
    key: "deptId",
    pid: 0
  })
}
/** 节点单击事件 */
const handleNodeClick = (data: DeptVO) => {
  deptId.value = data.deptId as string
  reload()
}

watch(
  () => deptName.value,
  () => {
    deptTreeRef.value?.filter(deptName.value)
  }
)
/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  console.log(value, data)
  if (!value) return true
  return data.deptName.indexOf(value) !== -1
}

const handleChange = async (row: UserVO) => {
  await updateUserStatus({
    id: row.userId,
    status: row.userStatus
  })
  ElMessage.success("操作成功")
}

onMounted(() => {
  getTreeSelect() // 初始化部门数据
})
</script>
