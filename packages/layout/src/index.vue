<template>
  <div :class="{ 'fixed-header': fixedHeader }">
    <navbar @set-layout="setLayout" />
  </div>
  <!-- 样式占位 -->
  <div :style="NavBarStyle"></div>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <side-bar v-if="!sidebar.hide" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <div class="tag-view-fixed" :class="{ 'fixed-header': fixedHeader }">
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="AdvLayout">
import SideBar from "./components/Sidebar/index.vue"
import { AppMain, Navbar, Settings, TagsView } from "./components"

import { useAppStore, useSettingsStore } from "@user-admin/store"
import { defaultSettings } from "@user-admin/config"

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme)
const sidebar = computed(() => useAppStore().sidebar)
const device = computed(() => useAppStore().device)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === "mobile"
}))

const { width } = useWindowSize()
const WIDTH = 992 // refer to Bootstrap's responsive design

watchEffect(() => {
  if (device.value === "mobile") {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice("mobile")
    useAppStore().closeSideBar({ withoutAnimation: true })
  } else {
    useAppStore().toggleDevice("desktop")
  }
})

const settingRef = ref<InstanceType<typeof Settings>>()

const NavBarStyle = computed(() => {
  if (fixedHeader.value) {
    return {
      height: defaultSettings.fixedHeight + "px",
      backgroundColor: "transparent"
    }
  }
  return {
    height: 0
  }
})

const handleClickOutside = () => {
  useAppStore().closeSideBar({ withoutAnimation: false })
}

const setLayout = () => {
  settingRef.value?.openSetting()
}
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";
@import "../../styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  transition: width 0.28s;
  background: $fixed-header-bg;
  width: 100%;
  z-index: 1011;
  &.tag-view-fixed {
    width: calc(100% - #{$base-sidebar-width});
    top: $base-top-nav-height;
  }
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
