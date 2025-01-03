<template>
  <div class="app-container data-source-children">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item :label="$t('sourceManagement.Database_name')" prop="dataSourceName">
        <el-input
            v-model="queryParams.dataSourceName"
            :placeholder="$t('sourceManagement.Database_Name_Tip')"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
            @change="handleDataSourceNameChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >{{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >{{ $t('btn.batchDelete') }}
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column :label="$t('sourceManagement.Database_name')" align="left" prop="dataSourceName"  show-overflow-tooltip >
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataSourceName"></el-input>
          <span v-else>{{ row.dataSourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sourceManagement.Database_type')" align="left" prop="databaseType">
        <template #default="{row}">
<!--          <el-input v-if="row.status" v-model="row.databaseType"></el-input>-->
          <el-select
              v-if="row.status"
              v-model="row.databaseType"
              :placeholder="$t('PublicVariable.select_tip')"
              :no-data-text="$t('PublicVariable.No_data_available')"
              clearable
          >
            <el-option
                v-for="dict in database_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
          <span v-else>{{ row.databaseType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sourceManagement.Database_URL')" align="left" prop="url" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.url"></el-input>
          <span v-else>{{ row.url }}
          </span>
          <!--          <el-tooltip>{{ row.url }}</el-tooltip>-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sourceManagement.Database_mode')" align="left" prop="schema" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.schema"></el-input>
          <span v-else>{{ row.schema }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sourceManagement.user_name')" align="left" prop="userName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.userName"></el-input>
          <span v-else>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sourceManagement.password')" align="left" prop="password">
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
      <el-table-column :label="$t('sourceManagement.operation')" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-if="!scope.row.status" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
          >{{ $t('btn.edit') }}
          </el-button>
          <el-button v-else link type="primary" icon="Edit" @click="handleSaveUpdate(scope.row)"
          >{{ $t('btn.save') }}
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
const {database_type} = proxy.useDict("database_type");
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
if(dataList.value){
  dataList.value.forEach(item => {
    Reflect.set(item, 'status', false);
    Reflect.set(item, 'isShow', false);
  })
}

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
    schema: '',
    userName: '',
    password: '',
    status: true,
    isShow: true
  }
  console.log(dataList.value)
  if(dataList.value==null){
    dataList.value=[]
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
