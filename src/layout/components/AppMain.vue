<template>
  <section class="app-main">
    <data-nexus ref="dataNexusRef">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
          </keep-alive>
        </transition>
      </router-view>
      <iframe-toggle/>
    </data-nexus>
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index"
import useTagsViewStore from '@/store/modules/tagsView'
import DataNexus from "datanexus-vue3/src/DataNexus.vue";

const tagsViewStore = useTagsViewStore()
const dataNexusRef = ref(null);
// 假设你想在组件挂载后调用 loadBindingsFromJSON
onMounted(() => {
    dataNexusRef.value.loadBindingsFromJSON('/config.json');
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  /* 70= navbar  50 - 20 */
  min-height: calc(100vh - 70px);
  //width: 100%;
  position: relative;
  overflow: hidden;
  // 添加margin后边距多减去10
  background-color: #fff;
  margin: 10px;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    /* 94 = navbar + tags-view = 50 + 34 - 10 */
    min-height: calc(100vh - 94px);
    border-bottom: 10px solid #f5f5f5;
    margin-bottom: 0;
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>

