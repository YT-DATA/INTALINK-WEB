<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <el-button type="primary" @click="changeTableData">按钮</el-button>
</template>
<script setup>
  import { inject, reactive, onMounted } from 'vue';
  // 使用 inject 获取 DataNexus 提供的方法
  const dataNexus = inject('dataNexus');
  let tableData = reactive([
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ])

  onMounted(() => {
    dataNexus.subscribeToDataChange('demo1', 'tableData', tableDataUpdated);
    // dataNexus.subscribeToDataChange('demo1', 'region', regionDataUpdated);
  });
  function tableDataUpdated(newValue){

    if(newValue==1){
      tableData.splice(0, tableData.length, ...[
        {
          date: '2016-05-01',
          name: '关羽',
          address: '河东解良',
        },
      ]);
    }else{
      tableData.splice(0, tableData.length, ...[
        {
          date: '2016-08-01',
          name: '张飞',
          address: '蜀国',
        },
      ]);
    }
  }
  function changeTableData(){

    tableData.splice(0, tableData.length, ...[
      {
        date: '2016-05-01',
        name: '关羽',
        address: '河东解良',
      },
    ]);
  }
</script>



<style scoped lang="scss">

</style>
