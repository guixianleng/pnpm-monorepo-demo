<template>
  <div
    class="navbar"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground
    }"
  >
    <div class="navbar-left flex align-center">
      <logo v-if="showLogo" />
      <top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />
    </div>

    <div class="right-menu flex align-center">
      <div class="avatar-container">
        <el-dropdown class="dropdown-link" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <el-image :src="userStore.avatar" class="user-avatar">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in dropList"
                :key="item.command"
                :divided="item.divided"
                :command="item.command"
              >
                <span>{{ item.label }}</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="hasLogout" :divided="dropList.length > 0" command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-if="settingsStore.showSettings" class="setting-icon" @click="handleSetLayout">
        <el-icon :color="themeColor"><Setting /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Navbar">
import { ElMessageBox } from "element-plus"
import { Picture as IconPicture } from "@element-plus/icons-vue"
import variables from "../../../../styles/variables.module.scss"
import { useSettingsStore, useNoticeStore, useUserStore } from "@user-admin/store"

import TopNav from "./TopNav.vue"
import Logo from "./Logo.vue"

const userStore = useUserStore()
const settingsStore = useSettingsStore()
const noticeStore = storeToRefs(useNoticeStore())
const showLogo = computed(() => settingsStore.sidebarLogo)
const sideTheme = computed(() => settingsStore.sideTheme)
const newNotice = ref(<number>0)

interface IDropItem {
  command: string
  label: string
  divided?: boolean
}

defineProps({
  // 是否需要显示退出登录操作
  hasLogout: {
    type: Boolean,
    default: true
  },
  // 其他下拉操作
  dropList: {
    type: Array as PropType<IDropItem[]>,
    default: () => []
  }
})
const emits = defineEmits(["setLayout", "drop-action"])

const themeColor = computed(() =>
  sideTheme.value === "theme-dark" ? variables.logoTitleColor : variables.logoLightTitleColor
)

const logout = async () => {
  await ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
  await userStore.logout()
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + "index"
}

const handleSetLayout = () => {
  emits("setLayout")
}

const handleCommand = (command: string) => {
  if (command === "logout") {
    logout()
  } else {
    emits("drop-action", command)
  }
}
//用深度监听 消息
watch(
  () => noticeStore.state.value.notices,
  newVal => {
    newNotice.value = newVal.filter((item: any) => !item.read).length
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
@import "../../../../styles/variables.module.scss";
.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.navbar {
  height: $base-top-nav-height;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 3px 5px 0px rgba(201, 202, 204, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 1011;

  .right-menu {
    .setting-icon {
      padding: 0 12px;
      cursor: pointer;
      line-height: $base-top-nav-height;
      &:hover {
        // background-color: #f6f6f6;
      }
      .el-icon {
        vertical-align: middle;
      }
    }

    .avatar-container {
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 42px;
          height: 42px;
          border-radius: 4px;
        }

        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 24px;
        }

        i {
          cursor: pointer;
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
