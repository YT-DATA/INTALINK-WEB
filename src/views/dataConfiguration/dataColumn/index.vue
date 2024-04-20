<template>
    <dataColumnChildren></dataColumnChildren>
</template>

<script setup name="DataColumn">
import dataColumnChildren from "@/components/dataConfigurationChildren/dataColumnChildren.vue";
import { ref,onMounted,getCurrentInstance  } from 'vue';

const dataNexusRef = ref(null);
const instance = getCurrentInstance();

// 假设你想在组件挂载后调用 loadBindingsFromJSON
onMounted(() => {

});
</script>

<style scoped>

</style>
