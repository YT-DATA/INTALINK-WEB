<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item :label="$t('scoreMethodManage.methodName')" prop="dataModelId">
        <el-input
            v-model="queryParams.evaluationMethodName"
            :placeholder="$t('PublicVariable.enter_tip')"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
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
            v-hasPermi="['dataConfiguration::add']"
        >{{ $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['dataConfiguration::remove']"
        >{{ $t('btn.batchDelete') }}</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" :empty-text="$t('PublicVariable.No_data_available')">
      <el-table-column type="selection" width="70" align="center"/>
      <el-table-column type="index" align="center" :label="$t('departmentManage.sort')"  >
        <template #default="scope">
          <span v-text="getIndex(scope.$index)"></span>
        </template>
      </el-table-column>
      <el-table-column  :label="$t('scoreMethodManage.methodName')" align="center" prop="evaluationMethodName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.evaluationMethodName"></el-input>
          <span v-else>{{ row.evaluationMethodName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('columnManagement.operation')" width="150" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['dataConfiguration:scoreMethodManage:edit']">{{ $t('btn.edit') }}
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForms"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('scoreMethodManage.methodName')" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('btn.save') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script  setup name="scoreMethodManage">
import { inject, reactive, onMounted } from 'vue';
import { insertDataColumnList,selectAllByModelId} from "@/api/configuration/configuration.js";
import {
  methodsLists,
  insertOrUpdateMethods,
  deleteTableRelation,
  deleteTableRelationMethod
} from "@/api/relationship/relationship.js";
const { proxy } = getCurrentInstance();
import {getToken} from "@/utils/auth.js";
const route = useRoute();
const router = useRouter();
// 使用 inject 获取 DataNexus 提供的方法
const dataNexus = inject('dataNexus');
const loading = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const open = ref(false);
const isModify = ref(false);
const form = reactive({});
const ruleForm = reactive({
  id:'',
  name:undefined,
  edit:false
});
const rules = reactive({
  
  name: [
    { required: true, message: '请输入方法名称', trigger: 'blur' },
  ]
})


const queryParams = reactive({
  pageNum: 1,
  evaluationMethodName: '',
  pageSize: 10
});
const optionsModel = ref([])
const optionsTable = ref([])

const dataList = ref([1]);
const dataList2 = ref([]);

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
  url: import.meta.env.VITE_APP_BASE_API + "/configoperations//columnImport"
});
onMounted(() => {
  getList();
  dataNexus.subscribeToDataChange('scoreMethodManage', 'evaluationMethodName', evaluationMethodNameDataUpdated);
  dataNexus.subscribeToDataChange('scoreMethodManage', 'dataList', dataListUpdated);
});
watch(
    () => route.query,
    async () => {

      if (route.query.dataModelId && route.query.dataTableId) {
        queryParams.dataModelId = Number(route.query.dataModelId)
        queryParams.dataTableId = Number(route.query.dataTableId)
        await getList()
      }
    },
    {immediate: true, deep: true}
)


function evaluationMethodNameDataUpdated(newValue) {
  queryParams.evaluationMethodName = newValue;
}

function dataListUpdated(newValue) {
  dataList.value = newValue
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

function getIndex(index) {
   //获取表格序号
      return (queryParams.pageNum - 1) * queryParams.pageSize + index + 1
}

/** 查询列表 */
function getList() {
  loading.value = true;
  console.log(queryParams);
  methodsLists(queryParams).then(response => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    dataList.value.forEach(item => {
      Reflect.set(item, 'status', false);
    })
  });
  dataNexus.updateSharedData('scoreMethodManage', 'dataList', dataList.value);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.evaluationMethodId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 新增按钮操作 */
function handleAdd() {

  ruleForm.name = ''
  ruleForm.id = ''
  ruleForm.edit = false
  open.value = true;
  title.value = proxy.$t('btn.add');
}

/** 确定 */
function submitForm() {
  proxy.$refs['ruleForms'].validate((valid) => {
    let insertOrUpdate = true
    if (ruleForm.edit) {
      insertOrUpdate = false
    } else {
      insertOrUpdate = true
    }
    if (valid) {
      let param = {
        evaluationMethodId:ruleForm.id,
        evaluationMethodName:ruleForm.name
      }
      insertOrUpdateMethods(param,'insertOrUpdate='+insertOrUpdate).then(response => {

        getList();
      });
      

      open.value = false;
    } else {
      console.log('error submit!!')
      return false
    }
  })

}

/** 取消按钮 */
function cancel() {
  open.value = false;

}

/** 修改按钮操作 */
function handleUpdate(row) {
  // console.log(ruleForm.name );
  // console.log(row.evaluationMethodName);
  ruleForm.name = row.evaluationMethodName
  ruleForm.id = row.evaluationMethodId
  ruleForm.edit = true
  // console.log(ruleForm.name );
  open.value = true;
  dataList2.value=[{}]
  title.value = proxy.$t('btn.edit');
  isModify.value=true;
}

/** 保存按钮操作 */
function handleSaveUpdate(row) {
  insertDataColumnList(row).then(response => {
    row.status = false
    getList();
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const id = ids.value;
  proxy.$modal.confirm(proxy.$t('PublicVariable.Delete_operation_tip')).then(function () {
    return deleteTableRelationMethod(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess(proxy.$t('PublicVariable.Delete_successful_tip'));
  }).catch(() => {
  });
}


/** 导入按钮操作 */
function handleImport() {
  // if (!queryParams.dataModelId) {
  //   proxy.$modal.msgError("请选择所属模型");
  //   return
  // }
  // if (!queryParams.dataTableId) {
  //   proxy.$modal.msgError("请选择所属数据表");
  //   return;
  // }
  upload.title = "数据关系导入";
  upload.open = true;

};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("configoperations/scoreMethodManage/importTemplate", {}, `数据项导入模板.xlsx`);
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


/** 根据id查询数据表下拉列表 */
function ModelIdSelectAll(ModelId) {
  selectAllByModelId(ModelId).then(response => {
    optionsTable.value = response.data;

  });
}

</script>

<style>

</style>
