<template>
  <div class="lang-select">
    <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
      <div class="lang-wrapper">
        <svg-icon class-name="international-icon" icon-class="lang"/>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="language==='zh_CN'" command="zh_CN">
            <span>中文</span>
          </el-dropdown-item>
          <el-dropdown-item :disabled="language==='en_US'" command="en_US">
            <span>English</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import useAppStore from "@/store/modules/app.js";

export default {
  computed: {
    language() {
      return useAppStore().language
    }
  },
  methods: {
    handleSetLanguage(value) {
      // debugger
      this.$i18n.locale = value
      // this.$store.dispatch('app/setLanguage', value)
      useAppStore().setLanguage(value)
      this.$message({message: this.$t('btn.Language_set_successfully'), type: 'success'})
    }
  }
}
</script>
<style lang="scss">
.lang-select {
  height: 100%;
  padding: 0 3px;

  .lang-wrapper {
    margin: 24px auto;

    .international-icon {
      cursor: pointer;
    }
  }
}
</style>