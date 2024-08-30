<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item :label="$t('modelManagement.Model_Name')" prop="dataModelName">
        <el-input
            v-model="queryParams.dataModelName"
            :placeholder="$t('modelManagement.Model_Name_Tip')"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
            @change="handleDataModelChange"
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
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
        >{{ $t('btn.import') }}
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column :label="$t('modelManagement.Model_Name')" align="left" prop="dataModelName" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataModelName"></el-input>
          <span v-else>{{ row.dataModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('modelManagement.Model_coding')" align="left" prop="dataModelCode">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataModelCode"></el-input>
          <span v-else>{{ row.dataModelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('modelManagement.Model_Description')" align="left" prop="dataModelRemark" show-overflow-tooltip>
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataModelRemark"></el-input>
          <span v-else>{{ row.dataModelRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('modelManagement.table_Number')" align="left" prop="dataTableCount">
        <template #default="{row}">
          <!--          <el-input v-if="row.status" v-model="row.dataTableCount"></el-input>-->
          <span>{{ row.dataTableCount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('modelManagement.operation')" width="300" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Upload" @click="handleImportPDM(scope.row)">{{ $t('btn.PDMImport') }}</el-button>
          <el-button v-if="!scope.row.status" link type="primary" icon="Edit" @click="handleUpdate(scope.row)">{{ $t('btn.edit') }}
          </el-button>
          <el-button v-else link type="primary" icon="Edit" @click="handleSaveUpdate(scope.row)">{{ $t('btn.save') }}</el-button>

          <el-button link type="primary" icon="Edit" @click="dataTableConfig(scope.row)">{{ $t('btn.Table_configuration') }}</el-button>
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

    <!--Excel导入-->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px">
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">{{ $t('PublicVariable.Drag_files_tip') }}<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">

            <span>{{ $t('PublicVariable.importing_xls_tip') }}。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">{{ $t('btn.confirm') }}</el-button>
          <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--PDM导入-->
    <el-dialog :title="uploadPDM.title" v-model="uploadPDM.openPDM" width="400px">
      <el-upload
          ref="uploadPDMRef"
          :limit="1"
          accept=".pdm"
          :headers="uploadPDM.headers"
          :action="uploadPDM.url"
          :disabled="uploadPDM.isUploading"
          :on-progress="handlePDMFileUploadProgress"
          :on-success="handlePDMFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">{{ $t('PublicVariable.Drag_files_tip') }}<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">

            <span>{{ $t('PublicVariable.importing_PDM_tip') }}。</span>

          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitPDMFileForm">{{ $t('btn.confirm') }}</el-button>
          <el-button @click="uploadPDM.open = false">{{ $t('btn.cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {inject, reactive, onMounted} from 'vue';
import {getToken} from "@/utils/auth.js";
import {
  dataModelList, insertDataModelList, deleteDataModel
} from "@/api/configuration/configuration.js";
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
const route = useRoute();
const router = useRouter();
// 使用 inject 获取 DataNexus 提供的方法
const dataNexus = inject('dataNexus');
const loading = ref(true);
const ids = ref([]);
const selectData = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const open = ref(false);
const openPDM = ref(false);
const form = reactive({});
// 导入模型id
const importmodelid = ref("");
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dataModelName: '',
});

const dataList = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/dataModel/modelImport"
});
/*** 用户导入PDM参数 */
const uploadPDM = reactive({

  // 是否显示弹出层（用户导入）
  openPDM: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/pdm/upload/" + importmodelid.value
});
onMounted(() => {
  getList();
  dataNexus.subscribeToDataChange('dataModelChildren', 'dataModelName', dataModelNameDataUpdated);
  dataNexus.subscribeToDataChange('dataModelChildren', 'dataList', dataListUpdated);
});

const onSubmit = () => {
  console.log('submit!');
};

const handleDataModelChange = (newValue) => {
  dataNexus.updateSharedData('dataModelChildren', 'dataModelName', newValue);
  // dataNexus.sharedData.myPlugin.doSomething();
};


function dataModelNameDataUpdated(newValue) {
  queryParams.dataModelName = newValue;
}

function dataListUpdated(newValue) {
  dataList.value = newValue
}

/** 搜索按钮操作 */
function handleQuery() {
  // queryParams.value.pageNum = 1;
  getList();
}

/** 查询列表 */
function getList() {
  dataModelList(queryParams).then(response => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    dataList.value.forEach(item => {
      Reflect.set(item, 'status', false);
    })
  });
  dataNexus.updateSharedData('dataModelChildren', 'dataList', dataList.value);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dataModelId);
  selectData.value = selection
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  const lineData = {
    dataModelId: '',
    dataModelName: '',
    dataModelCode: '',
    dataModelRemark: '',
    dataTableCount: '',
    status: true,
  }
  dataList.value.unshift(lineData)
}

/** 取消按钮 */
function cancel() {
  open.value = false;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  row.status = true
}

/** 保存按钮操作 */
function handleSaveUpdate(row) {
  insertDataModelList(row).then(response => {
    row.status = false
    getList();
    proxy.$modal.msgSuccess("保存成功");
  });

}

/** 数据表配置 */
function dataTableConfig(row) {
  const dataModelId = row.dataModelId
  router.push({
    path: '/dataConfiguration/dataTable',
    query: {dataModelId}
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const id = ids.value;
  let showContent = ""
  const seleData = selectData.value
  let showNameList = seleData.filter(item => item.dataTableCount != '0').map(ele => {
    return ele.dataModelName
  }).join()
  if (showNameList == '') {
    showContent = "是否确认删除"
  } else {
    showContent = `${showNameList}已绑定了数据表，是否确认删除`
  }
  proxy.$modal.confirm(`${showContent}`).then(function () {
    return deleteDataModel(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导入Excel按钮操作 */
function handleImport() {
  upload.title = "模型导入";
  upload.open = true;
};

/** 导入PDM按钮操作 */
function handleImportPDM(row) {
  uploadPDM.title = "PDM导入";
  uploadPDM.openPDM = true;
  importmodelid.value = row.dataModelId
  uploadPDM.url = import.meta.env.VITE_APP_BASE_API + "/pdm/upload?modelId=" + importmodelid.value

};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("/dataModel/importTemplate", {}, `数据模型导入模板.xlsx`);
};

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/**文件PDM上传中处理 */
const handlePDMFileUploadProgress = (event, file, fileList) => {
  uploadPDM.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};
/** PDM文件上传成功处理 */
const handlePDMFileSuccess = (response, file, fileList) => {
  uploadPDM.openPDM = false;
  uploadPDM.isUploading = false;
  proxy.$refs["uploadPDMRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 提交上传PDM文件 */
function submitPDMFileForm() {
  proxy.$refs["uploadPDMRef"].submit();
};
</script>

<style>

</style>
