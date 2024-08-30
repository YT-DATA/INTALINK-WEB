<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item :label="$t('scorePlanManage.scheme_name')" prop="scoringSchemeName">
        <el-input
            v-model="queryParams.scoringSchemeName"
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
            v-hasPermi="['dataConfiguration:scorePlanManage:add']"
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
            v-hasPermi="['dataConfiguration:scorePlanManage:remove']"
        >{{ $t('btn.batchDelete') }}
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" :empty-text="$t('PublicVariable.No_data_available')">
      <el-table-column type="selection" width="55" align="left"/>
      <el-table-column type="index" :label="$t('menuManage.sort')" width="425" align="left">
        <template #default="scope">
          <span v-text="getIndex(scope.$index)"></span>
        </template>

      </el-table-column>
      <el-table-column :label="$t('scorePlanManage.scheme_name')" width="350" align="left" prop="scoringSchemeName">
        <template #default="{row}">
          <el-input v-if="row.status" v-model="row.scoringSchemeName"></el-input>
          <span v-else>{{ row.scoringSchemeName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('columnManagement.operation')"  align="center"
                       class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['dataConfiguration:scorePlanManage:edit']">{{ $t('btn.edit') }}
          </el-button>
          <el-button link type="primary" icon="Setting" @click="handleConfig(scope.row)"
                     v-hasPermi="['dataConfiguration:scorePlanManage:edit']">{{ $t('scorePlanManage.Configuration_scheme') }}
          </el-button>
          <el-button link type="primary" icon="View" @click="handleDetails(scope.row)"
                     v-hasPermi="['dataConfiguration:scorePlanManage:edit']">{{ $t('btn.detailed') }}
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

    <!-- 添加或修改方案名称对话框 -->
    <el-dialog :title="title" v-model="open" width="500px">
      <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForms"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item :label="$t('scorePlanManage.scheme_name')" prop="name">
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
    <!-- 配置或查看配置方案对话框 -->
    <el-dialog :title="title" v-model="open1" width="600px">
      <el-row :gutter="10" class="mb8" v-if="!insertOrUpdate">
        <el-col :span="1.5">
          <el-button
              type="primary"
              v-if="!details"
              plain
              icon="Plus"
              @click="planAdd"
              v-hasPermi="['dataConfiguration:scorePlanManage:add']"
          >{{ $t('btn.add') }}
          </el-button>
          <span>   {{ $t('scorePlanManage.Total_weight') }}：{{ countWeight }}</span>
        </el-col>
      </el-row>
      <el-table :data="dataList2" :empty-text="$t('PublicVariable.No_data_available')">
        <el-table-column prop="scoringSchemeName" :label="$t('scoreMethodManage.methodName')" align="left" width="300">
          <template #default="{row}">
            <el-select v-if="!details"
                       v-model="row.evaluationMethodId"
                       size="small"
                       @change="evaluationMethodValueChange(row, row.evaluationMethodId)"
                       clearable
                       filterable>
              <el-option v-for="item in row.optionsMethod"
                         :key="item.evaluationMethodId"
                         :label="item.evaluationMethodName"
                         :value="item.evaluationMethodId"
                         :disabled="item.disabled"
              />
            </el-select>
            <span v-else>{{ row.evaluationMethodName }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="weightCoefficient" :label="$t('scorePlanManage.weight')" align="center">
          <template #default="scope">
            <el-input v-model.number="scope.row.weightCoefficient"
                      type="number" oninput="if(!/^([1-9]|[1-9][0-9]|100)$/.test(value)){value = value.slice(0, -1)}"
                      v-if="!details"
                      size="small"
                      placeholder="1-100"
            ></el-input>
            <span v-else>{{ scope.row.weightCoefficient }} </span>

          </template>
        </el-table-column>
        <el-table-column
            v-if="!details" :label="$t('columnManagement.operation')" align="center" fixed="right" width="150">
          <template #default="scope">
            <el-button @click="deleteTableData(scope.row)" link icon="Delete" type="primary">{{ $t('btn.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="!details" @click="cancel">{{ $t('btn.cancel') }}</el-button>
          <el-button type="primary" v-if="!details" @click="submitFormList">{{ $t('btn.save') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="scorePlanManage">
import {inject, reactive, onMounted, computed} from 'vue';
import {deleteDataColumn, insertDataColumnList} from "@/api/configuration/configuration.js";

const {proxy} = getCurrentInstance();
import {getToken} from "@/utils/auth.js";
import {
  deleteTableRelationScheme,
  insertOrUpdateMethods,
  insertOrUpdateScheme, insertOrUpdateSchemeMethod,
  schemeLists, scoringSchemeById, selectMethodAll, selectModelAll
} from "@/api/relationship/relationship.js";

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
const scoringSchemeIdG = ref("");
const open = ref(false);
const open1 = ref(false);
const details = ref(false);

const isModify = ref(false);
const form = reactive({});
const ruleForm = reactive({
  id: '',
  name: undefined,
  edit: false
});
const rules = reactive({

  name: [
    {required: true, message: '请输入方法名称', trigger: 'blur'},
  ]
})


const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  scoringSchemeName: undefined
});
const newRow = reactive({
  evaluationMethodId: null,
  weightCoefficient: null,
  optionsMethod: [],
})
const newRowCopy = reactive({})
const newSelectValue = ref('')
const optionsModel = ref([])
const optionsTable = ref([])

const dataList = ref([]);
const dataList2 = ref([]);

const countWeight = computed(() => {
  let count = 0
  // try {
  // console.log(dataList2.value);
  dataList2.value.forEach((value, index, array) => {
    count += value.weightCoefficient
  })

  return count
  // } catch (error) {
  //   return count

  // }
})

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
  url: import.meta.env.VITE_APP_BASE_API + "/configoperations/scorePlanManage/columnImport"
});
onMounted(() => {
  getList();
  getSelectAll();
  dataNexus.subscribeToDataChange('scorePlanManage', 'scoringSchemeName', scoringSchemeNameDataUpdated);
  dataNexus.subscribeToDataChange('scorePlanManage', 'dataList', dataListUpdated);
  dataNexus.subscribeToDataChange('scorePlanManage', 'dataList2', dataList2Updated);
});


function scoringSchemeNameDataUpdated(newValue) {
  queryParams.scoringSchemeName = newValue;
}

function dataListUpdated(newValue) {
  dataList.value = newValue
}

function dataList2Updated(newValue) {
  dataList2.value = newValue
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

/** 查询列表 */
function getList() {
  loading.value = true;
  schemeLists(queryParams).then(response => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    dataList.value.forEach(item => {
      Reflect.set(item, 'status', false);
    })
  });
  dataNexus.updateSharedData('scorePlanManage', 'dataList', dataList.value);
}

function getIndex(index) {
  //获取表格序号
  return (queryParams.pageNum - 1) * queryParams.pageSize + index + 1
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.scoringSchemeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 新增按钮操作 */
// function handleAdd() {
//   const lineData = {
//     dataColumnId: '',
//     dataColumnName: undefined,
//     dataColumnCode: '',
//     dataColumnRemark: '',
//     dataModelName: '',
//     status: true,
//   }
//   dataList.value.unshift(lineData)
// }
/** 新增按钮操作 */
function handleAdd() {
  ruleForm.name = ''
  ruleForm.id = ''
  ruleForm.edit = false
  open.value = true;
  title.value = proxy.$t('btn.add');
}

function getSelectAll() {
  selectMethodAll().then(response => {
    newRow.optionsMethod = JSON.parse(JSON.stringify(response.data))
  });
}

function planAdd() {
  // debugger
  const rows = JSON.parse(JSON.stringify(newRow))
  if (dataList2.value.length == 0) {
    dataList2.value.push(rows)
  } else {
    // if (dataList2.value[dataList2.value.length - 1].evaluationMethodId &&
    //     dataList2.value[dataList2.value.length - 1].evaluationMethodId != null &&
    //     dataList2.value[dataList2.value.length - 1].weightCoefficient &&
    //     dataList2.value[dataList2.value.length - 1].weightCoefficient != null) {
    //   dataList2.value.push(rows)
    // }
    // console.log(dataList2.value,'dataList2.value')
    if (dataList2.value.some(item => !item.evaluationMethodId || !item.weightCoefficient)) {
      // 如果存在 evaluationMethodId 为空的对象，则不执行
      proxy.$modal.msgError(proxy.$t('DataRelationEntry.incomplete_fields_tip'));
      return
    }
    else {
      // proxy.$modal.msgError(proxy.$t('DataRelationEntry.incomplete_fields_tip'));
      // return
      dataList2.value.push(rows)
    }
  }
}

//禁用最新选择
function newSelectVl() {
  dataList2.value.forEach(item => {
    // console.log(item,'itemm')
    if(item.evaluationMethodId!=newSelectValue.value){
      item.optionsMethod.forEach(item =>{
        if (item.evaluationMethodId==newSelectValue.value){
          Reflect.set(item, 'disabled', true);
        }
      })
    }
  });
}

// 删除
const deleteTableData = (row) => {
  const index = dataList2.value.indexOf(row);
  if (index !== -1) {
    dataList2.value.splice(index, 1);
  }
  newSelectVl()
}

/** 确定方案名称 */
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
        scoringSchemeId: ruleForm.id,
        scoringSchemeName: ruleForm.name
      }
      insertOrUpdateScheme(param, 'insertOrUpdate=' + insertOrUpdate).then(response => {

        getList();
      });
      open.value = false;
    } else {
      console.log('error submit!!')
      return false
    }
  })

}

/** 保存配置方法 */
function submitFormList(){
  if (countWeight.value>100||countWeight.value<100){
    proxy.$modal.msgError(proxy.$t('scorePlanManage.incomplete_fields_tip'));
    return
  }
  if (dataList2.value.some(item => !item.evaluationMethodId)) {
    // 如果存在 evaluationMethodId 为空的对象，则不执行
    proxy.$modal.msgError(proxy.$t('DataRelationEntry.incomplete_fields_tip'));
    return
  } else {
    insertOrUpdateSchemeMethod(dataList2.value, 'scoringSchemeId=' + scoringSchemeIdG.value).then(response => {
      getList();
      open1.value = false;
    });
  }

  }


/** 取消按钮 */
function cancel() {
  open.value = false;
  open1.value = false;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  ruleForm.name = row.scoringSchemeName
  ruleForm.id = row.scoringSchemeId
  ruleForm.edit = true
  // console.log(ruleForm.name );
  open.value = true;
  title.value = proxy.$t('btn.edit');
  isModify.value = true;
}

async  function handleConfig(row) {
  open1.value = true;
  title.value = proxy.$t('scorePlanManage.Configuration_scheme');
  details.value = false
  dataList2.value = []
  scoringSchemeIdG.value = ""
  scoringSchemeIdG.value = row.scoringSchemeId
  await scoringSchemeById('scoringSchemeId=' + scoringSchemeIdG.value).then(response => {
    dataList2.value = response.data;
  });
  let newRowList = JSON.parse(JSON.stringify(newRow.optionsMethod))
  dataList2.value.forEach(item => {
    Reflect.set(item, 'optionsMethod', newRowList);
  });
}

function handleDetails(row) {
  open1.value = true;
  title.value = proxy.$t('btn.detailed');
  details.value = true
  dataList2.value = []
  let scoringSchemeIdV = row.scoringSchemeId
  scoringSchemeById('scoringSchemeId=' + scoringSchemeIdV).then(response => {
    dataList2.value = response.data;
  });
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
  const id =ids.value.toString() ;
  let sureOrNot=false;
  let params={
    sureOrNot:sureOrNot,
    scoringSchemeIds:id
  }
  proxy.$modal.confirm(proxy.$t('PublicVariable.Delete_operation_tip')).then(function () {
    deleteTableRelationScheme('sureOrNot='+sureOrNot+'&scoringSchemeIds='+id).then(res=>{
      console.log(res)
      if(res.code!==200){
        proxy.$modal.confirm(res.msg).then(function (){
        }).then(() => {
          sureOrNot=true;
          deleteTableRelationScheme('sureOrNot='+sureOrNot+'&scoringSchemeIds='+id).then(res=>{
            proxy.$modal.msgSuccess(proxy.$t('PublicVariable.Delete_successful_tip'));
            getList();
          })

        }).catch(() => {
        });
      }else{
        getList();
        proxy.$modal.msgSuccess(proxy.$t('PublicVariable.Delete_successful_tip'));
      }
    }).catch((err) => {
      console.log(err);
  });

  }).then(() => {
    // getList();
    // proxy.$modal.msgSuccess(proxy.$t('PublicVariable.Delete_successful_tip'));
  }).catch(() => {
  });
}

function evaluationMethodValueChange(row, newValue) {
  //
  newSelectValue.value = newValue

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
  proxy.download("configoperations/dataColumn/importTemplate", {}, `数据项导入模板.xlsx`);
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


</script>

<style>

</style>
