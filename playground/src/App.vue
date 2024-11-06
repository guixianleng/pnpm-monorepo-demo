<template>
  <adv-layout-page class="layout-page">
    <adv-layout-page-item>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
    </adv-layout-page-item>
    <adv-layout-page-item>
      <HelloWorld msg="Vite + Vue" />
    </adv-layout-page-item>
    <adv-layout-page-item>
      <div style="display: flex; align-items: center">
        <div style="width: 140px; font-weight: 700">输入防抖时间：</div>
        <el-input-number
          style="width: 240px"
          v-model="time"
          placeholder="请输入防抖时间（毫秒）"
          :min="1000"
          :max="10000"
          :controls="false"
        />
        <adv-button style="margin-left: 15px" color="#626aef" :delay="time" @click="exportExcel">测试防抖</adv-button>
      </div>
    </adv-layout-page-item>
    <adv-layout-page-item>
      <adv-checkbox-group v-model="checked" :options="options"></adv-checkbox-group>
    </adv-layout-page-item>
  </adv-layout-page>
</template>

<script setup lang="ts">
import { 
  AdvLayoutPage,
  AdvLayoutPageItem,
  AdvButton,
  AdvCheckboxGroup,
} from '@adv/components'
import HelloWorld from './components/HelloWorld.vue'

const options = [
  {
    label: '数组数据',
    value: 'array',
  },
  {
    label: '字符串数据',
    value: 'string',
  },
]

const addPlus = ref<any[]>([{}]);
const checked = ref<string[]>([])

const time = ref(1000)
const exportExcel = () => {
  console.log("点击事件")
  ElMessage({
    message: "点击事件",
    type: "success"
  })
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.layout-page {
  height: 100%;
}
</style>
