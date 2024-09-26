<template>
  <div
    class="adv-flex adv-size-full adv-flex-col adv-items-center adv-justify-center adv-duration-300"
  >
    <img :src="errGif" alt="403" class="adv-md:1/3 adv-h-1/3 adv-w-1/2 adv-lg:w-1/4" />
    <div class="adv-text-center">
      <p class="adv-text-foreground adv-mt-8 adv-text-2xl adv-md:text-3xl adv-lg:text-4xl">
        哎呀！网络错误
      </p>
      <p class="adv-text-muted-foreground adv-md:text-md adv-my-4 adv-lg:text-lg">
        抱歉，无法连接到互联网，请检查您的网络连接并重试。
      </p>
      <el-button type="primary" :icon="Refresh" @click="handleReload">刷新</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue"
import errImage from "../../assets/error-page/offline.svg"

const errGif = ref(errImage + "?" + +new Date())

const handleReload = () => {
  location.reload()
}
</script>
