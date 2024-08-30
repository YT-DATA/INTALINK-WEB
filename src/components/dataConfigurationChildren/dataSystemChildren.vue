<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item :label="$t('systemManagement.System_Name')" prop="systemName">
        <el-input
            v-model="queryParams.systemName"
            :placeholder="$t('systemManagement.System_Name_Tip')"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
            @change="handleDataSystemChange"
        />
      </el-form-item>
      <el-form-item :label="$t('systemManagement.System_coding')" prop="systemCode">
        <el-input
            v-model="queryParams.systemCode"
            :placeholder="$t('systemManagement.System_coding_Tip')"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
            @change="handleCodeSystemChange"
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
      <el-table-column :label="$t('systemManagement.System_Name')" align="left" prop="systemName" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.systemName"></el-input>
          <span v-else>{{ row.systemName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systemManagement.System_coding')" align="left" prop="systemCode">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.systemCode"></el-input>
          <span v-else>{{ row.systemCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systemManagement.System_Description')" align="left" prop="systemRemark" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.systemRemark"></el-input>
          <span v-else>{{ row.systemRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systemManagement.Creation_time')" align="left" prop="creatTime">
        <template #default="{row}">
          <!--          <el-input v-if="row.status" v-model="row.creatTime"></el-input>-->
          <span>{{ row.creatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systemManagement.Associate_data_sources')" align="left" prop="dataSourceId">
        <template #default="{row}">
          <el-select
              v-model="row.dataSourceId"
              placeholder="Select"
              @change=""
              v-if="row.status"
          >
            <el-option
                v-for="item in dataSourceNameOptions"
                :key="item.dataSourceId"
                :label="item.dataSourceName"
                :value="item.dataSourceId"
            />
          </el-select>
          <span v-else>{{ row.dataSourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systemManagement.Associated_data_model')" align="left" prop="dataModelId">
        <template #default="{row}">
          <el-select
              v-model="row.dataModelId"
              placeholder="Select"
              @change=""
              v-if="row.status"
          >
            <el-option
                v-for="item in dataModelNameOptions"
                :key="item.dataModelId"
                :label="item.dataModelName"
                :value="item.dataModelId"
            />
          </el-select>
          <span v-else>{{ row.dataModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('systemManagement.operation')" width="180" align="center" class-name="small-padding fixed-width">
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
import {
  insertSystemBasicList,
  systemBasicList,
  deleteSystemBasic,
  dataModelSelectAll,
  dataSourceBasicSelectAll
} from "@/api/configuration/configuration.js";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
const route = useRoute();
const router = useRouter();
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
const dataSourceNameOptions = ref([]);
const dataModelNameOptions = ref([]);
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  systemName: '',
  systemCode: '',
});
const dataList = ref([]);
onMounted(() => {
  getList();
  dataNexus.subscribeToDataChange('dataSystemChildren', 'systemName', systemNameDataUpdated);
  dataNexus.subscribeToDataChange('dataSystemChildren', 'systemCode', systemCodeDataUpdated);
  dataNexus.subscribeToDataChange('dataSystemChildren', 'dataList', dataListUpdated);
});

const onSubmit = () => {
  console.log('submit!');
};

const handleDataSystemChange = (newValue) => {
  dataNexus.updateSharedData('dataSystemChildren', 'systemName', newValue);
  // dataNexus.sharedData.myPlugin.doSomething();
};

const handleCodeSystemChange = (newValue) => {
  dataNexus.updateSharedData('dataSystemChildren', 'systemCode', newValue);
  // dataNexus.sharedData.myPlugin.doSomething();
};


function systemNameDataUpdated(newValue) {
  queryParams.systemName = newValue;
}

function systemCodeDataUpdated(newValue) {
  queryParams.systemCode = newValue;
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
  systemBasicList(queryParams).then(response => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    dataList.value.forEach(item => {
      Reflect.set(item, 'status', false);
    })
  });
  dataNexus.updateSharedData('dataSystemChildren', 'dataList', dataList.value);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.systemId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  const lineData = {
    systemId: '',
    systemName: '',
    systemCode: '',
    systemRemark: '',
    status: true,
  }
  dataList.value.unshift(lineData)
  dataSourceSelectAll()
  ModelSelectAll()
}

/** 取消按钮 */
function cancel() {
  open.value = false;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  row.status = true
  dataSourceSelectAll()
  ModelSelectAll()
}

/** 保存按钮操作 */
function handleSaveUpdate(row) {
  if (row.dataSourceId == null) {
    proxy.$modal.msgError('请选择关联数据源')
    return
  }
  if (row.dataModelId == null) {
    proxy.$modal.msgError('请选择关联数据模型')
    return;
  }
  insertSystemBasicList(row).then(response => {
    row.status = false
    getList();
    proxy.$modal.msgSuccess("保存成功");
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const id = ids.value;
  proxy.$modal.confirm('是否确认删除').then(function () {
    return deleteSystemBasic(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 查询所有数据源列表 */
async function dataSourceSelectAll() {
  await dataSourceBasicSelectAll().then(response => {
    const notBindSourceData = {
      dataSourceId: 0,
      dataSourceName: '暂不绑定'
    }
    dataSourceNameOptions.value = response.data;
    dataSourceNameOptions.value.unshift(notBindSourceData)
  });
}

/** 查询所有模型列表 */
function ModelSelectAll() {
  dataModelSelectAll().then(response => {
    const notBindModelData = {
      dataModelId: 0,
      dataModelName: '暂不绑定'
    }
    dataModelNameOptions.value = response.data;
    dataModelNameOptions.value.unshift(notBindModelData)
  });
}
</script>

<style>

</style>
