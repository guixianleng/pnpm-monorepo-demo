<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition :enter-active-class="animante" mode="out-in">
        <div v-if="!route.meta.noCache">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" v-if="!route.meta.link" :key="route.path" />
          </keep-alive>
          <component
            :is="Component"
            v-if="!route.meta.link && route.meta.noCache"
            :key="route.path"
          />
        </div>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup name="AppMain" lang="ts">
import { useSettingsStore, useTagsViewStore } from "@user-admin/store"
import { animate, defaultSettings } from "@user-admin/config"

import IframeToggle from "./IframeToggle/index.vue"
const tagsViewStore = useTagsViewStore()

// 随机动画集合
const animante = ref<string>("")
const animationEnable = ref(useSettingsStore().animationEnable)
watch(
  () => useSettingsStore().animationEnable,
  (val: boolean) => {
    animationEnable.value = val
    if (val) {
      animante.value = animate.animateList[
        Math.round(Math.random() * animate.animateList.length)
      ] as string
    } else {
      animante.value = animate.defaultAnimate as string
    }
  },
  { immediate: true }
)

// 自动计算高度
const HEIGHT = computed(() => `calc(100vh - ${defaultSettings.fixedHeight}px)`)
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.module.scss";
.app-main {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    height: v-bind(HEIGHT);
    display: flex;
    position: relative;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    min-height: 0;
    box-sizing: border-box;
  }
}
</style>
