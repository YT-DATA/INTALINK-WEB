<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" >

      <el-form-item :label="$t('DataRelationEntry.Main_model')" prop="dataModelId" >
        <el-select
            v-model="queryParams.dataModelId"
            :placeholder="$t('PublicVariable.select_tip')"
            @change="handleModelValueChange"
            clearable
            filterable
        >
          <el-option
              v-for="item in optionsModel"
              :key="item.dataModelId"
              :label="item.dataModelCode"
              :value="item.dataModelId"
          />
        </el-select>
      </el-form-item >
      <el-form-item :label="$t('DataRelationEntry.Master_Data_Table')" prop="dataTableId">
        <el-select
            v-model="queryParams.dataTableId"
            :placeholder="$t('PublicVariable.select_tip')"
            @change="handleTableValueChange"
            clearable
            filterable
        >
          <el-option
              v-for="item in optionsTable"
              :key="item.dataTableId"
              :label="item.dataTableCode"
              :value="item.dataTableId"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('DataRelationEntry.Master_data_item')" prop="dataColumnId">
        <el-select
            v-model="queryParams.dataColumnId"
            :placeholder="$t('PublicVariable.select_tip')"
            @change="handleColumnValueChange"
            clearable
            filterable
        >
          <el-option
              v-for="item in optionsColumn"
              :key="item.dataColumnId"
              :label="item.dataColumnCode"
              :value="item.dataColumnId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
      </el-form-item>
      <el-form-item>
<!--        <el-checkbox v-model="checkAllSelect" label="高级搜索" size="large" />-->
        <el-button type="primary" icon="ArrowUp" plain v-if="!checkAllSelect"  @click="showAllSelect" class="btnHover">{{ $t('btn.Expand_all_search') }}</el-button>
        <el-button type="primary" icon="ArrowDown" plain v-else="checkAllSelect"  @click="showAllSelect">{{ $t('btn.hide') }}</el-button>
      </el-form-item>
      <el-row v-if="checkAllSelect">
        <el-form-item :label="$t('DataRelationEntry.Associative_mode')" prop="relationType">
          <el-select
              v-model="queryParams.relationType"
              :placeholder="$t('PublicVariable.select_tip')"
              @change="handleRelationStrValueChange"
              clearable
              filterable
          >
            <el-option
                v-for="item in optionsRelationStr"
                :key="item.relationType"
                :label="item.relationDescribe"
                :value="item.relationType"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('DataRelationEntry.Correlation_model')" prop="relationDataModelId">
          <el-select
              v-model="queryParams.relationDataModelId"
              :placeholder="$t('PublicVariable.select_tip')"
              @change="handleRelationModelValueChange"
              clearable
              filterable
          >
            <el-option
                v-for="item in optionsRelationModel"
                :key="item.relationDataModelId"
                :label="item.relationDataModelCode"
                :value="item.relationDataModelId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('DataRelationEntry.Associated_data_table')" prop="relationDataTableId">
          <el-select
              v-model="queryParams.relationDataTableId"
              :placeholder="$t('PublicVariable.select_tip')"
              @change="handleRelationTableValueChange"
              clearable
              filterable
          >
            <el-option
                v-for="item in optionsRelationTable"
                :key="item.relationDataTableId"
                :label="item.relationDataTableCode"
                :value="item.relationDataTableId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('DataRelationEntry.Associated_data_item')" prop="relationDataColumnId">
          <el-select
              v-model="queryParams.relationDataColumnId"
              :placeholder="$t('PublicVariable.select_tip')"
              @change="handleRelationColumnValueChange"
              clearable
              filterable
          >
            <el-option
                v-for="item in optionsRelationColumn"
                :key="item.relationDataColumnId"
                :label="item.relationDataColumnCode"
                :value="item.relationDataColumnId"
            />
          </el-select>
        </el-form-item>
      </el-row>



    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['dataRelationship:dataRelationEntry:add']"
        >{{ $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['dataRelationship:dataRelationEntry:remove']"
        >{{ $t('btn.batchDelete') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
            v-hasPermi="['dataRelationship:dataRelationEntry:import']"
        >{{ $t('btn.import') }}</el-button>
      </el-col>
    </el-row>
    <!-- 查询表格 -->
    <el-table v-loading="loading" :data="dataList" :empty-text="$t('PublicVariable.No_data_available')" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column :label="$t('DataRelationEntry.Master_data_item')" align="left" prop="dataModelTableColumn" >
        <template #default="{row}">
          <span>{{ row.dataModelTableColumn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('DataRelationEntry.Associated_data_item')" align="left" prop="relationDataModelTableColumn">
        <template #default="{row}">
          <span>{{ row.relationDataModelTableColumn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('DataRelationEntry.Associative_mode')" align="left" prop="relationId">
        <template #default="{row}">
          <span>{{ row.relationStr}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('columnManagement.operation')" width="180" align="left" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button  link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['dataRelationship:dataRelationEntry:edit']">{{ $t('btn.edit') }}
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

    <!-- 导入 -->
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" align-center>
      <el-row :gutter="10" class="mb8" v-if="!insertOrUpdate">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAddRow"
              v-hasPermi="['dataRelationship:dataRelationEntry:add']"
          >{{ $t('btn.add') }}</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="popupDataList" :empty-text="$t('PublicVariable.No_data_available')">
        <el-table-column :label="$t('DataRelationEntry.Main_model')" align="left" prop="dataModelId">
          <template #default="{row}">
            <el-select
                v-model="row.dataModelId"
                placeholder="Select"
                @change="popupModelValueChange(row, row.dataModelId)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsModel"
                  :key="item.dataModelId"
                  :label="item.dataModelCode"
                  :value="item.dataModelId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRelationEntry.Master_Data_Table')" align="left" prop="dataTableId">
          <template #default="{row}">
            <el-select
                v-model="row.dataTableId"
                placeholder="Select"
                @change="popupTableValueChange(row, row.dataTableId)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsTable"
                  :key="item.dataTableId"
                  :label="item.dataTableCode"
                  :value="item.dataTableId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRelationEntry.Master_data_item')" align="left" prop="dataColumnId">
          <template #default="{row}">
            <el-select
                v-model="row.dataColumnId"
                placeholder="Select"
                @change="popupColumnValueChange(row, row.dataColumnId)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsColumn"
                  :key="item.dataColumnId"
                  :label="item.dataColumnCode"
                  :value="item.dataColumnId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRelationEntry.Associative_mode')" align="left" prop="relationType" show-overflow-tooltip>
          <template #default="{row}">
            <el-select
                v-model="row.relationType"
                placeholder="Select"
                @change="popupRelationStrValueChange(row)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsRelationStr"
                  :key="item.relationType"
                  :label="item.relationStr"
                  :value="item.relationType"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRelationEntry.Correlation_model')" align="left" prop="relationDataModelId">
          <template #default="{row}">
            <el-select
                v-model="row.relationDataModelId"
                placeholder="Select"
                @change="popupRelationModelValueChange(row, row.relationDataModelId)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsRelationModel"
                  :key="item.relationDataModelId"
                  :label="item.relationDataModelCode"
                  :value="item.relationDataModelId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRelationEntry.Associated_data_table')" align="left" prop="relationDataTableId">
          <template #default="{row}">
            <el-select
                v-model="row.relationDataTableId"
                placeholder="Select"
                @change="popupRelationTableValueChange(row, row.relationDataTableId)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsRelationTable"
                  :key="item.relationDataTableId"
                  :label="item.relationDataTableCode"
                  :value="item.relationDataTableId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRelationEntry.Associated_data_item')" align="left" prop="relationDataColumnId">
          <template #default="{row}">
            <el-select
                v-model="row.relationDataColumnId"
                placeholder="Select"
                @change="popupRelationColumnValueChange(row, row.relationDataColumnId)"
                filterable
            >
              <el-option
                  v-for="item in row.optionsRelationColumn"
                  :key="item.relationDataColumnId"
                  :label="item.relationDataColumnCode"
                  :value="item.relationDataColumnId"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column :label="$t('columnManagement.operation')" v-if="!insertOrUpdate" width="80" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button  link type="primary" icon="Edit" @click="handleDeleteRow(scope.row)"
                       v-hasPermi="['dataRelationship:dataRelationEntry:edit']">{{ $t('btn.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSaveUpdate">{{ $t('btn.save') }}</el-button>
          <el-button @click="cancel">{{ $t('btn.cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script  setup name="DataRelationEntry">
import { inject, reactive, onMounted } from 'vue';
const { proxy } = getCurrentInstance();
import {getToken} from "@/utils/auth.js";
import {
  dataRelationshiplists,
  selectModelAll,
  selectAllByModelId,
  selectAllByTableId,
  selectTableRelation, deleteTableRelation, insertOrUpdateF
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
const open = ref(false);
const insertOrUpdate = ref(false);
const form = reactive({});
const checkAllSelect = ref(false)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  dataModelId: '',
  dataTableId: '',
  dataColumnId: '',
  relationType: '',
  relationDataModelId: '',
  relationDataTableId: '',
  relationDataColumnId: '',
});
const optionsModel = ref([])
const optionsTable = ref([])
const optionsColumn = ref([])
const optionsRelationStr = ref([])
const optionsRelationModel = ref([])
const optionsRelationTable = ref([])
const optionsRelationColumn = ref([])

const dataList = ref([]);
const popupDataList = ref([]);

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
  url: import.meta.env.VITE_APP_BASE_API + "/configoperations/dataColumn/columnImport"
});
onMounted(() => {
  getList();
  ModelSelectAll();
  selectTableRelationAll();
  dataNexus.subscribeToDataChange('dataRelationEntry', 'dataModelId', dataModelIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'dataTableId', dataTableIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'dataColumnId', dataColumnIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'relationType', relationIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'relationDataModelId', relationDataModelIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'relationDataTableId', relationDataTableIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'relationDataColumnId', relationDataColumnIdDataUpdated);
  dataNexus.subscribeToDataChange('dataRelationEntry', 'dataList', dataListUpdated);
});
// watch(() => popupDataList.value, (val) => {
//   console.log(val)
// }, {deep: true})
const onSubmit = () => {
  // console.log('submit!');
};

/** 搜索区域下拉列表 */
const handleModelValueChange = async (newValue) => {
  if(newValue){
    optionsTable.value =await ModelIdSelectAll(newValue)
  }else{
    optionsTable.value=[]
    queryParams.dataTableId=""
    optionsColumn.value=[]
    queryParams.dataColumnId=""
  }
  dataNexus.updateSharedData('dataRelationEntry', 'dataModelId', newValue);
};

const handleTableValueChange = async (newValue) => {
  if(newValue){
    optionsColumn.value =await TableIdSelectAll(newValue)
  }else{
    optionsColumn.value=[]
    queryParams.dataColumnId=""
  }

  dataNexus.updateSharedData('dataRelationEntry', 'dataTableId', newValue);
};

const handleColumnValueChange = (newValue) => {
  dataNexus.updateSharedData('dataRelationEntry', 'dataColumnId', newValue);
};

const handleRelationStrValueChange = (newValue) => {
  dataNexus.updateSharedData('dataRelationEntry', 'relationType', newValue);
};

const handleRelationModelValueChange = async (newValue) => {
  if(newValue){
    optionsRelationTable.value = await ModelIdSelectAll(newValue);
    optionsRelationTable.value.forEach(item => {
      Reflect.set(item, 'relationDataTableId', item.dataTableId);
      Reflect.set(item, 'relationDataTableCode', item.dataTableCode);
    });
  }else{
    optionsRelationTable.value=[]
    queryParams.relationDataTableId=""
    optionsRelationColumn.value=[]
    queryParams.relationDataColumnId=""
  }
  dataNexus.updateSharedData('dataRelationEntry', 'relationDataModelId', newValue);
};

const handleRelationTableValueChange = async (newValue) => {
  if(newValue){
    optionsRelationColumn.value = await TableIdSelectAll(newValue);
    optionsRelationColumn.value.forEach(item => {
      Reflect.set(item, 'relationDataColumnId', item.dataColumnId);
      Reflect.set(item, 'relationDataColumnCode', item.dataColumnCode);
    });
  }else{
    optionsRelationColumn.value=[]
    queryParams.relationDataColumnId=""
  }
  dataNexus.updateSharedData('dataRelationEntry', 'relationDataTableId', newValue);
};

const handleRelationColumnValueChange = (newValue) => {
  dataNexus.updateSharedData('dataRelationEntry', 'relationDataColumnId', newValue);
};

/** 弹窗区域下拉列表 */
const popupModelValueChange = async (row,newValue) => {
  if(newValue){
    row.optionsTable= await ModelIdSelectAll(newValue)
    row.dataTableId=""
    row.dataColumnId=""
    row.optionsColumn=[]
  }
};

const popupTableValueChange = async (row,newValue) => {
  if(newValue){
    row.optionsColumn= await TableIdSelectAll(newValue)
    row.dataColumnId=""
  }
};

const popupColumnValueChange = async (row,newValue) => {
  if(newValue){
    if(row.relationDataColumnId&&row.relationDataColumnId!=""){
      if(newValue==row.relationDataColumnId){
        proxy.$modal.msgError("重复数据");
        row.dataColumnId=""
      }
    }
  }
};

const popupRelationStrValueChange = (row,newValue) => {
  const selectedOption = row.optionsRelationStr.find(item => item.relationType == row.relationType);
  if (selectedOption) {
    // 更新 row.relationStr
    row.relationStr = selectedOption.relationStr;
  }
};

const popupRelationModelValueChange = async (row,newValue) => {
  console.log(row,newValue)
  if(newValue){
    row.optionsRelationTable= await ModelIdSelectAll(newValue)
    row.optionsRelationTable.forEach(item => {
      Reflect.set(item, 'relationDataTableId', item.dataTableId);
      Reflect.set(item, 'relationDataTableCode', item.dataTableCode);
    });
    row.relationDataTableId=""
    row.relationDataColumnId=""
    row.optionsRelationColumn=[]
  }
};

const popupRelationTableValueChange = async (row,newValue) => {
  if(newValue){
    row.optionsRelationColumn= await TableIdSelectAll(newValue)
    row.optionsRelationColumn.forEach(item => {
      Reflect.set(item, 'relationDataColumnId', item.dataColumnId);
      Reflect.set(item, 'relationDataColumnCode', item.dataColumnCode);
    });
    row.relationDataColumnId=""
  }
};


const popupRelationColumnValueChange = async (row,newValue) => {
  if(newValue){
    if(row.dataColumnId&&row.dataColumnId!=""){
      if(newValue==row.dataColumnId){
        proxy.$modal.msgError("重复数据");
        // proxy.$modal.msgError(proxy.$t('DataRelationEntry.incomplete_fields_tip'));
        row.relationDataColumnId=""
      }
    }
  }
};

function dataModelIdDataUpdated(newValue) {
  queryParams.dataModelId = newValue;
}

function dataTableIdDataUpdated(newValue) {
  queryParams.dataTableId = newValue;
}

function dataColumnIdDataUpdated(newValue) {
  queryParams.dataColumnId = newValue;
}

function relationIdDataUpdated(newValue) {
  queryParams.relationType = newValue;
}

function relationDataModelIdDataUpdated(newValue) {
  queryParams.relationDataModelId = newValue;
}

function relationDataTableIdDataUpdated(newValue) {
  queryParams.relationDataModelId = newValue;
}

function relationDataColumnIdDataUpdated(newValue) {
  queryParams.relationDataColumnId = newValue;
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
  let obj= {...queryParams}
  delete obj.pageNum
  delete obj.pageSize
  dataRelationshiplists(obj,'pageNum='+queryParams.pageNum+'&pageSize='+queryParams.pageSize).then(response => {
    // debugger
    dataList.value = response.rows;
    // console.log(dataList.value)
    total.value = response.total;
    loading.value = false;
    // dataList.value.forEach(item => {
    //   Reflect.set(item, 'status', false);
    // })
  });
  dataNexus.updateSharedData('dataRelationEntry', 'dataList', dataList.value);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dataTableRelationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  insertOrUpdate.value=false;
  open.value = true;
  title.value = proxy.$t('DataRelationEntry.Relationship_entry');
  popupDataList.value=[]
}

/** 取消按钮 */
function cancel() {
  open.value = false;

}

/** 修改按钮操作 */
async function handleUpdate(row) {
  // debugger
  open.value = true;
  title.value = proxy.$t('btn.edit');
  popupDataList.value=[]
  insertOrUpdate.value=true;
  const clonedRow = JSON.parse(JSON.stringify(row));
  // 确保每个项都具有 optionsModel 属性
  if (!clonedRow.optionsModel) {
    clonedRow.optionsModel = [];
  }

  popupDataList.value.push(clonedRow);
  //关联模型下拉选
  const optionsModelRV = JSON.parse(JSON.stringify(optionsModel.value));
  optionsModelRV.forEach(item => {
    Reflect.set(item, 'relationDataModelId', item.dataModelId);
    Reflect.set(item, 'relationDataModelCode', item.dataModelCode);
  });

  //关联方式
  const optionsRelationStrV = JSON.parse(JSON.stringify(optionsRelationStr.value))
  optionsRelationStrV.forEach(item => {
    Reflect.set(item, 'relationStr', item.relationDescribe);
    Reflect.set(item, 'relationType', item.relationId);
  });
  //主数据表
  const optionsTableV = await ModelIdSelectAll(row.dataModelId)
  //主数据项
  const optionsColumnV = await TableIdSelectAll(row.dataTableId)

  //关联数据表
  const optionsTableRV = await ModelIdSelectAll(row.relationDataModelId)
  optionsTableRV.forEach(item => {
    Reflect.set(item, 'relationDataTableCode', item.dataTableCode);
    Reflect.set(item, 'relationDataTableId', item.dataTableId);
  });
  //关联数据项
  const optionsColumnRV = await TableIdSelectAll(row.relationDataTableId)
  optionsColumnRV.forEach(item => {
    Reflect.set(item, 'relationDataColumnCode', item.dataColumnCode);
    Reflect.set(item, 'relationDataColumnId', item.dataColumnId);
  });

  // 将修改后的项添加到 popupDataList 中
  popupDataList.value.forEach(item => {
    Reflect.set(item, 'optionsModel', JSON.parse(JSON.stringify(optionsModel.value)));
    Reflect.set(item, 'optionsTable', optionsTableV);
    Reflect.set(item, 'optionsColumn', optionsColumnV);
    Reflect.set(item, 'optionsRelationStr', optionsRelationStrV);
    Reflect.set(item, 'optionsRelationModel', optionsModelRV);
    Reflect.set(item, 'optionsRelationTable', optionsTableRV);
    Reflect.set(item, 'optionsRelationColumn', optionsColumnRV);
  });
  console.log(popupDataList.value)


}

/** 保存按钮操作 */
function handleSaveUpdate() {
  let insertOrUpdateV = JSON.parse(JSON.stringify(!insertOrUpdate.value))
  // 将布尔值转换为字符串
  insertOrUpdateV = insertOrUpdateV.toString();
  insertOrUpdateF(popupDataList.value,'insertOrUpdate='+insertOrUpdateV).then(response => {
    getList();
    open.value = false;
  });
  // console.log(popupDataList.value)
}

/** 批量删除按钮操作 */
function handleDelete(row) {
  const id = ids.value;
  proxy.$modal.confirm(proxy.$t('PublicVariable.Delete_operation_tip')).then(function () {
    return deleteTableRelation(id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess(proxy.$t('PublicVariable.Delete_successful_tip'));
  }).catch(() => {
  });
}

/** 新增信息录入表格内行数据 */
function handleAddRow(){
  const optionsModelRow = JSON.parse(JSON.stringify(optionsModel.value));
  const optionsModelRRow = JSON.parse(JSON.stringify(optionsModel.value));
  optionsModelRRow.forEach(item => {
    Reflect.set(item, 'relationDataModelId', item.dataModelId);
    Reflect.set(item, 'relationDataModelCode', item.dataModelCode);
  });
  const optionsRelationStrRow = JSON.parse(JSON.stringify(optionsRelationStr.value))
  optionsRelationStrRow.forEach(item => {
    Reflect.set(item, 'relationStr', item.relationDescribe);
    Reflect.set(item, 'relationType', item.relationId);
  });
  const newRow = {
    optionsModel:optionsModelRow,
    optionsRelationModel:optionsModelRRow,
    optionsRelationStr:optionsRelationStrRow,
  }
  if(popupDataList.value.length==0){
    popupDataList.value.push(newRow)
  }else{
    popupDataList.value.forEach(item => {
      if (item.dataColumnId&&item.dataColumnId!=""&&item.relationDataColumnId&&item.relationDataColumnId!=""&&item.relationType&&item.relationType!=""){
        if(item.dataColumnId!=item.relationDataColumnId){
          popupDataList.value.push(newRow)
        }else{
          return
        }
      }else{
        proxy.$modal.msgError(proxy.$t('DataRelationEntry.incomplete_fields_tip'));
        return
      }
    });
  }
  // popupDataList.value.push(newRow)
  console.log(popupDataList.value)
}

/** 新增信息录入表格内行数据删除操作 */
function handleDeleteRow(row){
  const index = popupDataList.value.indexOf(row);
  if (index !== -1) {
    popupDataList.value.splice(index, 1);
  }
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
  upload.title = proxy.$t('DataRelationEntry.Data_relation_import');
  // upload.open = true;

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


/** 查询所有模型列表 */
function ModelSelectAll() {
  selectModelAll().then(response => {
    optionsModel.value = JSON.parse(JSON.stringify(response.data));
    const optionsRelationValue = JSON.parse(JSON.stringify(response.data));
    optionsRelationValue.forEach(item => {
      Reflect.set(item, 'relationDataModelId', item.dataModelId);
      Reflect.set(item, 'relationDataModelCode', item.dataModelCode);
    });
    optionsRelationModel.value = optionsRelationValue;
    // console.log(optionsModel.value,optionsRelationModel.value)
  });

}

/** 查询关联关系下拉列表 */
function selectTableRelationAll() {
  selectTableRelation().then(response => {
    optionsRelationStr.value = JSON.parse(JSON.stringify(response.data));
    optionsRelationStr.forEach(item => {
      Reflect.set(item, 'relationType', item.relationId);
    });
  });
}

/** 根据id查询主数据表下拉列表 */
async function ModelIdSelectAll(dataModelId) {

  let ModelIdValue= await selectAllByModelId('dataModelId='+dataModelId).then(response => {
    // optionsTable.value = JSON.parse(JSON.stringify(response.data));

   return JSON.parse(JSON.stringify(response.data))
  });
  return ModelIdValue
}

/** 根据表id查询主数据项下拉列表 */
async function TableIdSelectAll(dataTableId) {

  let TableIdValue= await selectAllByTableId('dataTableId='+dataTableId).then(response => {

    return JSON.parse(JSON.stringify(response.data))
  });
  return TableIdValue
}

// /** 根据id查询关联数据表下拉列表 */
// function RelationModelIdSelectAll(dataModelId) {
//   selectAllByModelId('dataModelId='+dataModelId).then(response => {
//     optionsRelationTable.value = JSON.parse(JSON.stringify(response.data));
//     optionsRelationTable.value.forEach(item => {
//       Reflect.set(item, 'relationDataTableId', item.dataTableId);
//       Reflect.set(item, 'relationDataTableCode', item.dataTableCode);
//     });
//   });
// }

// /** 根据表id查询关联数据项下拉列表 */
// function RelationTableIdSelectAll(dataColumnId) {
//   selectAllByTableId('dataColumnId='+dataColumnId).then(response => {
//     optionsRelationColumn.value = JSON.parse(JSON.stringify(response.data));
//     optionsRelationColumn.value.forEach(item => {
//       Reflect.set(item, 'relationDataColumnId', item.dataColumnId);
//       Reflect.set(item, 'relationDataColumnCode', item.dataColumnCode);
//     });
//   });
// }

/** 弹窗内 */

function showAllSelect(){
  checkAllSelect.value=!checkAllSelect.value
}
</script>

<style>
.btnHover:hover{
  color: rgb(26,104,242) !important;
  background-color: rgb(233,239,253) !important;
}
</style>
