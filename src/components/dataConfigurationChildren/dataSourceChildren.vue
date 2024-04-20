<template>
  <div class="app-container data-source-children">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="数据库名称" prop="dataSourceName">
        <el-input
            v-model="queryParams.dataSourceName"
            placeholder="请输入数据库名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
            @change="handleDataSourceNameChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >批量删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="数据库名称" align="center" prop="dataSourceName" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataSourceName"></el-input>
          <span v-else>{{ row.dataSourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库类型" align="center" prop="databaseType">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.databaseType"></el-input>
          <span v-else>{{ row.databaseType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库URL" align="center" prop="url" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.url"></el-input>
          <span v-else>{{ row.url }}
          </span>
          <!--          <el-tooltip>{{ row.url }}</el-tooltip>-->
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="userName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.userName"></el-input>
          <span v-else>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center" prop="password">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.password"></el-input>
          <span v-else>
            <span v-if="row.isShow" style="display:inline-block;width: 80px">{{ row.password }}</span>
            <span v-else style="display:inline-block;width: 80px">******</span>
            <span @click="changeShow(row)">
              <el-icon v-if="row.isShow" style="cursor: pointer"><View/></el-icon>
              <el-icon v-else style="cursor: pointer"><Hide/></el-icon>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-if="!scope.row.status" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button v-else link type="primary" icon="Edit" @click="handleSaveUpdate(scope.row)"
          >保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />


  </div>
</template>

<script setup>
import {inject, reactive, onMounted} from 'vue';
import {deleteSourceBasic, insertSourceBasicList, listSource} from "@/api/configuration/configuration";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
// 使用 inject 获取 DataNexus 提供的方法
const dataNexus = inject('dataNexus');
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const open = ref(false);
const form = reactive({});

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dataSourceName: '',
});
const dataList = ref([]);
onMounted(() => {
  getList();
  dataNexus.subscribeToDataChange('dataSourceChildren', 'dataSourceName', dataSourceNameDataUpdated);
  dataNexus.subscribeToDataChange('dataSourceChildren', 'dataList', dataListUpdated);

});

const onSubmit = () => {
  console.log('submit!');
};

const handleDataSourceNameChange = (newValue) => {
  dataNexus.updateSharedData('dataSourceChildren', 'dataSourceName', newValue);
  // dataNexus.sharedData.myPlugin.doSomething();
};


function dataSourceNameDataUpdated(newValue) {
  queryParams.dataSourceName = newValue;
}

function dataListUpdated(newValue) {
  dataList.value = newValue
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

/** 查询列表 */
function getList() {
  loading.value = true;
  listSource(queryParams).then(response => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;

    dataList.value.forEach(item => {
      Reflect.set(item, 'status', false);
      Reflect.set(item, 'isShow', false);
    })
  });


  dataNexus.updateSharedData('dataSourceChildren', 'dataList', dataList.value);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dataSourceId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 新增按钮操作 */
function handleAdd() {
  const lineData = {
    dataSourceId: '',
    dataSourceName: '',
    databaseType: '',
    url: '',
    userName: '',
    password: '',
    status: true,
    isShow: true
  }
  dataList.value.unshift(lineData)
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  // reset();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  row.status = true
}

function changeShow(row) {
  row.isShow = !row.isShow
}

/** 保存按钮操作 */
function handleSaveUpdate(row) {
  insertSourceBasicList(row).then(response => {
    row.status = false
    getList();
    proxy.$modal.msgSuccess("保存成功");
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const id = ids.value;
  proxy.$modal.confirm('是否确认删除？').then(function () {
    return deleteSourceBasic(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}
</script>

<style>
.data-source-children {
  .el-popper {
    max-width: 300px !important;
  }
}


</style>
