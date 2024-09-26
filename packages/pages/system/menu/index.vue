<template>
  <adv-page :content-style="{ marginTop: 0 }">
    <adv-form-table
      :column="DataColumns"
      @register="register"
      @click-row-delete="handleDelete"
      @click-row-edit="handleUpdate"
      @click-row-add="handleAdd"
    >
      <template #toolbar>
        <el-button v-hasPermi="permEnum.ADD" type="primary" icon="Plus" @click="handleAdd">
          新增
        </el-button>
      </template>
      <template #menuIcon="scope">
        <adv-svg-icon :icon-class="scope.row.menuIcon" />
      </template>
      <template #menuStatus="scope">
        <dict-tag :options="tagOptions" :value="scope.row.menuStatus"></dict-tag>
      </template>
    </adv-form-table>
  </adv-page>
  <!-- 弹框 -->
  <modify-dialog
    v-if="dialogShow"
    v-model="dialogShow"
    :edit-data="editRow"
    :parent-id="curParentId"
    @success="getList"
  ></modify-dialog>
</template>

<script setup name="AdvMenu" lang="ts">
import { computed } from "vue"
import { useMessageBox, useFormTable, AdvFormTable, AdvSvgIcon, AdvPage } from "advint-ui"
import { delMenu, listMenu } from "@user-admin/api"
import { MenuForm, MenuVO } from "@user-admin/types"

import ModifyDialog from "./components/ModifyDialog.vue"
import { DataColumns, SearchSchemas, sys_normal_disable } from "./enums/table.enum"
import { permEnum } from "./enums/permission.enum"
import DictTag from "../../../components/DictTag/index.vue"

// 注册use-form
const [register, { reload }] = useFormTable({
  apiFunc: listMenu,
  formConfig: {
    schemas: SearchSchemas
  },
  inPage: true,
  rowKey: "menuId",
  defaultExpandAll: false,
  treeProps: { children: "children" }
})

const dialogShow = ref<boolean>(false)
const editRow = ref<MenuForm>({})
// 当前父节点id
const curParentId = ref<string | number>("")

const tagOptions = computed(() => sys_normal_disable || [])

/** 新增按钮操作 */
const handleAdd = (row?: MenuVO) => {
  if (row && row.menuId) {
    curParentId.value = row.menuId
  } else {
    curParentId.value = 0
    editRow.value = {}
  }
  dialogShow.value = true
}

/** 修改按钮操作 */
const handleUpdate = async (row: MenuVO) => {
  dialogShow.value = true
  editRow.value = row
}

/** 删除按钮操作 */
const handleDelete = async (row: MenuVO) => {
  useMessageBox({
    tip: "是否确认删除" + row.menuName + "菜单？",
    api: delMenu,
    params: row.menuId,
    successMsg: "删除成功",
    callback: reload
  })
}
</script>
