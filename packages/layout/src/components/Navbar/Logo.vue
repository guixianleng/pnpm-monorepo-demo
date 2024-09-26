<template>
  <div class="logo-container" :class="{ collapse: collapse }">
    <transition :enter-active-class="animate.logoAnimate.enter" mode="out-in">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title" :style="{ color: themeColor }">
          {{ title }}
        </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title" :style="{ color: themeColor }">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts" name="Logo">
import variables from "../../../../styles/variables.module.scss"
import logo from "../../../../assets/logo/logo.svg"
import { defaultSettings, animate } from "@user-admin/config"
import { useSettingsStore } from "@user-admin/store"

defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})

const title = ref(defaultSettings.title)
const settingsStore = useSettingsStore()
const sideTheme = computed(() => settingsStore.sideTheme)

const themeColor = computed(() =>
  sideTheme.value === "theme-dark" ? variables.logoTitleColor : variables.logoLightTitleColor
)
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.logo-container {
  position: relative;
  display: flex;
  align-items: center;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 91px;
      height: 25px;
      vertical-align: middle;
      margin-right: 15px;
      display: inline-block;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #3d3d3d;
      font-weight: 700;
      font-size: 20px;
      font-family:
        Avenir,
        Helvetica Neue,
        Arial,
        Helvetica,
        sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
