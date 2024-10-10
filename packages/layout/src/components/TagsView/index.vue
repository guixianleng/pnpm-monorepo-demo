<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{
          path: tag.path ? tag.path : '',
          query: tag.query,
          fullPath: tag.fullPath ? tag.fullPath : ''
        }"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="isActive(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <close class="el-icon-close" />
        </span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="() => refreshSelectedTag(selectedTag)">
        <refresh-right style="width: 1em; height: 1em" /> 刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <close style="width: 1em; height: 1em" /> 关闭当前
      </li>
      <li @click="closeOthersTags"><circle-close style="width: 1em; height: 1em" /> 关闭其他</li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <back style="width: 1em; height: 1em" /> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <right style="width: 1em; height: 1em" /> 关闭右侧
      </li>
      <li @click="() => closeAllTags(selectedTag)">
        <circle-close style="width: 1em; height: 1em" /> 全部关闭
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="TagsView">
import ScrollPane from "./ScrollPane.vue"
import { getNormalPath } from "@user-admin/utils"
import { usePermissionStore, useTagsViewStore } from "@user-admin/store"
import $tab from "@user-admin/plugins"
import { RouteRecordRaw, RouteLocationNormalized } from "vue-router"

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<RouteLocationNormalized>()
const affixTags = ref<RouteLocationNormalized[]>([])
const scrollPaneRef = ref<InstanceType<typeof ScrollPane>>()

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const route = useRoute()
const router = useRouter()

const visitedViews = computed(() => useTagsViewStore().getVisitedViews())
const routes = computed(() => usePermissionStore().getRoutes())

watch(route, () => {
  addTags()
  moveToCurrentTag()
})
watch(visible, value => {
  if (value) {
    document.body.addEventListener("click", closeMenu)
  } else {
    document.body.removeEventListener("click", closeMenu)
  }
})

const isActive = (r: RouteLocationNormalized): boolean => {
  return r.path === route.path
}
const activeStyle = (tag: RouteLocationNormalized) => {
  if (!isActive(tag)) return {}
  return {
    "background-color": "#fff"
  }
}
const isAffix = (tag: RouteLocationNormalized) => {
  return tag?.meta && tag?.meta?.affix
}
const isFirstView = () => {
  try {
    return (
      selectedTag.value?.fullPath === "/index" ||
      selectedTag.value?.fullPath === visitedViews.value[1]?.fullPath
    )
  } catch (e) {
    console.log(e)
    return false
  }
}
const isLastView = () => {
  try {
    return (
      selectedTag.value?.fullPath === visitedViews.value[visitedViews.value.length - 1]?.fullPath
    )
  } catch (e) {
    console.log(e)
    return false
  }
}
const filterAffixTags = (routes: RouteRecordRaw[], basePath = "") => {
  let tags: RouteLocationNormalized[] = []

  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + "/" + route.path)
      tags.push({
        hash: "",
        matched: [],
        params: undefined,
        query: undefined,
        redirectedFrom: undefined,
        fullPath: tagPath,
        path: tagPath,
        name: route.name as string,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
const initTags = () => {
  const res = filterAffixTags(routes.value)
  affixTags.value = res
  for (const tag of res) {
    // Must have tag name
    if (tag.name) {
      useTagsViewStore().addVisitedView(tag)
    }
  }
}
const addTags = () => {
  const { name } = route
  if (route.query.title) {
    route.meta.title = route.query.title as string
  }
  if (name) {
    useTagsViewStore().addView(route as any)
    if (route.meta.link) {
      useTagsViewStore().addIframeView(route as any)
    }
  }
  return false
}
const moveToCurrentTag = () => {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === route.path) {
        scrollPaneRef.value?.moveToTarget(r)
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route)
        }
      }
    }
  })
}
const refreshSelectedTag = (view: RouteLocationNormalized) => {
  $tab.refreshPage(view)
  if (route.meta.link) {
    useTagsViewStore().delIframeView(route)
  }
}
const closeSelectedTag = (view: RouteLocationNormalized) => {
  $tab.closePage(view).then(({ visitedViews }: any) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
const closeRightTags = () => {
  $tab.closeRightPage(selectedTag.value).then((visitedViews: RouteLocationNormalized[]) => {
    if (!visitedViews.find((i: RouteLocationNormalized) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
const closeLeftTags = () => {
  $tab.closeLeftPage(selectedTag.value).then((visitedViews: RouteLocationNormalized[]) => {
    if (!visitedViews.find((i: RouteLocationNormalized) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
const closeOthersTags = () => {
  router.push(selectedTag.value).catch(() => {})
  $tab.closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
const closeAllTags = (view: RouteLocationNormalized) => {
  $tab.closeAllPage().then(({ visitedViews }) => {
    if (affixTags.value.some(tag => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}
const toLastView = (visitedViews: RouteLocationNormalized[], view?: RouteLocationNormalized) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath as string)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view?.name === "Dashboard") {
      // to reload home page
      router.replace({ path: "/redirect" + view?.fullPath })
    } else {
      router.push("/")
    }
  }
}
const openMenu = (tag: RouteLocationNormalized, e: MouseEvent) => {
  const menuMinWidth = 105
  const offsetLeft = proxy?.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy?.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const l = e.clientX - offsetLeft + 15 // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  top.value = e.clientY - 30
  visible.value = true
  selectedTag.value = tag
}
const closeMenu = () => {
  visible.value = false
}
const handleScroll = () => {
  closeMenu()
}

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 33px;
      line-height: 33px;
      background-color: #f9fafa;
      color: #1a1a1a;
      padding: 0 16px;
      font-size: 12px;
      margin-left: 5px;
      &:hover {
        color: var(--el-color-primary);
      }
      &:first-of-type {
        margin-left: 15px;
        border-radius: 12px 0 0 12px;
      }
      &:last-of-type {
        margin-right: 15px;
        border-radius: 0 12px 12px 0;
      }
      &.active {
        color: var(--el-color-primary);
        background-color: #fff;
        padding-right: 28px;
        font-weight: 400;
        font-size: 14px;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: var(--el-bg-color);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        background: #eee;
      }
      svg {
        margin-right: 4px;
      }
    }
  }
}
</style>

<style lang="scss">
.tags-view-wrapper {
  .tags-view-item {
    position: relative;
    .el-icon-close {
      width: 15px;
      height: 15px;
      text-align: center;
      transform-origin: 100% 50%;
      margin-left: 6px;
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
    }
  }
}
</style>
