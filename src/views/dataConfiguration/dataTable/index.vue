<template>
    <dataTableChildren></dataTableChildren>
</template>

<script setup name="DataTable">
import dataTableChildren from "@/components/dataConfigurationChildren/dataTableChildren.vue";
import { ref,onMounted,getCurrentInstance  } from 'vue';

const dataNexusRef = ref(null);
const instance = getCurrentInstance();

// 假设你想在组件挂载后调用 loadBindingsFromJSON
onMounted(() => {

});
</script>

<style scoped>

</style>
