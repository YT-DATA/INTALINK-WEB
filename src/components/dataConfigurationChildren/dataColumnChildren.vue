<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="所属模型" prop="dataModelId">
        <el-select
            v-model="queryParams.dataModelId"
            placeholder="请选择所属模型"
            :teleported="false"
            @change="handleModelValueChange"
            clearable
        >
          <el-option
              v-for="item in optionsModel"
              :key="item.dataModelId"
              :label="item.dataModelName"
              :value="item.dataModelId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属数据表" prop="dataTableId">
        <el-select
            v-model="queryParams.dataTableId"
            placeholder="请选择所属数据表"
            @change="handleTableValueChange"
            clearable
            :teleported="false"
        >
          <el-option
              v-for="item in optionsTable"
              :key="item.dataTableId"
              :label="item.dataTableName"
              :value="item.dataTableId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据项名称" prop="dataColumnName">
        <el-input
            v-model="queryParams.dataColumnName"
            placeholder="请输入数据项名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
            @change="handleDataColumnChange"
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
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
        >导入
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="数据项名称" align="left" prop="dataColumnName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataColumnName"></el-input>
          <span v-else>{{ row.dataColumnName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据项编码" align="left" prop="dataColumnCode">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataColumnCode"></el-input>
          <span v-else>{{ row.dataColumnCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据项描述" align="left" prop="dataColumnRemark">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataColumnRemark"></el-input>
          <span v-else>{{ row.dataColumnRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据模型名称" align="left" prop="dataModelName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataModelName"></el-input>
          <span v-else>{{ row.dataModelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据表名称" align="left" prop="dataTableName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.dataTableName"></el-input>
          <span v-else>{{ row.dataTableName }}</span>
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


    <el-dialog :title="upload.title" v-model="upload.open" width="400px">
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import {inject, reactive, onMounted} from 'vue';
import {
  dataColumnList,
  deleteDataColumn,
  insertDataColumnList,
  dataModelSelectAll,
  selectAllByModelId
} from "@/api/configuration/configuration.js";

const {proxy} = getCurrentInstance();
import {getToken} from "@/utils/auth.js";
import {ElMessage} from "element-plus";

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

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dataColumnName: undefined,
  dataModelId: undefined,
  dataTableId: undefined,
});
const optionsModel = ref([])
const optionsTable = ref([])

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
  url: import.meta.env.VITE_APP_BASE_API + "/dataColumn/columnImport"
});
onMounted(() => {
  getList();
  ModelSelectAll();
  dataNexus.subscribeToDataChange('dataColumnChildren', 'dataColumnName', dataColumnNameDataUpdated);
  dataNexus.subscribeToDataChange('dataColumnChildren', 'dataModelId', dataModelIdDataUpdated);
  dataNexus.subscribeToDataChange('dataColumnChildren', 'dataTableId', dataTableIdDataUpdated);
  dataNexus.subscribeToDataChange('dataColumnChildren', 'dataList', dataListUpdated);
});
watch(
    () => route.query,
    async () => {

      if (route.query.dataModelId && route.query.dataTableId) {
        queryParams.dataModelId = Number(route.query.dataModelId)
        queryParams.dataTableId = Number(route.query.dataTableId)
        ModelIdSelectAll(route.query.dataModelId)
        await getList()
      }
    },
    {immediate: true, deep: true}
)
const onSubmit = () => {
  console.log('submit!');
};

const handleModelValueChange = (newValue) => {
  if (newValue) {
    ModelIdSelectAll(newValue)
  }

  dataNexus.updateSharedData('dataColumnChildren', 'dataModelId', newValue);
};
const handleTableValueChange = (newValue) => {
  dataNexus.updateSharedData('dataColumnChildren', 'dataTableId', newValue);
};

const handleDataColumnChange = (newValue) => {
  dataNexus.updateSharedData('dataColumnChildren', 'dataColumnName', newValue);
};


function dataColumnNameDataUpdated(newValue) {
  queryParams.dataColumnName = newValue;
}

function dataModelIdDataUpdated(newValue) {
  queryParams.dataModelId = newValue;
}

function dataTableIdDataUpdated(newValue) {
  queryParams.dataTableId = newValue;
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
  dataColumnList(queryParams).then(response => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    dataList.value.forEach(item => {
      Reflect.set(item, 'status', false);
    })
  });
  dataNexus.updateSharedData('dataColumnChildren', 'dataList', dataList.value);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dataColumnId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 新增按钮操作 */
function handleAdd() {
  const lineData = {
    dataColumnId: '',
    dataColumnName: undefined,
    dataColumnCode: '',
    dataColumnRemark: '',
    dataModelName: '',
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
  insertDataColumnList(row).then(response => {
    row.status = false
    getList();
    proxy.$modal.msgSuccess("保存成功");
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const id = ids.value;
  proxy.$modal.confirm('是否确认删除？').then(function () {
    return deleteDataColumn(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}


/** 导入按钮操作 */
function handleImport() {
  if (!queryParams.dataModelId) {
    proxy.$modal.msgError("请先选择所属模型");
    return
  }
  if (!queryParams.dataTableId) {
    proxy.$modal.msgError("请先选择所属数据表");
    return;
  }
  upload.title = "数据项导入";
  upload.open = true;

};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("/dataColumn/importTemplate", {}, `数据项导入模板.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};


/** 查询所有模型列表 */
function ModelSelectAll() {
  dataModelSelectAll().then(response => {
    optionsModel.value = response.data;

  });
}

/** 根据id查询数据表下拉列表 */
function ModelIdSelectAll(ModelId) {
  selectAllByModelId(ModelId).then(response => {
    optionsTable.value = response.data;

  });
}
</script>

<style>

</style>
