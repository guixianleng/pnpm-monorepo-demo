<script setup lang="ts">
import type { UserVO } from "@user-admin/types"
import { updatePassword } from "@user-admin/api"
import { useRouter } from "vue-router"
import { permission } from "../permission"
import { useHasPermission } from "@user-admin/hooks"
import { md5 } from "js-md5"
import { ElMessage, ElMessageBox } from "element-plus"

const router = useRouter()
const props = defineProps({
  row: {
    type: Object as PropType<UserVO>,
    default: () => ({}) as UserVO
  }
})
const toRole = () => {
  router.push("/system/user-auth/role/" + props.row.userId)
}
const handleCommand = async (cmd: "reset" | "role") => {
  if (cmd == "reset") {
    const { value } = await ElMessageBox.prompt(`请输入 [${props.row?.userName}] 新密码`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValidator: (_value: string) => {
        if (!_value?.trim()) return "密码不能为空"
        return true
      }
    })
    await updatePassword({
      userId: props.row?.userId,
      userPwd: md5(value)
    })
    ElMessage.success("操作成功")
  } else {
    toRole()
  }
}
</script>

<template>
  <div style="padding: 3px 0">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <el-icon class="el-icon--right">
          <More />
        </el-icon>
        更多
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="useHasPermission(permission.CZMM)" command="reset"
            >重置密码</el-dropdown-item
          >
          <el-dropdown-item v-if="useHasPermission(permission.AUTH_ROLE)" command="role"
            >分配角色</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.el-tooltip__trigger:focus-visible {
  outline: unset;
}

/*或者是下面这个*/

.el-tooltip__trigger:first-child:focus-visible {
  outline: unset;
}
</style>
