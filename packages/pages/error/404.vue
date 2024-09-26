<template>
  <div
    class="adv-flex adv-size-full adv-flex-col adv-items-center adv-justify-center adv-duration-300"
  >
    <img :src="errGif" alt="403" class="adv-md:1/3 adv-h-1/3 adv-w-1/2 adv-lg:w-1/4" />
    <div class="adv-text-center">
      <p class="adv-text-foreground adv-mt-8 adv-text-2xl adv-md:text-3xl adv-lg:text-4xl">
        哎呀！未找到页面
      </p>
      <p class="adv-text-muted-foreground adv-md:text-md adv-my-4 adv-lg:text-lg">
        抱歉，我们无法找到您要找的页面。
      </p>
      <el-button type="primary" :icon="Back">
        <router-link to="/"> 返回首页 </router-link>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="NotFound">
import { Back } from "@element-plus/icons-vue"
import errImage from "../../assets/error-page/404.svg"

const errGif = ref(errImage + "?" + +new Date())
</script>
