<template>
  <section class="association-query">
    <el-row :gutter="20" class="association-query-section">
      <!--左侧树数据-->
      <el-col :span="4" :xs="24" class="left-section">
        <div class="head-container">
          <el-input
              v-model="searchName"
              :placeholder="$t('PublicVariable.enter_tip')"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container head-container-tree">
          <el-tree
              :data="treeOptions"
              :props="lazyProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :load="loadNode"
              lazy
              ref="ModelTreeRef"
              node-key="id"
              highlight-current
              @node-click="handleNodeClick"
              multiple
              show-checkbox
              :render-after-expand="false"
              @check="handleNodeCheck"
              @node-expand="handleNodeExpand"
              style="height: 100%"
              :empty-text="$t('PublicVariable.No_data_available')"
          >
            <template v-slot="{node}">
              <span :title="node.label" class="node-label">{{ node.label }}</span>
            </template>
          </el-tree>
        </div>
        <section class="collapse-section">
          <el-collapse v-model="activeName" class="collapse-container" accordion>
            <el-collapse-item :title="collapseTitle" name="1">
              <el-tag type="primary" class="active-tag" v-for="item in treeSelectArr" :key="item.dataModelId">
                {{ item.label || item.code }}
              </el-tag>
            </el-collapse-item>
          </el-collapse>
        </section>
        <div class="button-container">
          <el-button type="primary" style="width: 100%" @click="queryList">{{ $t('btn.search2') }}</el-button>
        </div>
      </el-col>
      <!--右侧表格-->
      <el-col :span="20" :xs="24" class="right-section">
        <el-table :data="tableData" v-if="tableData.length" :empty-text="$t('PublicVariable.No_data_available')">
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column :label="item.name" :align="item.name=='销售金额'?'right':'left'" :key="index" :prop="item.title"
                           v-for="(item,index) in tableHeader"></el-table-column>
        </el-table>
        <pagination
            v-if="tableData.length"
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
        <div class="empty" v-else>
          <el-empty :image-size="200" :image="emptyImage" style="margin-top: 20vh"
                    :description="$t('PublicVariable.No_data_available')"/>
          <!--          <el-empty :image-size="200" :image="require('@/assets/images/empty.png')" style="margin-top: 20vh"/>-->
          <p class="empty-text">
            {{ $t('dataRelationalApp.dataRelational_tip') }}。</p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script setup name="associationQuery">
import {getItemTreeApi, getModelTreeApi, getSheetTreeApi} from "@/api/relationalApp/relationslApp.js";
import mockData from '@/mock/dataRelationalApp/index'
import {onMounted} from "vue";
import i18n from "@/lang/index"

const {proxy} = getCurrentInstance();
const emptyImage = ref(new URL("@/assets/images/empty.png", import.meta.url).href)
const activeName = ref('0')
const searchName = ref("");
const collapseTitle = computed(() => {
  if (treeSelectArr.value.length > 0) {
    return i18n.global.t('columnManagement.Data_Item_Selected_Tip') + treeSelectArr.value.length
  } else {
    return i18n.global.t('columnManagement.Data_Item_Select_Tip')
  }
})
const lazyProps = reactive({label: 'label' || 'code', children: 'children', isLeaf: 'leaf'})
const treeOptions = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
});
const total = ref(0);
const tableData = ref([]);
const tableHeader = ref([]);
const treeSelectArr = ref([]);

const {queryParams, form} = toRefs(data);

/* 表格假数据 */
const initTableData = () => {
  tableData.value = mockData.rows;
  total.value = mockData.total;
  tableHeader.value = mockData.headers;
}

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  if (data.label) {
    return data.label.indexOf(value) !== -1;
  }
  return data.code.indexOf(value) !== -1;
};

/** 根据名称筛选部门树 */
watch(searchName, val => {
  proxy.$refs["ModelTreeRef"].filter(val);
});

/** 节点单击事件 */
function handleNodeClick(data) {

};

// 复选框选中数据
function handleNodeCheck(data, checkedKeys) {
  // 在此处可以拿到当前选中的全部对象
  treeSelectArr.value = []
  // 判断是否为数据项
  if (checkedKeys.checkedNodes) {
    checkedKeys.checkedNodes.forEach(item => {
      if (item.dataColumnId) {
        treeSelectArr.value.push(item)
      }
    })
  }
};

const handleNodeExpand = (data, node, self) => {

}

/** 树结构懒加载方法 */
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    resolve(node.data)
  }
  if (node.level === 1) {
    getSheetTree(node.data.dataModelId).then(result => {
      resolve(result)
    }).catch(err => {
      resolve([])
    })
  }
  if (node.level === 2) {
    getItemTree(node.data.dataTableId).then(result => {
      resolve(result)
    }).catch(err => {
      resolve([])
    })
  }
}

/** 查询模型下拉树结构 */
function getModelTree() {
  getModelTreeApi().then(response => {
    if (response.code === 200) {
      treeOptions.value = response.data
      treeOptions.value.forEach(item => {
        item.label = item.dataModelName
        item.code = item.dataModelCode
      })
    }
  })
}

/** 根据模型查询数据表 */
const getSheetTree = (dataModelId) => {
  return new Promise((resolve, reject) => {
    getSheetTreeApi({dataModelId}).then(response => {
      if (response.code === 200 && response.data.length) {
        response.data.forEach(item => {
          item.label = item.dataTableName
          item.code = item.dataTableCode
        })
        resolve(response.data)
      } else {
        resolve([])
      }
    }).catch(err => {
      reject(err)
    })
  })
};

/** 根据数据表查询数据项 */
const getItemTree = (dataTableId) => {
  return new Promise((resolve, reject) => {
    getItemTreeApi({dataTableId}).then(response => {
      if (response.code === 200 && response.data.length) {
        response.data.forEach(item => {
          item.label = item.dataColumnName
          item.code = item.dataColumnCode
          item.leaf = true
        })
        resolve(response.data)
      } else {
        resolve([])
      }
    }).catch(err => {
      reject(err)
    })
  })
};

function getList() {
};

function queryList() {
  if (treeSelectArr.value.length) {
    console.log(treeSelectArr.value, 'treeSelectArr.value')
    initTableData();
  } else {
    proxy.$message.warning('请选择数据项!');
  }
};

getModelTree();
</script>

<style scoped lang="scss">
.association-query {
  padding: 10px;
  box-sizing: border-box;
  min-height: calc(100vh - 104px);

  .association-query-section {
    min-height: calc(100vh - 124px);

    .left-section {
      position: relative;

      .collapse-container {
        width: 92%;
        position: absolute;
        bottom: 35px;
        z-index: 999;
        border-right: 1px solid #ebeef5;

        .active-tag {
          margin: 2px 5px;
        }
      }

      .head-container-tree {

        .el-tree {
          // 此高度在此使用媒体查询设置不同高度
          height: 72.5vh !important;
          overflow-y: scroll;
        }

        .node-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .button-container {
        width: 30%;
        height: 30px;
        position: absolute;
        bottom: 3px;
        left: 35%;
        padding: 5px;
        box-sizing: border-box;
        margin: auto;
      }
    }

    .right-section {
      margin-top: 10px;

      .empty {
        .empty-text {
          text-align: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: #8a8a8a;
        }
      }
    }
  }

}
</style>
