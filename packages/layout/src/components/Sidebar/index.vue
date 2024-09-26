<template>
  <div :style="{ backgroundColor: bgColor }">
    <hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <transition :enter-active-class="animate.menuSearchAnimate.enter" mode="out-in">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="bgColor"
          :text-color="textColor"
          :unique-opened="true"
          :active-text-color="theme"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="(r, index) in sidebarRouters"
            :key="r.path + index"
            :item="r"
            :base-path="r.path"
          />
        </el-menu>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="Sidebar">
import Hamburger from "../Hamburger/index.vue"
import SidebarItem from "./SidebarItem.vue"
import variables from "../../../../styles/variables.module.scss"
import { useAppStore, useSettingsStore, usePermissionStore } from "@user-admin/store"
import { RouteRecordRaw } from "vue-router"
import { animate } from "@user-admin/config"

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const sidebarRouters = computed<RouteRecordRaw[]>(() => permissionStore.getSidebarRoutes())
const sideTheme = computed(() => settingsStore.sideTheme)
const theme = computed(() => settingsStore.theme)
const isCollapse = computed(() => !appStore.sidebar.opened)

const toggleSideBar = () => {
  appStore.toggleSideBar(false)
}

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const bgColor = computed(() =>
  sideTheme.value === "theme-dark" ? variables.menuBackground : variables.menuLightBackground
)

const textColor = computed(() =>
  sideTheme.value === "theme-dark" ? variables.menuColor : variables.menuLightColor
)
</script>
